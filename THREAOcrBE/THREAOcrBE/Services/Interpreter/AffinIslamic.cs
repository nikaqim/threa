using System;
using System.IO;
using System.Reflection;
using System.Reflection.PortableExecutable;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using static iText.Kernel.Pdf.Colorspace.PdfSpecialCs;

// using OpenCV;
using IronOcr;
using IronSoftware.Drawing;
using Tesseract;
using System.Globalization;

using THREAOcrBE.Models;
using Aspose.Pdf;
using Emgu.CV.CvEnum;
using Microsoft.AspNetCore.SignalR;
using THREAOcrBE.Hubs;
using System.Diagnostics.CodeAnalysis;
using iText.Layout.Splitting;

namespace THREAOcrBE.Services {
        
    public class AffinIslamic {

        private bool headerAssigned = false;
        private readonly IHubContext<JobHub, IChatClient> _hubContext;
        private string filepath;

        public AffinIslamic (string inputFileName, IHubContext<JobHub, IChatClient> hubContext){
            filepath = inputFileName;
            _hubContext = hubContext;
        }

        public async Task<JobResultModel> DecodeFile(string inputFileName){
            string outputFileName = inputFileName.Replace("images2pdf", "pdf2csv")
                .Replace(".pdf", ".csv");

            if(File.Exists(outputFileName)){
                File.Delete(outputFileName);
            }

            Utils.Write2Csv(
                outputFileName, 
                ["Date", "Transaction Description", "Debit", "Credit", "Balance"]
            );

            await _hubContext.Clients.All.ReceiveMessage("System", "In Affin Islamic interpreter....");

            var ocr = new IronTesseract();
            ocr.Language = OcrLanguage.EnglishBest;
            ocr.AddSecondaryLanguage(OcrLanguage.MalayBest);
            ocr.Configuration.ReadBarCodes = false;

            ocr.Configuration.BlackListCharacters = "~\"<>`$#^*_}{][|\\";
            ocr.Configuration.WhiteListCharacters = "0123456789./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

            // OcrResult.Table
            ocr.Configuration.PageSegmentationMode = TesseractPageSegmentationMode.SingleBlock;
            ocr.Configuration.ReadDataTables = true;

            // for Table Content
            ocr.UseCustomTesseractLanguageFile("/home/nikaqim/Workspace/Projects/THREA/OCR/threaocr/modules/TrainnedData/InterTight.traineddata");
            // ocr.UseCustomTesseractLanguageFile("/usr/share/tesseract-ocr/4.00/tessdata/InterTight.traineddata");

            using var input = new OcrInput();
            var contentArea = new IronSoftware.Drawing.Rectangle(x: 100, y: 673, height: 1195, width: 1500); // at scale 100

            Console.WriteLine("Translating document....\nTesseractVersion:{0}", ocr.Configuration.TesseractVersion);
            
            // reading from pdf
            input.AddPdf(inputFileName, null, contentArea);
            // input.AddPdfPage(inputFileName, 0, null, contentArea, DPI:200);

            input.Deskew();
            input.DeNoise();
            input.Invert(true);
            
            /* Save output image for verification on scanned images */
            input.SaveAsImages("ocrOutputImage");

            OcrResult result = ocr.Read(input);

            Console.WriteLine("--------------------------------------------------");
            Console.WriteLine("Overall confidence level:{0}", result.Confidence);

            // check page confidence
            int i = 0;
            foreach (var page in result.Pages)
            {
                Console.WriteLine("Page{0} confidence level: {1}", i, page.Confidence);
                i++;
            }
            
            string[] TableContent = result.Text.Split("\n");
            
            Console.WriteLine("Table containes {0} lines....", TableContent.Length);
            Console.WriteLine("--------------------------------------------------\n");

            JobResultModel Results = await DataCheck(TableContent, outputFileName);
            Console.WriteLine("Results count:{0}",Results.Results.Count());

            return Results;
        }

