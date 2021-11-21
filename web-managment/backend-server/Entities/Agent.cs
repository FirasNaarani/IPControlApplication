using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Entities
{
    public class Agent
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [Required(ErrorMessage = "ip Required")]
        public String ip { get; set; }
        [Required(ErrorMessage = "hostname Required")]
        public String hostName { get; set; }
        public DateTime lasySync { get; set; }

    }
}
