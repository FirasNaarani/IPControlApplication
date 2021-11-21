using agent.api.dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace agent.api
{
    public class BlockerAPI
    {
        public async Task<Agent> createAgentAsync()
        {
            using (var client = new HttpClient())
            {
                string url = GetApiEndpoint("agent");
                CreateAgent createAgent = new CreateAgent();
                createAgent.ip = GetLocalIPAddress();
                createAgent.hostName = GetHostName();
                var response = await client.PostAsJsonAsync(url, createAgent);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Agent>(responseBody); ;
            };
        }

        public async Task<List<AgentCommmand>> getCommandsForSync(string agentId)
        {
            using (var client = new HttpClient())
            {
                string url = GetApiEndpoint("command");
                url = $"{url}";
                var response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<AgentCommmand>>(responseBody); ;
            };
        }

        public async Task<Boolean> updateLastSync(string agentId)
        {
            using (var client = new HttpClient())
            {
                HttpContent httpContent = new StringContent("");
                string url = GetApiEndpoint("agent/" + agentId);
                var response = await client.PutAsync(url, httpContent);
                response.EnsureSuccessStatusCode();
                return true;
            };
        }

        string GetApiEndpoint(string path)
        {
            string url = ConfigurationManager.AppSettings["EndpointURL"];
            return String.Format("{0}/{1}", url, path);
        }
        public static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        string GetHostName()
        {
            return Dns.GetHostName();
        }
    }
}
