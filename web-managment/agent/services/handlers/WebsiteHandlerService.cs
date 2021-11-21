using agent.api.dto;
using System;
using System.IO;
using System.Linq;

namespace agent.services
{
    class WebsiteHandlerService : IBlockService
    {
        readonly string filePath = @"C:\Windows\System32\drivers\etc\hosts";
        public bool Block(AgentCommmand agentCommmand)
        {
            try
            {
                if (WebsiteExists(agentCommmand))
                {
                    return true;
                }
                StreamWriter sw = new StreamWriter(filePath, true);
                string sitetoblock = "\n" + GetFormattedHostRecord(agentCommmand.value);
                sw.Write(sitetoblock);
                string sitetoblock1 = "\n" + GetFormattedHostRecord("www." + agentCommmand.value);
                sw.Write(sitetoblock1);

                sw.Close();
                Console.WriteLine("adding to hosts file: " + sitetoblock);
                return true;
            } catch (Exception ex)
            {
                Console.WriteLine("cannot block website: {0}, message: {1}", agentCommmand.value, ex.Message);
                return false;
            }
        }

        private string GetFormattedHostRecord(string hostName)
        {
            return "127.0.0.1 " + hostName;
        }

        public bool Unblock(AgentCommmand agentCommmand)
        {
            try
            {
                if (!WebsiteExists(agentCommmand))
                {
                    return true;
                }
                Console.WriteLine("removing from hosts file: " + GetFormattedHostRecord(agentCommmand.value));
                var tempFile = Path.GetTempFileName();
                var linesToKeep = File.ReadLines(filePath).Where(l => l != GetFormattedHostRecord("www" + agentCommmand.value) && l != GetFormattedHostRecord(agentCommmand.value) && l != "\n");
                File.WriteAllLines(tempFile, linesToKeep);
                File.Delete(filePath);
                File.Move(tempFile, filePath);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("cannot block website: {0}, message: {1}", agentCommmand.value, ex.Message);
                return false;
            }
        }

        private bool WebsiteExists(AgentCommmand cmd)
        {
            int foundWebsites = File.ReadLines(filePath).Where(l => l == GetFormattedHostRecord(cmd.value)).ToList().Count;
            return foundWebsites > 0;
        }
    }
}
