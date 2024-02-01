using System;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

// Will be used to store information of the current statement
namespace THREAOcrBE.Models {
    [DataContract]
    public class DataValue {
        [DataMember]
        public decimal Debit { get; set; } 

        [DataMember]
        public decimal Credit { get; set; } 

        [DataMember]
        public decimal Bal { get; set; }

        [DataMember]
        public string Original { get; set; }

        [DataMember]
        public string Modified { get; set; }

        [DataMember]
        public bool NxtLineFixed { get; set; } 

        [DataMember]
        public string NxtLine { get; set; } 

        [DataMember]
        public string NxtLineModified { get; set; } 

        [DataMember]
        public DataValueCol ModCol { get; set; } 

        [DataMember]
        public DataValueCol NxtModCol { get; set; } 
        
        public DataValue(){
            SetDefaults();
        }

        // Note: Need to make the supplied value is in the same order for all format
        public DataValue(string value){
            SetDefaults();

            string[] valueArr = value.Split(" ");
            decimal dbt;
            decimal cur;
            decimal balance;

            string DebitStr = valueArr[0];
            string CreditStr = valueArr[1];
            string BalanceStr = valueArr[2];

            Regex valueRegex = new Regex(@"\d*\.{0,1}\d+", RegexOptions.IgnoreCase);
            string DebitRegex = valueRegex.Match(DebitStr).ToString(); // using match
            string CreditRegex = valueRegex.Match(CreditStr).ToString(); // using match
            string BalanceRegex = valueRegex.Match(BalanceStr).ToString(); // using match

            Console.WriteLine("DebitRegex:{0}, CreditRegex:{1}, BalanceRegex:{2}",
                DebitRegex, CreditRegex, BalanceRegex);

            Debit = decimal.TryParse(DebitRegex,out dbt)? dbt : 0.0m;
            Credit = decimal.TryParse(CreditRegex,out cur)? cur : 0.0m;
            Bal = decimal.TryParse(BalanceRegex,out balance)? balance : 0.0m;

            Original = toString();
            Modified = toString();

            if(!decimal.TryParse(DebitRegex,out dbt)){
                Console.WriteLine("DataValue.cs: Debit value not found");
            }

            if(!decimal.TryParse(CreditRegex,out cur)){
                Console.WriteLine("DataValue.cs: Credit value not found");
            }

            if(!decimal.TryParse(BalanceRegex,out balance)){
                Console.WriteLine("DataValue.cs: Balance value not found");
            }
        }

        public void SetDefaults(){
            Debit = 0.0m;
            Credit = 0.0m;
            Bal = 0.0m;
            NxtLineFixed = false;
            NxtLine = "";
            NxtLineModified = "";
            Original = "";
            Modified = "";

            ModCol = new DataValueCol();
            NxtModCol = new DataValueCol();
        }

        public decimal getDebit(){ return Math.Round(Debit,2); }

        public decimal getCredit(){ return Math.Round(Credit,2); }

        public decimal getBalance(){ return Math.Round(Bal,2); }

        public decimal setDebit(decimal value){
            Debit = Math.Round(value,2);
            return Debit;
        }

        public decimal setCredit(decimal value){
            Credit = Math.Round(value,2);
            return Credit;
        }

        public decimal setBalance(decimal value){
            Bal = Math.Round(value,2);
            Modified = toString();
            return Bal;
        }

        public string toString(){
            return Debit.ToString() + " " + Credit.ToString() + " " + Bal.ToString();
        }

        public bool isEmpty(){
            return (Debit == 0.0m) && (Credit == 0.0m) && (Bal == 0.0m);
        }

        public string setNextLine(string value){
            NxtLine = value;
            return NxtLine;
        }

        public string setNewNext(string value, string column, string status="modified"){
            NxtLineFixed = true;

            if(column == "Balance"){
                NxtModCol.Balance = true;
                NxtModCol.Status.Balance = status; 
            } else if(column == "Debit"){
                NxtModCol.Debit = true;
                NxtModCol.Status.Debit = status; 
            } else if(column == "Credit"){
                NxtModCol.Credit = true;
                NxtModCol.Status.Credit = status; 
            }
            
            NxtLineModified = value;

            Console.WriteLine("NxtLineModified: {0}",NxtLineModified);
            return NxtLineModified;
        }


    }

}