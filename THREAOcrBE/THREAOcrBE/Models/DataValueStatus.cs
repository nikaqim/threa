using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataValueStatus {
        // accepted, modified, pending, rejected

        [DataMember(Name = "Balance")]
        public string Balance { get; set; }

        [DataMember(Name = "Credit")]
        public string Credit { get; set; } 

        [DataMember(Name = "Debit")]
        public string Debit { get; set; } 

        public DataValueStatus(){
            SetDefaults();
        }

        public void SetDefaults(){
            Balance = "accepted";
            Credit = "accepted";
            Debit = "accepted";
        }

    }
}