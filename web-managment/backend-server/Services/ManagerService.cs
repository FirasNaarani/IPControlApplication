using backend.Entities;
using backend.Infra;
using backend.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class ManagerService
    {
        private readonly IMongoCollection<Manager> _managers;

        public ManagerService(IManagerDBSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _managers = database.GetCollection<Manager>(settings.ManagerCollectionName);
            _managers.Indexes.CreateOne(
                new CreateIndexModel<Manager>(Builders<Manager>.IndexKeys.Descending(model => model.username),
                new CreateIndexOptions { Unique = true })
            );
            _managers.Indexes.CreateOne(
                new CreateIndexModel<Manager>(Builders<Manager>.IndexKeys.Descending(model => model.email),
                new CreateIndexOptions { Unique = true })
            );
        }
        public List<Manager> Get()
        {
            var managers = _managers.Find(m => m.isActive).ToList();
            managers.ForEach(m => m.password = "");
            return managers;
        }

        public Boolean isValidCredentials(string username, string password)
        {
            password = EncryptDecryptPassword.EncryptPlainTextToCipherText(password);
            Manager manager = _managers.Find(m => m.password == password && m.username == username && m.isActive == true).FirstOrDefault();
            return manager != null;
        }

        public Manager Get(string id)
        {
            var manager = _managers.Find<Manager>(manager => manager.Id == id).FirstOrDefault();
            manager.password = "";
            return manager;
        }
        public Manager Create(Manager manager)
        {
            manager.isActive = true;
            manager.password = EncryptDecryptPassword.EncryptPlainTextToCipherText(manager.password);
            try
            {
                _managers.InsertOne(manager);
            } catch (Exception ex)
            {
                if (ex.Message.Contains("duplicate"))
                {
                    throw new Exception("duplicate user");
                }
            }
            manager.password = "";
            return manager;
        }

        public void UpdatePassword(string id, UpdatePassword manager)
        {
            manager.password = EncryptDecryptPassword.EncryptPlainTextToCipherText(manager.password);
            var filter = Builders<Manager>.Filter.Where(_ => _.Id == id);
            var update = Builders<Manager>.Update
                        .Set(_ => _.password, manager.password);
            var options = new FindOneAndUpdateOptions<Manager>();
            _managers.FindOneAndUpdate(filter, update, options);
        }

        internal void Delete(string id)
        {
            var filter = Builders<Manager>.Filter.Where(_ => _.Id == id);
            var update = Builders<Manager>.Update
                        .Set(_ => _.isActive, false);
            var options = new FindOneAndUpdateOptions<Manager>();
            _managers.FindOneAndUpdate(filter, update, options);
        }

        public void Update(string id, UpdateManager manager)
        {
            var filter = Builders<Manager>.Filter.Where(_ => _.Id == id);
            var update = Builders<Manager>.Update
                        .Set(_ => _.email, manager.email)
                        .Set(_ => _.name, manager.name)
                        .Set(_ => _.username, manager.username);
            var options = new FindOneAndUpdateOptions<Manager>();
            _managers.FindOneAndUpdate(filter, update, options);
        }
    }
}
