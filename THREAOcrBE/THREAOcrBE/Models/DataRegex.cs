using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataRegex {
        [DataMember]
        public string OriginalMatch { get; set; }

        [DataMember]
        public string MatchString { get; set; } 

        [DataMember]
        public MatchCollection MatchCollection { get; set; } 

    }
}