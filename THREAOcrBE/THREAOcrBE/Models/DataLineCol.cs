using System;
using System.ComponentModel;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataLineCol {
        [DataMember]
        public string Name { get; set; } 

        [DataMember]
        public string Original  { get; set; } 

        [DataMember]
        [DefaultValue("")]            
        public string Modified { get; set; } 

        [DataMember]
        public int LineNum { get; set; } 

        [DataMember]
        public string NextVal { get; set; }

        [DataMember]
        public string[] Suggested { get; set; }

        // Status : accepted / review / pending / rejected
        [DataMember]
        public string Status { get; set; }

        public DataLineCol() {
            SetDefaults();
        }
        
        private void SetDefaults(){
            Name = "";
            Original = "";
            Modified = "";
            LineNum = 0;
            NextVal = "";
            Suggested = [];
            Status = "review";
        }

        public string ToString(){
            return(
                "{ Name:" + Name + ", " +
                "Original:" + Original + ", " +
                "Modified:" + Modified + ", " +
                "LineNum:" + LineNum + ", " +
                "NextVal:" + NextVal + ", " +
                "Status:" + Status + "}"
            );
        }
    }
}