using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

namespace THREAOcrBE.Models {
    [DataContract]
    public class WsConnection {
        public WsConnection(){
        }

        [DataMember]
        public string username { get; set; } = string.Empty;

    }

}