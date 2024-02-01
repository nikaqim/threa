using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataLineRowStatus {
        // accepted, modified, pending, rejected

        [DataMember(Name = "Date")]
        public string Date { get; set; }

        [DataMember(Name = "Descr")]
        public string Descr { get; set; } 

        [DataMember(Name = "Value")]
        public string Value { get; set; } 

        public DataLineRowStatus(){
            SetDefaults();
        }

        public void SetDefaults(){
            Date = "accepted";
            Descr = "accepted";
            Value = "accepted";
        }

        public string[] getModifiedColumn(){
            List<string> AllModified = new List<string>();
            if(Date != "accepted"){
                AllModified.Add("Date");
            }

            if(Descr != "accepted"){
                AllModified.Add("Descr");
            }

            if(Value != "accepted"){
                AllModified.Add("Value");
            }

            return AllModified.ToArray();
        }

        public bool LineNotModified(){
            return (Date == "accepted") && (Descr == "accepted") && (Value == "accepted");
        }
    }
}