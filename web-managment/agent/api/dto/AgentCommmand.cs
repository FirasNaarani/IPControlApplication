using System;

namespace agent.api.dto
{
    public class AgentCommmand
    {
        public string Id { get; set; }
        public ResourceType resourceType { get; set; }
        public string value { set; get; }
        public DateTime dateAdded { set; get; }
        public long operationDurationMinutes { set; get; }
        public bool isActive { set; get; }
    }
}
