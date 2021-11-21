using agent.api.dto;
using System;
using System.Diagnostics;

namespace agent.services
{
    class ApplicationHandlerService : IBlockService
    {
        public bool Block(AgentCommmand agentCommmand)
        {
            try
            {
                Process[] processes = Process.GetProcessesByName(agentCommmand.value);
                Console.WriteLine("got process: {0}, count = {1}", agentCommmand.value, processes.Length);
                foreach (var process in processes)
                {
                    process.Kill();
                }
            } catch (Exception ex)
            {
                Console.WriteLine("cannot block application: {0}, error = {1}", agentCommmand.value, ex.Message);
                return false;
            }
            return true;
        }

        public bool Unblock(AgentCommmand agentCommmand)
        {
            return true;
        }
    }
}
