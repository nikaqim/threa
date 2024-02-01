using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataLineRow {
        [DataMember]
        public string Original  { get; set; } 

        [DataMember]
        public string Modified  { get; set; } 

        [DataMember]
        public int LineNum { get; set; } 

        [DataMember]
        public DataLineRowStatus Status { get; set; } // accepted, modified, pending, rejected

        [DataMember]
        public DataLineCol Date { get; set; }

        [DataMember]
        public DataLineCol Descr { get; set; }

        [DataMember]
        public DataValue Value { get; set; }

    }
}