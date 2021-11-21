using agent.services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace agent
{
    class Program
    {
        static CommandListenerService commandListenerService = new CommandListenerService();
        static Timer timer;
        static bool isRunning = false;
        static async Task Main(string[] args)
        {
            await commandListenerService.RegisterAgent();
            RunSyncProcess();
            Console.ReadLine();
        }
        static void RunSyncProcess()
        {
            var startTimeSpan = TimeSpan.Zero;
            var periodTimeSpan = TimeSpan.FromSeconds(2);
            timer = new Timer(async (e) =>
           {
               if (isRunning)
               {
                   Console.WriteLine("is running, skipping");
                   return;
               }
               isRunning = true;
               Console.WriteLine(" =================================== running sync agent from API ===================================");
               await commandListenerService.RunSyncWithAPI();
               isRunning = false;
           }, null, startTimeSpan, periodTimeSpan);
        }
    }
}
