using backend.Entities;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class AgentService
    {
        private readonly IMongoCollection<Agent> _agents;

        public AgentService(IAgentDBSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _agents = database.GetCollection<Agent>(settings.AgentCollectionName);
            _agents.Indexes.CreateOne(
                new CreateIndexModel<Agent>(Builders<Agent>.IndexKeys.Descending(model => model.hostName),
                new CreateIndexOptions { Unique = true })
            );
            _agents.Indexes.CreateOne(
                new CreateIndexModel<Agent>(Builders<Agent>.IndexKeys.Descending(model => model.ip),
                new CreateIndexOptions { Unique = true })
            );
        }
        public Agent Get(string id)
        {
            return _agents.Find<Agent>(agent => agent.Id == id).FirstOrDefault();
        }
        public Agent GetByIpAndHostName(string ip, string hostName)
        {
            return _agents.Find<Agent>(agent => agent.ip == ip && agent.hostName == hostName).FirstOrDefault();
        }
        public Agent GetByIp(string ip)
        {
            return _agents.Find<Agent>(agent => agent.ip == ip).FirstOrDefault();
        }
        public Agent Create(Agent agent)
        {
            try
            {
                agent.lasySync = DateTime.Now;
                _agents.InsertOne(agent);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("duplicate"))
                {
                    throw new Exception("duplicate agent");
                }
            }
            return agent;
        }

        public List<Agent> Get()
        {
            return _agents.Find(manager => true).ToList();
        }
        public void Update(string id, Agent agent) =>
          _agents.ReplaceOne(obj => obj.Id == id, agent);
    }
}
