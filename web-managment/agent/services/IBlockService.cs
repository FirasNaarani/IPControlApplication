using agent.api.dto;
using System;

namespace agent.services
{
    public interface IBlockService
    {
        Boolean Block(AgentCommmand agentCommmand);
        Boolean Unblock(AgentCommmand agentCommmand);
    }
}
