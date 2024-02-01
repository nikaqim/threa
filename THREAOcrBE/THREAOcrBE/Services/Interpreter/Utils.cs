using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using Microsoft.Extensions.ObjectPool;
using THREAOcrBE.Models;

namespace THREAOcrBE.Services {
    public class Utils {
        static public void Write2Csv(string filename, List<string> data){
            using (StreamWriter writer = new StreamWriter(filename, true))
            {
                // Write data
                if (data != null)
                {
                    writer.WriteLine(string.Join(",", data));
                }
            }
        }

        static public DataRegex GetDataRegex(string text, string Rule=@"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}", string type="date", string format="ddmmyy"){
            /* finding date pattern - start of row */
            DataRegex rtnData = new DataRegex();
            
            string DateRule = Rule;
            Regex dateRegex = new Regex(DateRule, RegexOptions.IgnoreCase);
            string dateRegexResult = dateRegex.Match(text).ToString(); // using match
            rtnData.OriginalMatch = dateRegexResult;

            MatchCollection matchDate = dateRegex.Matches(text); // using match collection

            // affin islamic format
            if(type == "date"){

                if(format=="ddmmyy"){
                    int noOfSplitEl = dateRegexResult.Length - dateRegexResult.Replace("/","").Length;

                    if ((!string.IsNullOrWhiteSpace(dateRegexResult)) && (noOfSplitEl < 2)){
                        string modifiedDate = dateRegexResult.Replace("/", "");
                        modifiedDate = modifiedDate.Insert(modifiedDate.Length-2, "/");
                        modifiedDate = modifiedDate.Insert(modifiedDate.Length-5, "/");

                        Console.WriteLine("Date format is readjusting: {0} -> {1}", dateRegexResult, modifiedDate);
                        dateRegexResult = modifiedDate;
                    }

                }
            }
            
            rtnData.MatchString = dateRegexResult;
            rtnData.MatchCollection = matchDate;

            return rtnData;
        }


    }
}

// ------------- Line data: 5/09/23 SERVICE CHARGE 2.00. .00 6521.90 -------------