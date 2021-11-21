using agent.services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace agent
{
    class Program
    {
        static CommandListenerService commandListenerService = new CommandListenerService();
        static Timer Timer;
        static async Task Main(string[] args)
        {
            await commandListenerService.RegisterAgent();
            RunSyncProcess();
            Console.ReadLine();
        }
        static void RunSyncProcess()
        {
            var startTimeSpan = TimeSpan.Zero;
            var periodTimeSpan = TimeSpan.FromSeconds(1);
            Timer = new Timer(async (e) =>
           {
               Console.WriteLine("running sync agent from API");
               await commandListenerService.RunSyncWithAPI();
           }, null, startTimeSpan, periodTimeSpan);
        }
    }
}
