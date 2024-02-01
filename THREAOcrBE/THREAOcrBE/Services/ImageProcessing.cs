using THREAOcrBE.Models;
using System.Diagnostics;

using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace THREAOcrBE.Services {
    public class ImageProcessing {
        public async Task<string> PdfProcess(string path, string action){
            // running python script - split pdf -> images 
			var inputCmd = path.Trim() + " " + action;
			string splitPdf_scriptName = "pdf2images.py";
            string splitPdf_scriptPath = Path.Combine(
				Directory.GetCurrentDirectory(), "Scripts/", 
				splitPdf_scriptName
			);

            PythonExecuter pyEx = new PythonExecuter();
            
            Console.WriteLine("inputCmd:{0}", inputCmd);
            
			var returnDataStr = await pyEx.run_cmd(splitPdf_scriptPath, inputCmd);


            return returnDataStr;
        }

        public async Task<string> RemoveNoise(string path){
            // running python script - split pdf -> images 
			var filepath = path;
			string splitPdf_scriptName = "affinIslamic.py";
            string splitPdf_scriptPath = Path.Combine(
				Directory.GetCurrentDirectory(), "Scripts/", 
				splitPdf_scriptName
			);

            PythonExecuter pyEx = new PythonExecuter();
            
			var returnDataStr = await pyEx.run_cmd(splitPdf_scriptPath, filepath);

            return returnDataStr;
        }
    }
}