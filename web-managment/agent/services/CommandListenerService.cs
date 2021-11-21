using agent.api;
using agent.api.dto;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            if (commands != null)
            {
                Console.WriteLine("Got Commands: " + commands.Count);
                foreach (AgentCommmand cmd in commands)
                {
                    try
                    {
                        IBlockService blockService = BlockServiceFactory.Create(cmd.resourceType);
                        if (cmd.isActive)
                        {
                            if (cmd.operationDurationMinutes == 0)
                            {
                                if (cmd.resourceType.ToString() == "Application")
                                {
                                    if (blockService.isBlocked(cmd))
                                    {
                                        Console.WriteLine("trying to block(no expiration date): " + cmd.value);
                                        blockService.Block(cmd);
                                        Console.WriteLine("blocked: " + cmd.value);
                                    }
                                    else
                                    {
                                        Console.WriteLine("already blocked: " + cmd.value);
                                    }
                                }
                                else
                                {
                                    if (!blockService.isBlocked(cmd))
                                    {
                                        Console.WriteLine("trying to block(no expiration date): " + cmd.value);
                                        blockService.Block(cmd);
                                        Console.WriteLine("blocked: " + cmd.value);
                                    }
                                    else
                                    {
                                        Console.WriteLine("already blocked: " + cmd.value);
                                    }
                                }
                            }
                            else
                            {
                                var expirationDate = cmd.dateAdded.AddMinutes(cmd.operationDurationMinutes);
                                if (DateTime.UtcNow > expirationDate)
                                {
                                    Console.WriteLine("trying to unblock expired cmd: " + cmd.value);
                                    if (blockService.isBlocked(cmd))
                                    {
                                        blockService.Unblock(cmd);
                                        Console.WriteLine("unblocked: " + cmd.value);
                                    }
                                    else
                                    {
                                        Console.WriteLine("already blocked: " + cmd.value);
                                    }
                                }
                                else
                                {
                                    if (cmd.resourceType.ToString() == "Application")
                                    {
                                        if (blockService.isBlocked(cmd))
                                        {
                                            Console.WriteLine("trying to block: " + cmd.value);
                                            blockService.Block(cmd);
                                            Console.WriteLine("blocked: " + cmd.value);
                                        }
                                        else
                                        {
                                            Console.WriteLine("already blocked: " + cmd.value);
                                        }
                                    }
                                    else
                                    {
                                        if (!blockService.isBlocked(cmd))
                                        {
                                            Console.WriteLine("trying to block: " + cmd.value);
                                            blockService.Block(cmd);
                                            Console.WriteLine("blocked: " + cmd.value);
                                        }
                                        else
                                        {
                                            Console.WriteLine("already blocked: " + cmd.value);
                                        }
                                    }
                                }
                            }

                        }
                        else
                        {
                            Console.WriteLine("trying to unblock deleted cmd: " + cmd.value);
                            if (blockService.isBlocked(cmd))
                            {
                                blockService.Unblock(cmd);
                                Console.WriteLine("unblocked: " + cmd.value);
                                
                            }
                            else
                            {
                                Console.WriteLine("already blocked: " + cmd.value);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("block failed: " + ex.Message);
                    }
                }
            }
            runProcess("ipconfig /flushdns");
            runProcess("arp -d");
        }
        private void runProcess(String command)
        {
            Process cmd = new Process();
            cmd.StartInfo.FileName = "cmd.exe";
            cmd.StartInfo.RedirectStandardInput = true;
            cmd.StartInfo.RedirectStandardOutput = true;
            cmd.StartInfo.CreateNoWindow = true;
            cmd.StartInfo.UseShellExecute = false;
            cmd.Start();

            cmd.StandardInput.WriteLine(command);
            cmd.StandardInput.Flush();
            cmd.StandardInput.Close();
            cmd.WaitForExit();
            Console.WriteLine(cmd.StandardOutput.ReadToEnd());
        }
    }
}
