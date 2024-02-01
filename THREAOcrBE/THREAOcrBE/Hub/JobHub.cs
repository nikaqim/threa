using Microsoft.AspNetCore.SignalR;
using THREAOcrBE.Controllers;
using THREAOcrBE.Models;
using THREAOcrBE.Services.Data;

namespace THREAOcrBE.Hubs {
    public interface IChatClient {

        Task OnConnect(string username, string welcomeMsg);
        Task ReceiveMessage(string username, string msg);

        Task OnCompleted(string username, string msg);
        
    }

    public class JobHub:Hub<IChatClient> { 

        private readonly SharedDb _shared;

        public JobHub(SharedDb shared){
            _shared = shared;
        }

        public async Task OnConnect(WsConnection user){
            Console.WriteLine("Client trying to connect...");

            _shared.connections[Context.ConnectionId] = user;

            await Clients.All.OnConnect("admin", $"{ user.username } is connected!");
        }

        public async Task SendMessage(string msg){
            if(_shared.connections.TryGetValue(Context.ConnectionId, out WsConnection conn)){
                await Clients.All.ReceiveMessage(conn.username, msg);
            }
        }

        public async Task Completed(string msg){
            if(_shared.connections.TryGetValue(Context.ConnectionId, out WsConnection conn)){
                await Clients.All.OnCompleted(conn.username, msg);
            }
        }

    }

}