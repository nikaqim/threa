using System.Collections.Concurrent;
using THREAOcrBE.Models;

namespace THREAOcrBE.Services.Data {
    public class SharedDb {
        private readonly ConcurrentDictionary<string, WsConnection> _connections = new ConcurrentDictionary<string, WsConnection>();

        public ConcurrentDictionary<string, WsConnection> connections => _connections;
    }
}