using agent.api.dto;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace agent.services
{
    class WebsiteHandlerService : IBlockService
    {
        readonly string filePath = @"C:\Windows\System32\drivers\etc\hosts.ics";
        // readonly string filePath1 = @"C:\Windows\System32\drivers\etc\hosts";
        public bool Block(AgentCommmand agentCommmand)
        {
            try
            {
                if (!isBlocked(agentCommmand))
                {
                    blockWebsite(agentCommmand);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("cannot block website: {0}, message: {1}", agentCommmand.value, ex.Message);
                return false;
            }
        }

        private string GetFormattedHostRecord(string hostName)
        {
            return "192.168.1.3 " + hostName;
        }

        public bool Unblock(AgentCommmand agentCommmand)
        {
            try
            {
                if (isBlocked(agentCommmand))
                {
                    Console.WriteLine("removing from hosts file: " + GetFormattedHostRecord(agentCommmand.value));
                    unBlockWebsite(agentCommmand);

                }
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("cannot block website: {0}, message: {1}", agentCommmand.value, ex.Message);
                return false;
            }
        }
        private void blockWebsite(AgentCommmand agentCommmand)
        {
            blockWebsite(agentCommmand, filePath);
            //blockWebsite(agentCommmand, filePath1);
        }
        private void blockWebsite(AgentCommmand agentCommmand, String newFilePath)
        {
            try
            {
                using (FileStream fileStream = File.Open(newFilePath, FileMode.Append))
                {
                    using (StreamWriter sw = new StreamWriter(fileStream))
                    {
                        string sitetoblock = GetFormattedHostRecord(agentCommmand.value);
                        sw.WriteLine(sitetoblock);
                        string sitetoblock1 = GetFormattedHostRecord("www." + agentCommmand.value);
                        sw.WriteLine(sitetoblock1);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("cannot block:" + e.Message);
            }
        }
        private void unBlockWebsite(AgentCommmand agentCommmand)
        {
            unBlockWebsite(agentCommmand, filePath);
            //unBlockWebsite(agentCommmand, filePath1);
        }
        private void unBlockWebsite(AgentCommmand agentCommmand, String newFilePath)
        {
            try
            {
                var tempFile = Path.GetTempFileName();
                var linesToKeep = File.ReadLines(newFilePath).Where(l => l != GetFormattedHostRecord("www." + agentCommmand.value) && l != GetFormattedHostRecord(agentCommmand.value) && l != Environment.NewLine).ToList();
                File.WriteAllLines(newFilePath, linesToKeep);
            }
            catch (Exception e)
            {
                Console.WriteLine("cannot unblock:" + e.Message);
            }
        }

        public bool isBlocked(AgentCommmand cmd, String path)
        {
            if (File.Exists(path))
            {
                List<String> foundWebsites = File.ReadLines(path).Where(l => l == GetFormattedHostRecord(cmd.value)).ToList();
                return foundWebsites.Count > 0;
            }
            Console.WriteLine("host file do not exist");
            return false;
        }
        public Boolean isBlocked(AgentCommmand cmd)
        {
            return isBlocked(cmd, filePath); // && isBlocked(cmd, filePath1);
        }
    }
}
