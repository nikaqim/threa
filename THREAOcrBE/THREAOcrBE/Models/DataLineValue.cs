using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataLineValue {
        [DataMember]
        public string Name  { get; set; } 

        [DataMember]
        public string Original  { get; set; } 

        [DataMember]
        public string Modified  { get; set; } 

        [DataMember]
        public int LineNum { get; set; } 

        [DataMember]
        public string Status { get; set; } // accepted, modified, pending, rejected

        [DataMember]
        public DataLineCol Debit { get; set; }

        [DataMember]
        public DataLineCol Credit { get; set; }

        [DataMember]
        public DataLineCol Bal { get; set; }

        [DataMember]
        public string[] ModifiedCol { get; set; } 

    }
}