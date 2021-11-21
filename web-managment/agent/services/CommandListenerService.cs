using agent.api;
using agent.api.dto;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace agent.services
{
    public class CommandListenerService
    {
        private const int AGENT_MAX_RETRIES = 10;
        private const int AGENT_RETRY_INTERVAL = 600000;

        private readonly BlockerAPI blockerAPI;

        private Agent agent;
        public CommandListenerService()
        {
            blockerAPI = new BlockerAPI();
        }
        public async Task RegisterAgent()
        {
            await RegisterAgentWithRetries(1);
        }
        async Task RegisterAgentWithRetries(int retriesCounter)
        {
            Boolean isSuccess = false;
            try
            {
                while (retriesCounter < AGENT_MAX_RETRIES && !isSuccess)
                {
                    Console.WriteLine("registering agent...");
                    agent = await blockerAPI.createAgentAsync();
                    isSuccess = true;
                    Console.WriteLine("agent registered:{0}", agent.Id);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("cannot register agent({0}/{1}), error = {2}", retriesCounter, AGENT_MAX_RETRIES, e.Message);
                Thread.Sleep(retriesCounter * AGENT_RETRY_INTERVAL);
                await RegisterAgentWithRetries(++retriesCounter);
            }
        }
        public async Task RunSyncWithAPI()
        {
            if (agent == null)
            {
                Console.WriteLine("agent is not registerd");
                return;
            }
            List<AgentCommmand> commands = await blockerAPI.getCommandsForSync(agent.Id);
            Console.WriteLine("Got Commands: " + commands.Count);
            foreach (AgentCommmand cmd in commands)
            {
                try
                {
                    Console.WriteLine("trying to block: " + cmd.value);
                    IBlockService blockService = BlockServiceFactory.Create(cmd);
                    if (cmd.isActive)
                    {
                        if (cmd.operationDurationMinutes == 0)
                        {
                            blockService.Block(cmd);
                        }
                        else
                        {
                            var expirationDate = cmd.dateAdded.AddMinutes(cmd.operationDurationMinutes);
                            if (DateTime.UtcNow > expirationDate)
                            {
                                blockService.Unblock(cmd);
                            }
                            else
                            {
                                blockService.Block(cmd);
                            }
                        }

                    }
                    else
                    {
                        blockService.Unblock(cmd);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("block failed: " + ex.Message);
                }
            }
        }
    }
}
