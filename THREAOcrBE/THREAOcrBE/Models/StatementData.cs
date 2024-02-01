using System;
using System.Runtime.Serialization;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class StatementRecord {
        [DataMember]
        public double OpeningBalance { get; set; } 

        [DataMember]
        public DateOnly? RowDate { get; set; } 

        [DataMember]
        public DateOnly? StatementDate { get; set; } 

        [DataMember]
        public double Balance { get; set; } 

        [DataMember]
        public string[] StatementData { get; set; } 

    }
}
