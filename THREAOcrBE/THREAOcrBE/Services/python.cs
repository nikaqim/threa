
using System;
using System.Diagnostics;
using System.ComponentModel;

using System.Threading;
using System.Threading.Tasks;

namespace THREAOcrBE.Services {
    public class PythonExecuter {
        const string pythonExec = "/home/nikaqim/miniconda3/bin/python"; 

        public async Task<string> run_cmd(string cmd, string args){
            Console.WriteLine("Executing python script...");

            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = pythonExec;
            start.Arguments = string.Format("{0} {1}", cmd, args);
            start.UseShellExecute = false;
            start.RedirectStandardOutput = true;

            string result = "";

            using(Process process = Process.Start(start))
            {
                using(StreamReader reader = process.StandardOutput)
                {
                    result = await reader.ReadToEndAsync();
                    Console.Write("From C# :" + result);
                }
            }

            return result;

            
        }
    }
}