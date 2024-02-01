using System;
using System.IO;

using THREAOcrBE.Models;
using Microsoft.AspNetCore.SignalR;
using THREAOcrBE.Hubs;

namespace THREAOcrBE.Services {
    public class OCRInterpreter {
        public string inputFilePath;
        private readonly IHubContext<JobHub, IChatClient> _hubContext;

        // constructor
        public OCRInterpreter(){}
        public OCRInterpreter(string inputFile, IHubContext<JobHub, IChatClient> hubContext){
            inputFilePath = inputFile;
            _hubContext = hubContext;
        }

        // methods
        public async Task<JobResultModel> DecodePDFFile(string inputFile){
            string[] pathInArr = inputFile.Split("/");
            string filename = pathInArr[pathInArr.Length - 1];
            string removedSpace = filename.Replace(" ","").ToLower();

            JobResultModel Result = new JobResultModel();

            await _hubContext.Clients.All.ReceiveMessage("System", "In ocr interpreter....");

            if(removedSpace.Contains("affinislamic")) {
                // Interpreting AffinBank Islamic PDF file
                AffinIslamic AffinInterpreter = new (inputFile, _hubContext);

                Result = await AffinInterpreter.DecodeFile(inputFile.Trim());
                Console.WriteLine("Result received: {0}", Result.Results.Count());
                
            } else if(removedSpace.Contains("kfh")) {
            } else if(removedSpace.Contains("rhb")) {
            } else if (removedSpace.Contains("ambank")) {
            } 

            return Result;
        }
    }

}