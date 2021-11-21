using backend.Entities;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class CommandService
    {
        private readonly IMongoCollection<AgentCommmand> _commands;

        public CommandService(ICommandDBSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _commands = database.GetCollection<AgentCommmand>(settings.CommandCollectionName);
        }
        public AgentCommmand Get(string id)
        {
            var Command = _commands.Find<AgentCommmand>(command => command.Id == id).FirstOrDefault();
            return Command;
        }
        public AgentCommmand Create(AgentCommmand command)
        {
            try
            {
                command.dateAdded = DateTime.Now;
                command.isActive = true;
                _commands.InsertOne(command);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("duplicate"))
                {
                    throw new Exception("duplicate command");
                }
            }
            return command;
        }

        internal ActionResult<List<AgentCommmand>> GetAfterDate(DateTime lasySync)
        {
            return _commands.Find(cmd => cmd.dateAdded.CompareTo(lasySync) > 0).ToList();
        }

        public List<AgentCommmand> GetAll()
        {
            return _commands.Find(_ => true).ToList().OrderBy(item => item.dateAdded).ToList();
        }

        public List<AgentCommmand> GetActive()
        {
            return _commands.Find(_ => _.isActive).ToList().OrderByDescending(item => item.dateAdded).ToList();
        }

        public void Update(string id, UpdateCommand command)
        {
            var dateAdded = DateTime.Now;
            var filter = Builders<AgentCommmand>.Filter.Where(_ => _.Id == id);
            var update = Builders<AgentCommmand>.Update
                        .Set(_ => _.resourceType, command.resourceType)
                        .Set(_ => _.operationDurationMinutes, command.operationDurationMinutes)
                        .Set(_ => _.dateAdded, dateAdded)
                        .Set(_ => _.value, command.value);
            var options = new FindOneAndUpdateOptions<AgentCommmand>();
            _commands.FindOneAndUpdate(filter, update, options);
        }

        public void Delete(string id)
        {
            var filter = Builders<AgentCommmand>.Filter.Where(_ => _.Id == id);
            var update = Builders<AgentCommmand>.Update
                        .Set(_ => _.isActive, false);
            var options = new FindOneAndUpdateOptions<AgentCommmand>();
            _commands.FindOneAndUpdate(filter, update, options);
           
        }
    }
}
