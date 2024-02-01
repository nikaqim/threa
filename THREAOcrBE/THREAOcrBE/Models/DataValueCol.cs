using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataValueCol {
        [DataMember]
        public bool Balance { get; set; }

        [DataMember]
        public bool Credit { get; set; } 

        [DataMember]
        public bool Debit { get; set; } 

        [DataMember]
        public DataValueStatus Status { get; set; } 

        public DataValueCol(){
            SetDefaults();
        }  

        public void SetDefaults(){
            Balance = false;
            Credit = false;
            Debit = false;

            Status = new DataValueStatus();
        }

    }
}