
using THREAOcrBE.Models;

namespace THREAOcrBE.Services {
    public class CustomDate {
        DataDateValue Date;

        public CustomDate(DataDateValue d){
            Date = d;
        }
        
        public string ToString(){
            return Date.Day + "/" + Date.Month + "/" + Date.Year;
        }

        public string ToShortString(bool Month2Digit=true){
            string Month = Date.Month.ToString();

            if(Month2Digit){
                if(Date.Month < 10){
                    Month = "0" + Date.Month.ToString();
                }
            }

            string minifiedYear = Date.Year.ToString().Remove(0,2);
            return Date.Day + "/" + Month + "/" + minifiedYear;
        }

        public int GetYear(){
            return Date.Year;
        }

        public int GetMonth(){
            return Date.Month;
        }

        public int GetDay(){
            return Date.Day;
        }

        public int SetYear(int value){
            Date.Year = value;
            return Date.Year;
        }

        public int SetMonth(int value){
            Date.Month = value;
            return Date.Month;
        }

        public int SetDay(int value){
            Date.Day = value;
            return Date.Day;
        }
    }
}