        public async Task<JobResultModel> DataCheck(string[] FileContent, string outputFileName){
            Console.WriteLine("Running DataCheck...");

            JobResultModel Results = new JobResultModel();
            DataLineCol CurrentDate = new DataLineCol();
            DataValue CurrentValue = new DataValue();

            string[] csvLineData = null;
            int headerCount = 0;
            int lineCount = 0;

            foreach(string line in FileContent){
                Console.WriteLine("------------- Line data: {0} -------------", line);

                int descrIdx = getDescrEndIdx(line);

                var matchDateCheck = Regex.Match(line, @"\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                int dateIdxStart = matchDateCheck.Index > 0 ? matchDateCheck.Index : 0;

                lineCount = lineCount + 1; /* Todo: Need to revalidate on lineCount assignment to ensure lineNum accuracies */

                if(!string.IsNullOrWhiteSpace(line)){
                    // if line is not header
                    if((!string.IsNullOrWhiteSpace(line)) && ((!isHeader(line)) && (headerCount < 1))){
                        
                        DataLineCol CurrentDescr = new DataLineCol();
                        DataLineRow RowData = new DataLineRow();
                        
                        RowData.Original = line.Substring(0);
                        RowData.LineNum = lineCount;

                        string duplicateLine = removeLineOutliers(line);

                        /* finding date pattern - start of row */
                        DataRegex DateRegex = Utils.GetDataRegex(duplicateLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                        string dateRegexResult = DateRegex.MatchString; // using match

                        duplicateLine = !string.IsNullOrWhiteSpace(dateRegexResult) ?
                            duplicateLine.Replace(DateRegex.OriginalMatch, DateRegex.MatchString):
                            duplicateLine;

                        MatchCollection matchDate = DateRegex.MatchCollection; // using match collection

                        /* finding descr pattern */
                        DataRegex DescRegex = Utils.GetDataRegex(duplicateLine, @"([a-zA-Z]+\s*/*)+", "descr");
                        string descRegexResult = DescRegex.MatchString; // using match
                        MatchCollection matchDesc = DescRegex.MatchCollection; // using match collection

                        // check for expected descr index -> if non check for regexed descr
                        int dateRegexResultLen = dateRegexResult.Length;

                        // removing outliers from descr if any
                        descRegexResult = descrIdx > 0 ? 
                            duplicateLine.Substring(dateRegexResultLen, descrIdx-dateRegexResultLen-dateIdxStart) :
                            descRegexResult;

                        /* Condition for valid row */
                        bool isDataRow = (matchDate.Count > 0) && (matchDesc.Count > 0);

                        // recognising 0 as o
                        descRegexResult = descRegexResult.Replace("o", "").Trim(); 

                        if(string.IsNullOrWhiteSpace(dateRegexResult)){
                            Console.WriteLine("Date Not Found!!");
                        }
                        Console.WriteLine("Descr Matching: {0} -> csvLineData({1})", descRegexResult, csvLineData != null);   
                        // Console.WriteLine("Date Matching: {0}", dateRegexResult);  
                        
                        // if row contain values
                        if(isDataRow){
                            if((csvLineData != null)){
                                if(csvLineData.Length > 0){
                                    var writeData = string.Join(",", csvLineData);

                                    Console.WriteLine("\nWriting to csv: {0}\n", writeData);

                                    Utils.Write2Csv(
                                        outputFileName, 
                                        csvLineData.ToList()
                                )   ;
                                }
                            }

                            // check if current date is valid
                            CurrentDate = DateCheck(FileContent, lineCount, CurrentDate.Modified);
                            // Console.WriteLine("CurrentDate.Original:{0},CurrentDate.Modified:{1}",CurrentDate.Original,CurrentDate.Modified);

                            // assign data to datalinerow
                            RowData.Date = CurrentDate;

                            // data massage
                            duplicateLine = prepareValue(duplicateLine, dateRegexResult, descRegexResult, CurrentValue.Modified);

                            // processing values into 3 columns only
                            duplicateLine = processValue(duplicateLine); 

                            string[] nextValueLines = GetNextLine(FileContent, lineCount);

                            duplicateLine = CurrentValue.NxtLineFixed ? 
                                CurrentValue.NxtLineModified : duplicateLine;

                            Console.WriteLine("CurrentValue.NxtLineFixed :{0} , Current:{1}", CurrentValue.NxtLineFixed , duplicateLine);

                            CurrentValue = ValueCheck(CurrentValue, duplicateLine, nextValueLines[0], nextValueLines[1]);
                            RowData.Value = CurrentValue;

                            Console.WriteLine("CurrentValue: {0} -> {1}",CurrentValue.Original, CurrentValue.Modified);

                            duplicateLine = CurrentValue.Modified;

                            // removing empty strings
                            string[] valueColumn = duplicateLine.Split(" ");
                            valueColumn= valueColumn.Where(x => !string.IsNullOrEmpty(x)).ToArray(); 

                            // appending other columns with value data
                            string[] detailColumn = new string[] {CurrentDate.Modified, descRegexResult};

                            CurrentDescr.Modified = descRegexResult;
                            CurrentDescr.Status = "accepted";

                            csvLineData = detailColumn.Concat(valueColumn).ToArray();

                            RowData.Modified = string.Join(" ", csvLineData);
                            RowData.Descr = CurrentDescr;

                            Results.Results.Add(RowData);
                            Console.WriteLine("[217] Total results:{0}", Results.Results.Count());

                            Console.WriteLine("Value found {0} -> {1}", string.Join(",", csvLineData), csvLineData != null);

                        // if row does not contain values. Only descr
                        } else if(csvLineData != null){
                            Console.Write("Value not found {0}", csvLineData.Length);

                            if(csvLineData.Length > 0){
                                csvLineData[1] = csvLineData[1] + " " + line.Replace(',','&');
                                Results.Results[Results.Results.Count() -1].Descr.Modified = csvLineData[1].ToString();
                                Console.WriteLine("\nDescr modified: {0}\n", csvLineData[1]);
                            }
                        }

                    // end of non-header block
                    } else if(isHeader(line)){
                    // if line is a header

                        if(headerCount < 1){
                            headerCount++;
                        } else {
                            headerCount = 0;
                        }

                    } else {
                        if((csvLineData != null)){
                            if(csvLineData.Length > 0){
                                var writeData = string.Join(",", csvLineData);

                                // Console.WriteLine("\nWriting to csv: {0}\n", writeData);

                                Utils.Write2Csv(
                                    outputFileName, 
                                    csvLineData.ToList()) ;
                            }

                            Console.WriteLine("Reset csvLineData...");
                            csvLineData = null;
                        }
                    }
                }
            }

            if((csvLineData != null)){
                if(csvLineData.Length > 0){
                    var writeData = string.Join(",", csvLineData);

                    Console.WriteLine("------------- Writing last line -------------\n{0}",writeData);

                    Utils.Write2Csv(
                        outputFileName, 
                        csvLineData.ToList()) ;
                }

                csvLineData = null;
            }
            Console.WriteLine("Total results:{0}", Results.Results.Count());
            return Results;
        }   

        static public DataLineCol DateCheck(string[] FileContent, int CurrentIdx, string PrevDate){
            // Console.WriteLine("Running DateCheck...");

            try {
                string PrevLine = removeLineOutliers(FileContent[CurrentIdx-2]);
                string CurLine = removeLineOutliers(FileContent[CurrentIdx-1]);
                string NxtLine = removeLineOutliers(FileContent[CurrentIdx]);
                string NxtCheckLine = removeLineOutliers(FileContent[CurrentIdx+1]);

                DataLineRow RowInfo = new DataLineRow();
                RowInfo.LineNum = CurrentIdx;

                /* finding date pattern - start of row */
                // DataRegex PrevDateRegex = Utils.GetDataRegex(PrevLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                // string PrevDateResult = PrevDateRegex.MatchString.Trim(); // using match

                // if(string.IsNullOrWhiteSpace(PrevDateResult)){
                //     Console.WriteLine("Prev line - date not found -> {0}", PrevLine);
                    
                // }

                string PrevDateResult = PrevDate;

                // Console.WriteLine("CurDateRegex({0})", CurLine);
                DataRegex CurDateRegex = Utils.GetDataRegex(CurLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                string CurDateResult = CurDateRegex.MatchString.Trim(); // using match

                // Console.WriteLine("NxtDateRegex({0})", NxtLine);
                DataRegex NxtDateRegex = Utils.GetDataRegex(NxtLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                string NxtDateResult = NxtDateRegex.MatchString.Trim(); // using match

                // Console.WriteLine("NxtCheckDateRegex({0})", NxtCheckLine);
                DataRegex NxtCheckDateRegex = Utils.GetDataRegex(NxtCheckLine,@"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                string NxtCheckDateResult = NxtCheckDateRegex.MatchString.Trim(); // using match

                if(string.IsNullOrWhiteSpace(NxtDateResult)){
                    Console.WriteLine("FindNextValidRow(Nxt)");
                    RowInfo = FindNextValidRow(FileContent, CurrentIdx);
                    NxtDateResult = RowInfo.Modified;
                }

                if(string.IsNullOrWhiteSpace(NxtCheckDateResult)){
                    Console.WriteLine("FindNextValidRow(NxtCheck)");
                    RowInfo = FindNextValidRow(FileContent, RowInfo.LineNum, "linestr");
                    NxtCheckLine = RowInfo.Modified;
                }

                Console.WriteLine("PrevDateResult:{0}, CurDateResult:{1}, NxtDateResult:{2}", PrevDateResult, CurDateResult, NxtDateResult);
                
                DataLineCol RowDate = compareDateInStr(PrevDateResult, CurDateResult, NxtDateResult, NxtCheckLine);
                RowDate.Name = "Date";
                RowDate.LineNum = CurrentIdx;

                // Console.WriteLine("Returning Date: {0}", RowDate.Modified);

                return RowDate;

            } catch(Exception e){
                Console.WriteLine(e.Message);
            }

            return new DataLineCol();
        }

        static public DataLineCol compareDateInStr(string Previous, string Current, string Next, string ValidationLine){
            // Console.WriteLine(
            //     "Date2Compare: Previous({0}) Now({1}) Next({2})", 
            //     Previous, 
            //     Current, 
            // Next);

            bool currModified = false;

            string[] PrevArr = Previous.Split("/");
            string[] CurArr = Current.Split("/");
            string[] NxtArr = string.IsNullOrWhiteSpace(Next) ? [] : Next.Split("/");

            DataLineCol dateNow = new DataLineCol();
            dateNow.Original = Current;

            CustomDate CurVal = new CustomDate(new DataDateValue(
                int.Parse("20" + CurArr[2]),
                int.Parse(CurArr[1]),
                int.Parse(CurArr[0])
            ));

            // if prev data has not been assigned - first line of table
            if((string.IsNullOrWhiteSpace(Previous))){ // || (string.IsNullOrWhiteSpace(Next))
                dateNow.Modified = Current;
                dateNow.Status = "accepted";

                return dateNow;
            } else {

                int[] month31 = {1,3,5,7,8,10,12};
                CustomDate PrevVal = new CustomDate(new DataDateValue(
                    int.Parse("20" + PrevArr[2]),
                    int.Parse(PrevArr[1]),
                    int.Parse(PrevArr[0])
                
                ));

                if(!string.IsNullOrWhiteSpace(Next)){

                    CustomDate NxtVal = new CustomDate(new DataDateValue(
                        int.Parse("20" + NxtArr[2]),
                        int.Parse(NxtArr[1]),
                        int.Parse(NxtArr[0])
                    ));

                    // adjustment for month > 12
                    if((CurVal.GetMonth() > 12) || (NxtVal.GetMonth() > 12)){
                        // Handling current row month
                        if((CurVal.GetMonth() > 12) && (NxtVal.GetMonth() <= 12)){
                            Console.WriteLine("Original date: Current({})", CurVal.ToString());

                            if((NxtVal.GetMonth() == PrevVal.GetMonth())||
                            (NxtVal.GetDay() == PrevVal.GetDay()) || 
                            (CurVal.GetDay() == PrevVal.GetDay())){
                                CurVal.SetMonth(PrevVal.GetMonth());
                            } else if(CurVal.GetDay() == NxtVal.GetDay()){
                                CurVal.SetMonth(NxtVal.GetMonth());
                            }

                            // updating rtn column obj
                            dateNow.Status = "review";
                            dateNow.Modified = CurVal.ToShortString();
                            currModified = true;

                            Console.WriteLine("Modified date: Current({})", CurVal.ToString());

                        // Handling nxt row month
                        } else if((NxtVal.GetMonth() > 12) && (CurVal.GetMonth() <= 12)){
                            DataRegex ValidatorDate = Utils.GetDataRegex(ValidationLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                            string[] ValidatorArr = ValidatorDate.MatchString.Split("/");
                            int ValidatorMon = int.Parse(ValidatorArr[1]);
                            int ValidatorDay = int.Parse(ValidatorArr[0]);

                            if((CurVal.GetDay() == NxtVal.GetDay()) || 
                            (ValidatorDay == CurVal.GetDay()) || 
                            (ValidatorMon == CurVal.GetMonth())){

                                NxtVal.SetMonth(CurVal.GetMonth());

                            } else if(ValidatorMon <= 12){
                                if((NxtVal.GetDay() == ValidatorDay) || 
                                ((ValidatorMon - CurVal.GetMonth() > 0) && (ValidatorDay < CurVal.GetDay()))){
                                    NxtVal.SetMonth(ValidatorMon);
                                }
                            }

                        // todo: what if both next and current row month is beyond boundary
                        } else if((NxtVal.GetMonth() > 12) && (CurVal.GetMonth() > 12)){

                        }
                    }

                    // adjustment for day > 31
                    bool curValDayXOk = (month31.Contains(CurVal.GetMonth()) && (CurVal.GetDay() > 31)) || 
                    ((!month31.Contains(CurVal.GetMonth())) && (CurVal.GetDay() > 30));

                    bool nxtValDayXOk = (month31.Contains(NxtVal.GetMonth()) && (NxtVal.GetDay() > 31)) || 
                    ((!month31.Contains(NxtVal.GetMonth())) && (NxtVal.GetDay() > 30));

                    if(curValDayXOk){
                        string PrevDayStr = PrevVal.GetDay().ToString();
                        string CurDayStr = CurVal.GetDay().ToString();
                        string NxtDayStr = NxtVal.GetDay().ToString();
                        
                        // amending first character to keep it under 31/30
                        CurVal.SetDay(int.Parse(amendDayByLimit(PrevDayStr, CurDayStr, NxtDayStr)));

                        // updating rtn column obj
                        dateNow.Status = "review";
                        dateNow.Modified = CurVal.ToShortString();
                        currModified = true;
                    }

                    if(nxtValDayXOk){
                        DataRegex ValidatorDate = Utils.GetDataRegex(ValidationLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
                        string[] ValidatorArr = ValidatorDate.MatchString.Split("/");

                        string PrevDayStr = CurVal.GetDay().ToString();
                        string CurDayStr = NxtVal.GetDay().ToString();
                        string NxtDayStr = ValidatorArr[0].ToString();

                        // amending first character to keep it under 31/30
                        NxtVal.SetDay(int.Parse(amendDayByLimit(PrevDayStr, CurDayStr, NxtDayStr)));
                    } // end of adjustment for day

                    // Checking of date sequence
                    // day date sequence
                    bool DayMatchingPrev2Next = (PrevVal.GetDay() == NxtVal.GetDay()) && (CurVal.GetDay() != PrevVal.GetDay());
                    bool DayMoreThnNext = CurVal.GetDay() > NxtVal.GetDay();
                    bool DayLessThnPrev = CurVal.GetDay() < PrevVal.GetDay();
                    bool DayCharXOk = false;

                    if(DayMatchingPrev2Next){
                        CurVal.SetDay(PrevVal.GetDay());

                        dateNow.Status = "review";
                        dateNow.Modified = CurVal.ToShortString();
                        currModified = true;
                        
                    } else if(DayMoreThnNext || DayLessThnPrev){
                        // check matching pair between prev and next
                        string prevDay = PrevVal.GetDay().ToString();
                        string nxtDay = NxtVal.GetDay().ToString();
                        string currDay = CurVal.GetDay().ToString();

                        if((prevDay.Length > 0) && (nxtDay.Length > 0) 
                            && (currDay.Length > 0)){
                                if((prevDay[0] == nxtDay[0]) && (currDay[0] != prevDay[0])){
                                    currDay = currDay.Remove(0,1).Insert(0,prevDay[0].ToString());
                                }

                            if((prevDay.Length > 1) && (nxtDay.Length > 1) 
                            && (currDay.Length > 1)){
                                if((prevDay[1] == nxtDay[1]) && (currDay[1] != prevDay[1])){
                                    currDay = currDay.Remove(1,1).Insert(1,prevDay[1].ToString());
                                }
                            }

                            if((prevDay.Length == 1) && (nxtDay.Length == 1) && (currDay.Length > 1)){
                                currDay = currDay.Remove(1,1);
                            }
                        }

                        CurVal.SetDay(int.Parse(currDay));

                        DayCharXOk = DayLessThnPrev || DayMoreThnNext;

                        if(DayCharXOk){
                            dateNow.Status = "pending";
                            dateNow.Modified = CurVal.ToShortString();
                            Console.WriteLine("Invalid date(to check): {0}", CurVal.ToShortString());
                            currModified = true;
                        }
                    }

                    // month date sequence
                    bool MonMatchingPrev2Next = (PrevVal.GetMonth() == NxtVal.GetMonth()) && (CurVal.GetMonth() != PrevVal.GetMonth());
                    if((MonMatchingPrev2Next) || (PrevVal.GetMonth() > CurVal.GetMonth())){
                        CurVal.SetMonth(PrevVal.GetMonth());

                        dateNow.Status = "review";
                        dateNow.Modified = CurVal.ToShortString();
                        currModified = true;
                    } 

                    Console.WriteLine(
                    "Date2Compare (after): Previous({0}) Now({1}) Next({2})", 
                        PrevVal.ToString(), 
                        CurVal.ToString(), 
                        NxtVal.ToString()
                    );

                // todo: if at last line (nxt = null/"")
                } else {

                }
            }

            if(!currModified){
                dateNow.Status = "accepted";
                dateNow.Modified = CurVal.ToShortString();
            }
            
            // Console.WriteLine("Returning Date(instr):{0}", CurVal.ToShortString());

            return dateNow;
        }

        /* Row line massaging - to remove outliers from line data */
        static public string removeLineOutliers(string lineData){
            // Making sure that date is starting the line rather than any misrecognised char
            var matchDateCheck = Regex.Match(lineData, @"\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
            int dateIdxStart = matchDateCheck.Index > 0 ? matchDateCheck.Index : 0;

            int descrIdx = getDescrEndIdx(lineData);

            string rtnString = (dateIdxStart > 0) & (dateIdxStart < descrIdx) ? 
                lineData.Substring(dateIdxStart) : lineData.Substring(0);

            if((dateIdxStart > 0) & (dateIdxStart < descrIdx)){
                Console.WriteLine("Modifying lines:{0} -> {1}", lineData, rtnString);
            }

            // remove special char
            string sCharRule = "[*'\";:_&#^@]"; // only match descr when dateRule is matched
            Regex sCharRegex = new Regex(sCharRule, RegexOptions.IgnoreCase);

            rtnString = sCharRegex.Replace(rtnString, string.Empty);

            return rtnString;
        }

        static public int getDescrEndIdx(string lineData, bool console=false){
            var matchCASA = Regex.Match(lineData, @"A/SA\s");
            var matchSCharge = Regex.Match(lineData, @"RGE\s");
            var matchAdvice = Regex.Match(lineData, @"ADVICE\s");

            int matchCASAEndIdx = matchCASA.Index > 0 ? matchCASA.Index + 4 : 0;
            int matchSChargeIdx = matchSCharge.Index > 0 ? matchSCharge.Index + 3 : 0;
            int matchAdviceIdx = matchAdvice.Index > 0 ? matchAdvice.Index + 6 : 0;

            int descrIdx = matchCASAEndIdx > 0 ? matchCASAEndIdx :
                matchSChargeIdx > 0 ? matchSChargeIdx :
                matchAdviceIdx > 0 ? matchAdviceIdx : 0;

            if(console){
                if(matchCASAEndIdx > 0){
                    Console.WriteLine("Description End: CA/SA @{0}", matchCASAEndIdx);
                } else if( matchSChargeIdx > 0){
                    Console.WriteLine("Description End: RGE @{0}", matchSChargeIdx);
                } else if( matchAdviceIdx > 0){
                    Console.WriteLine("Description End: ADVICE @{0}", matchAdviceIdx);
                }
            }
            
            return descrIdx;
        }

        static public bool isHeader(string lineData){

            string RuleMalay = @"((Tarikh Huraian)|(Wang Keluar)|(Wang Masuk)|(Baki))+";
            MatchCollection matchMalay = Regex.Matches(lineData, RuleMalay);

            string RuleEnglish = @"((Description)|(Debit)|(Credit)|(Balance))+";
            MatchCollection matchEng = Regex.Matches(lineData, RuleEnglish);

            if((matchMalay.Count > 1) ||(matchEng.Count > 1)){
                return true;
            }
            
            return false;
            
        }

        static public string prepareValue(string inStr, string dateRegexResult,string descRegexResult, string previousVal="", bool console=false){
            string massagedVal = "";
            if(console){
                Console.WriteLine( "PrepareValue(InStr:{0}, DateResult:{1}, Descr:{2})", 
                    inStr, dateRegexResult, descRegexResult);
            }
            
            massagedVal = inStr.Substring(0);
            massagedVal = massagedVal.Replace("|", "");
            massagedVal = string.IsNullOrWhiteSpace(dateRegexResult)? 
                dateRegexResult: massagedVal.Replace(dateRegexResult, "");
            massagedVal = string.IsNullOrWhiteSpace(descRegexResult)? 
                descRegexResult: massagedVal.Replace(descRegexResult, "");

            massagedVal= massagedVal.Trim();
            // string test = RemoveCharFromValue(massagedVal, previousVal);

            if(console){
                Console.WriteLine("Massaged value(before):{0}", massagedVal);
            }
            
            massagedVal = massagedVal.Replace(",",".");
            massagedVal = massagedVal.Replace("...",".0");
            massagedVal = massagedVal.Replace("\"","");

            massagedVal = massagedVal.Replace("B", "8");
            massagedVal = massagedVal.Replace("g", "9");
            massagedVal = massagedVal.Replace("q", "9");
            massagedVal = massagedVal.Replace("b", "6");
            massagedVal = massagedVal.Replace("G", "6");
            massagedVal = massagedVal.Replace("S", "5");
            massagedVal = massagedVal.Replace("s", "5");
            massagedVal = massagedVal.Replace("Q", "0");
            massagedVal = massagedVal.Replace("a", "0");
            massagedVal = massagedVal.Replace("f", "0");
            massagedVal = massagedVal.Replace("O", "0");
            massagedVal = massagedVal.Replace("D", "0");
            massagedVal = massagedVal.Replace("o", "0");
            massagedVal = massagedVal.Replace("n", "0");

            if(console){
                Console.WriteLine("Massaged value(after):{0}", massagedVal);
            }
            
            // remove non ascii char
            string nonASCIIRule = "[^\x00-\x7F]+"; // only match descr when dateRule is matched
            Regex nonASCIIRegex = new Regex(nonASCIIRule, RegexOptions.IgnoreCase);

            massagedVal = nonASCIIRegex.Replace(massagedVal, string.Empty);

            return massagedVal;
        }

        static public string processValue(string valueStr, bool console=false){
            Regex valueRegex = new Regex(@"\d*\.{0,1}\d+", RegexOptions.IgnoreCase);
            MatchCollection matchDate = valueRegex.Matches(valueStr);

            string allval = string.Join(" ", from Match match in matchDate select match.Value);

            allval = allval.Trim();

            string[] valueArr = allval.Split(" ");
            
            valueArr = valueArr.Where(x => (!string.IsNullOrEmpty(x)) && double.TryParse(x, out _)).ToArray(); // remove empty str

            string outputVal = "";
            float firstNum = 0;

            try {
                
                string fNumRule = @"[a-zA-Z]+"; // only match descr when dateRule is matched
                Regex fNumRegex = new Regex(fNumRule, RegexOptions.IgnoreCase);

                // removing alphabets from value data
                firstNum = float.Parse(
                    fNumRegex.Replace(valueArr[0], string.Empty),
                    CultureInfo.InvariantCulture
                ); // need to confirm equivalent value 

                switch(valueArr.Length){
                    case 5:
                        if(console){
                            Console.WriteLine("Array Len == 5: {0}", valueStr);
                        }
                        
                        if(firstNum > 0){

                            outputVal = firstNum + "." + valueArr[1].Replace(".","") + " ";
                            outputVal = outputVal + "." + (valueArr[2].Replace(".","")) + " "; // .00
                            outputVal = outputVal + 
                                (valueArr[3].Replace(".","") + "." + valueArr[4].Replace(".",""));
                            
                        } else {
                            outputVal = "." + firstNum + " "; // .00
                            outputVal = outputVal + (valueArr[1].Replace(".","") + "." + valueArr[2].Replace(".","")) + " "; 
                            outputVal = outputVal + 
                                (valueArr[3].Replace(".","") + "." + valueArr[4].Replace(".",""));
                        }
                        
                        break;

                    case 4:
                        // Console.WriteLine("Array Len == 4: {0}", valueStr);  
                        if(firstNum > 0){
                            
                            if(valueArr[3].Contains('.')){
                                string debitVal = valueArr[0].Replace(".", "") + "." + valueArr[1].Replace(".", "");

                                string intRule = @"[a-zA-Z]+"; // only match descr when dateRule is matched
                                Regex intRegex = new Regex(intRule, RegexOptions.IgnoreCase);

                                debitVal = intRegex.Replace(debitVal, string.Empty); // need to confirm equivalent value 

                                outputVal = debitVal + " ." + valueArr[2].Replace(".","") + " " + valueArr[3];

                            } else {
                                outputVal = valueArr[0] + " ." + valueArr[1].Replace(".", "") + " ";
                                outputVal +=  (valueArr[2].Replace(".", "") + "." + valueArr[3].Replace(".", ""));
                            }
                        } else {

                            outputVal = "." + valueArr[0].Replace(".","") + " ";
                            if(valueArr[3].Contains('.')){
                                outputVal += (valueArr[1].Replace(".","") + "." + valueArr[2].Replace(".","")) + " ";
                                outputVal += valueArr[3];
                            } else {
                                outputVal += valueArr[1] + " ";
                                outputVal += valueArr[2].Replace(".","") + "." + valueArr[3].Replace(".","");
                            }
                        }

                        break;
                    case 3:
                        outputVal = string.Join(" ", valueArr);
                        if(console){
                            Console.WriteLine("Array Len == 3: {0}", valueStr);  
                        }
                        
                        break;

                    case 2:
                        outputVal = ".00 " + string.Join(" ", valueArr);
                        if(console){
                            Console.WriteLine("Array Len == 2: {0}", valueStr);  
                        }
                        
                        break;

                    default:
                        outputVal = valueStr;
                        if(console){
                            Console.WriteLine("Array Len == notfound: {0}", valueStr);  
                        }
                        
                        break;
                }

            } catch(Exception e){
                Console.WriteLine(e.Message);
                return "";
            }

            if(console){
                Console.WriteLine("Processed value:{0}", outputVal);
            }
            
            return outputVal;
        }

        static public string amendDayByLimit(string prev, string curr, string nxt){
            string NewDay = "";

            if((prev[0] == nxt[0]) || (((int.Parse(nxt[1].ToString()) - int.Parse(prev[1].ToString())) >= 0))){
                NewDay = curr.Remove(0,1).Insert(0,prev[0].ToString());
            } else if(int.Parse(nxt[0].ToString()) == (int.Parse(prev[0].ToString()) + 1)){
                if(((int.Parse(curr[1].ToString())) > int.Parse(nxt[1].ToString())) && 
                    (((int.Parse(curr[1].ToString())) >= int.Parse(prev[1].ToString())))){
                    NewDay = curr.Remove(0,1).Insert(0,prev[0].ToString());
                } else if(((int.Parse(curr[1].ToString())) <= int.Parse(nxt[1].ToString())) && 
                    (((int.Parse(curr[1].ToString())) < int.Parse(prev[1].ToString())))){
                    NewDay = curr.Remove(0,1).Insert(0,nxt[0].ToString());
                }
            } 

            Console.WriteLine("New amended data({0})", NewDay);
            
            return NewDay;
        }

        static public DataLineRow FindNextValidRow(string[] FileContent, int CurrentIdx, string RtnType="value"){
            string RtnDateResult = "";
            string RtnLine = "";
            bool foundchar = false;

            DataLineRow rtnData = new DataLineRow();

            for(int i=1; i < 30; i++){
                if(FileContent.Length > (CurrentIdx+i)){

                    string LineStr = removeLineOutliers(FileContent[CurrentIdx+i]);
                    DataRegex DateRegex = Utils.GetDataRegex(LineStr, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");

                    /* finding descr pattern */
                    DataRegex DescRegex = Utils.GetDataRegex(LineStr, @"([a-zA-Z]+\s*/*)+", "descr");
                    string descRegexResult = DescRegex.MatchString; // using match

                    if((!string.IsNullOrWhiteSpace(DateRegex.MatchString.Trim())) && 
                        (!string.IsNullOrWhiteSpace(descRegexResult))){

                        rtnData.Original = LineStr;
                        rtnData.LineNum = CurrentIdx+i;

                        if(RtnType == "value"){
                            RtnDateResult = DateRegex.MatchString.Trim(); // using match
                        } else {
                            RtnDateResult = LineStr.Replace(DateRegex.OriginalMatch, DateRegex.MatchString);
                        }

                        rtnData.Modified = RtnDateResult;

                        RtnLine = LineStr;
                        
                        break;
                    }
                }

                // if(foundchar){
                //     break;
                // }
            }

            Console.WriteLine("{0}: RtnDateResult: {1} | {2}", CurrentIdx, RtnLine, RtnType);

            // return RtnDateResult;
            return rtnData;
        }

        static public string[] GetNextLine(string[] FileContent, int CurrentIdx){
            DataLineRow RowInfo = new DataLineRow();
            RowInfo.LineNum = CurrentIdx;

            string NxtLine = removeLineOutliers(FileContent[CurrentIdx]);
            string NxtValidationLine = removeLineOutliers(FileContent[CurrentIdx+1]);

            Console.WriteLine("NxtLine[{0}]:{1}", CurrentIdx, NxtLine);
            Console.WriteLine("NxtValidationLine[{0}]:{1}", CurrentIdx+1, NxtValidationLine);
            
            DataRegex NxtDateRegex = Utils.GetDataRegex(NxtLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
            string NxtDateResult = NxtDateRegex.MatchString.Trim(); // using match

            DataRegex NextDescRegex = Utils.GetDataRegex(NxtLine, @"([a-zA-Z]+\s*/*)+", "descr");

            DataRegex NxtValidateDateRegex = Utils.GetDataRegex(NxtValidationLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
            string NxtValidateResult = NxtValidateDateRegex.MatchString.Trim(); // using match

            DataRegex ValidateDescRegex = Utils.GetDataRegex(NxtValidationLine, @"([a-zA-Z]+\s*/*)+", "descr");

            if((string.IsNullOrWhiteSpace(NxtDateResult)) || 
                (string.IsNullOrWhiteSpace(NextDescRegex.MatchString))){
                RowInfo = FindNextValidRow(FileContent, CurrentIdx, "linestr");
                NxtLine = RowInfo.Modified;
            }

            if((string.IsNullOrWhiteSpace(NxtValidateResult)) || 
                (string.IsNullOrWhiteSpace(ValidateDescRegex.MatchString))){
                RowInfo = FindNextValidRow(FileContent, RowInfo.LineNum, "linestr");
                Console.WriteLine("Adding value validation line: {0}", RowInfo.Modified);
                NxtValidationLine = RowInfo.Modified;
            }

            Console.WriteLine("GetNextLine: Next = {0} ValidationLine = {1}", NxtLine, NxtValidationLine);
            string [] rtnData = {NxtLine, NxtValidationLine};

            return rtnData;
        }

        static public DataValue ValueCheck(DataValue prev, string current, string nxt, string validation, bool debug=true){
            Console.WriteLine(" DataValue Check()--------");

            DataValue PrevVal = new DataValue();
            DataValue CurrVal = new DataValue();
            DataValue NxtVal = new DataValue();

            if(!string.IsNullOrWhiteSpace(prev.Modified)){
                if(debug){
                    Console.Write("Parsing Prev({0})",prev.Modified);
                }

                PrevVal = new DataValue(prev.Modified);

                if(debug){
                    Console.WriteLine(" Prev({0})", PrevVal.toString());
                }
            }

            if(!string.IsNullOrWhiteSpace(current)){
                if(debug){
                    Console.Write("Parsing Current({0})",current);
                }
                
                CurrVal = new DataValue(current);

                if(prev.NxtLineFixed){
                    CurrVal.Original = prev.NxtLine;

                    CurrVal.ModCol.Balance = prev.NxtModCol.Balance;
                    CurrVal.ModCol.Debit = prev.NxtModCol.Debit;
                    CurrVal.ModCol.Credit = prev.NxtModCol.Credit;
                    CurrVal.ModCol.Status.Balance = prev.NxtModCol.Status.Balance;
                    CurrVal.ModCol.Status.Debit = prev.NxtModCol.Status.Debit;
                    CurrVal.ModCol.Status.Credit = prev.NxtModCol.Status.Credit;
                }  

                if(debug){
                    Console.WriteLine(" Curr({0}),", CurrVal.toString());
                }
            }

            if(debug){
                Console.WriteLine(" Validation({0}),", validation);
            }

            if(!string.IsNullOrWhiteSpace(nxt)){
                if(debug){
                    Console.Write("Parsing Next({0})",nxt);
                }
                
                Regex dateRegex = new Regex(@"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}", RegexOptions.IgnoreCase);
                string dateRegexResult = dateRegex.Match(nxt).ToString();

                string nxtString = string.IsNullOrWhiteSpace(dateRegexResult) ?
                    nxt : GetValueColumnFromLine(nxt);
                
                NxtVal = new DataValue(nxtString);
                CurrVal.setNextLine(NxtVal.toString());

                if(debug){
                    Console.WriteLine(" Next({0}),", nxtString);
                }
            }

            if((PrevVal.isEmpty()) && (!NxtVal.isEmpty())){
                // No previous value
                bool BalanceIsOk = CurrVal.getBalance() + NxtVal.getCredit() - NxtVal.getDebit() == NxtVal.getBalance();
                Console.WriteLine("BalanceIsOk(CurrentBalance @prev=0): {0}",BalanceIsOk);

            } else if((!PrevVal.isEmpty()) && (!NxtVal.isEmpty())){

                // balance check
                decimal prevExpectedBalance = Math.Round(PrevVal.getBalance() + CurrVal.getCredit() - CurrVal.getDebit(), 2);
                decimal nxtExpectedBalance = Math.Round(NxtVal.getBalance() - NxtVal.getCredit() + NxtVal.getDebit(), 2);
                bool checkWithPrev = prevExpectedBalance == CurrVal.getBalance();
                bool checkWithNext = nxtExpectedBalance == CurrVal.getBalance();

                if(!checkWithPrev || !checkWithNext){
                    Console.WriteLine("\nFound Mismatched Balance! prev({0}), nxt({1}), curval({2}), prevVal({3})", 
                        prevExpectedBalance, nxtExpectedBalance, CurrVal.getBalance(), PrevVal.getBalance());

                    if(prevExpectedBalance == nxtExpectedBalance){
                        // found incorrect balance at current line -> set balance to expected
                        CurrVal.setBalance(prevExpectedBalance);
                        CurrVal.ModCol.Balance = true;
                        CurrVal.ModCol.Status.Balance = "modified";

                    } else {
                        if(checkWithPrev){
                            // showing that there are no issue @current line as it uses prev balance & current credit/debit
                            // however this tells that there's problem at next line
                            Console.WriteLine("!!!!!!!!!!!!! Next line is problematic... ({0})", NxtVal.toString());

                            if(!string.IsNullOrWhiteSpace(validation)){
                                DataValue PrevValCheck = new DataValue(current);
                                DataValue CurrValCheck = NxtVal;
                                DataValue NxtValCheck = new DataValue(GetValueColumnFromLine(validation));

                                Console.WriteLine(" Validation Line Nxt({0}) Nxt+1({1}),", 
                                    CurrValCheck.toString(), NxtValCheck.toString());

                                decimal prevExpectedBalanceCheck = Math.Round(PrevValCheck.getBalance() + CurrValCheck.getCredit() - CurrValCheck.getDebit(), 2);
                                decimal nxtExpectedBalanceCheck = Math.Round(NxtValCheck.getBalance() - NxtValCheck.getCredit() + NxtValCheck.getDebit(), 2);
                                bool checkWithPrevCheck = prevExpectedBalanceCheck == CurrValCheck.getBalance();
                                bool checkWithNextCheck = nxtExpectedBalanceCheck == CurrValCheck.getBalance();

                                Console.WriteLine("prevExpectedBalanceCheck={0} , nxtExpectedBalanceCheck={1} CurrValCheck={2} prevBalance={3}",
                                    prevExpectedBalanceCheck, nxtExpectedBalanceCheck, CurrValCheck.getBalance(), PrevValCheck.getBalance());

                                if(!checkWithPrevCheck || !checkWithNextCheck){
                                    if(prevExpectedBalanceCheck == nxtExpectedBalanceCheck){
                                        // this tells that the balance is incorrect for tofix nxtline - debit/credit value OK
                                        CurrValCheck.setBalance(prevExpectedBalanceCheck);
                                        string newNext = CurrVal.setNewNext(CurrValCheck.toString(), "Balance");

                                        Console.WriteLine("Next line fixed -> {0}", newNext);
                                    } else {
                                        if(checkWithPrevCheck){
                                            // shows that current line is okay - however next line is having issue

                                        } else if(checkWithNextCheck){ 
                                            // shows that current line is having issue at debit/credit value 
                                            //     + assuming both current & nxt line balance is accurate - how to check for balance???
                                            Console.WriteLine("Same value with next.... {0} : {1} - {2} = {3}", 
                                                CurrValCheck.toString(), CurrValCheck.getBalance(), PrevValCheck.getBalance(), 
                                                PrevValCheck.getBalance() - CurrValCheck.getBalance()
                                            );

                                            // todo check
                                            // Using prevValBalance as it has been validated previously
                                            if(CurrValCheck.getBalance() - PrevValCheck.getBalance() > 0){
                                                CurrValCheck.setCredit(CurrValCheck.getBalance() - PrevValCheck.getBalance());
                                                CurrVal.setNewNext(CurrValCheck.toString(), "Credit");
                                            } else {
                                                CurrValCheck.setDebit(PrevValCheck.getBalance() - CurrValCheck.getBalance());
                                                CurrVal.setNewNext(CurrValCheck.toString(), "Debit");
                                            }

                                            // require user to check the debit/credit + balance for nxt line

                                            Console.WriteLine("Next line fixed -> {0}", CurrValCheck.toString() );
                                        } else {
                                            Console.WriteLine("Next line is beyond help, let user fix it");
                                        }
                                    }
                                }


                            } else {
                                // what to do if @ last line 

                            }
                            // assuming debit/credit value is correct
                        
                        } else if(checkWithNext){
                            // if value is same with next it shows that there's problem with debit/credit value
                            // since balance is as expected with next line data(on assumption that next line + current balance are valid ) -> but still not save to assume the value is valid
                            // assign debit and credit value as expected

                            Console.WriteLine("There's problem with current debit/credit value");

                            if(prev.ModCol.Status.Balance != "pending"){
                                if(CurrVal.getBalance() - PrevVal.getBalance() > 0){
                                CurrVal.setCredit(CurrVal.getBalance() - PrevVal.getBalance());
                                CurrVal.setNewNext(CurrVal.toString(), "Credit");
                                } else {
                                    CurrVal.setDebit(PrevVal.getBalance() - CurrVal.getBalance());
                                    CurrVal.setNewNext(CurrVal.toString(), "Debit");
                                }
                            } else {
                                if(CurrVal.getCredit() > 0){
                                    CurrVal.ModCol.Status.Credit = "pending";
                                } else {
                                    CurrVal.ModCol.Status.Debit = "pending";
                                }
                                
                            }
                            

                        } else {

                            Console.WriteLine("Incorrect Balance are assumed! Problem");
                            CurrVal.ModCol.Status.Balance = "pending";

                        }

                    }
                } else {
                    Console.WriteLine("No issue in current value");
                }


            } else if(!NxtVal.isEmpty()){

            }


            return CurrVal;
        }

        static public string GetValueColumnFromLine(string line){
            int descrIdx = getDescrEndIdx(line);
            var matchDateCheck = Regex.Match(line, @"\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
            int dateIdxStart = matchDateCheck.Index > 0 ? matchDateCheck.Index : 0;

            string duplicateLine = removeLineOutliers(line);

            /* finding date pattern - start of row */
            DataRegex DateRegex = Utils.GetDataRegex(duplicateLine, @"^\d{1,2}/{0,1}\d{2}/{0,1}\d{2}");
            string dateRegexResult = DateRegex.MatchString; // using match

            duplicateLine = !string.IsNullOrWhiteSpace(dateRegexResult) ?
                duplicateLine.Replace(DateRegex.OriginalMatch, DateRegex.MatchString):
                duplicateLine;

            /* finding descr pattern */
            DataRegex DescRegex = Utils.GetDataRegex(duplicateLine, @"([a-zA-Z]+\s*/*)+", "descr");
            string descRegexResult = DescRegex.MatchString; // using match

            // check for expected descr index -> if non check for regexed descr
            int dateRegexResultLen = dateRegexResult.Length;

            // removing outliers from descr if any
            descRegexResult = descrIdx > 0 ? 
                duplicateLine.Substring(dateRegexResultLen, descrIdx-dateRegexResultLen-dateIdxStart) :
                descRegexResult;

            duplicateLine = prepareValue(duplicateLine, dateRegexResult, descRegexResult);
            duplicateLine = processValue(duplicateLine); 

            Console.WriteLine("Processed value for next line:{0}", duplicateLine);

            return duplicateLine;
        }



        /* this function is set to determine which value column(debit/credit) is valid, if found - set the other to zero */
        static public string RemoveCharFromValue(string TrimedValue, string prev){
            double prevBal = !string.IsNullOrWhiteSpace(prev) ? 
                double.Parse(prev.Split(" ")[2]): 0;

            string[] allValue = TrimedValue.Split(" ");
            string RtnData = "";

            int totalInt = 0;
            double currentVal;

            for(int i=allValue.Length-1; i >= 0; i--){
                if(double.TryParse(allValue[i], out currentVal)){
                    Console.WriteLine("Out:{0} PrevBalance:{1}", currentVal, prevBal);
                } else {
                    Console.WriteLine("Out:Value is invalid");
                }
            }
            

            return RtnData;
        }
    }
}