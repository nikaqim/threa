using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataDateValue {
        public DataDateValue(int year, int month, int day){
            Year = year;
            Month = month;
            Day = day;
        }

        [DataMember]
        public int Year { get; set; } 

        [DataMember]
        public int Month { get; set; } 

        [DataMember]
        public int Day { get; set; } 

    }

}