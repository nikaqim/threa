using System;
using System.IO;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
// using Microsoft.AspNetCore.Components;
// using Microsoft.AspNetCore.Http.HttpResults;

using System.Diagnostics;

using System.Drawing;
using System.Text;
using Microsoft.Extensions.ObjectPool;
using AutoMapper.Configuration.Annotations;

using THREAOcrBE.Models;
using THREAOcrBE.Services;
using Microsoft.AspNetCore.SignalR;
using THREAOcrBE.Hubs;

namespace THREAOcrBE.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class OCRController : Controller {

        private readonly IQueuedBackgroundService _queuedBackgroundService;
		private readonly IComputationJobStatusService _computationJobStatusService;

        private readonly IHubContext<JobHub, IChatClient> _hubContext;

        // private string JobId;
        
		public OCRController(
			IQueuedBackgroundService queuedBackgroundService,
			IComputationJobStatusService computationJobStatusService,
            IHubContext<JobHub, IChatClient> hubContext
            )
		{
			_queuedBackgroundService = queuedBackgroundService;
			_computationJobStatusService = computationJobStatusService;
            _hubContext = hubContext;
		}

        // // JobStatusProperties Properties
        // public IComputationJobStatusService JobStatus {
        //     get  
        //     {  
        //         return _computationJobStatusService;  
        //     }  
        // }

        // // Queue Properties
        // public IQueuedBackgroundService Queue {
        //     get  
        //     {  
        //         return _queuedBackgroundService;  
        //     }  
        // }

        // public string JobIdNo {
        //     get  
        //     {  
        //         return _queuedBackgroundService;  
        //     }  
        // }

        private string getFileFormatting(string filename){
            var removedSpace = filename.Replace(" ", "").ToLower();

            if(removedSpace.Contains("posmalaysia")) {
                return "posmalaysia";
            } else if (removedSpace.Contains("hlisb")) {
                return "hlisb";
            } else if (removedSpace.Contains("bsn")) {
                return "bsn";
            } else if(removedSpace.Contains("affinislamic")) {
                return "affin";
            } else if(removedSpace.Contains("cimbislamic")) {
                return "cimb";
            } else if(removedSpace.Contains("kfh")) {
                return "kfh";
            } else if(removedSpace.Contains("ambank")) {
                return "ambank";
            } else if(removedSpace.Contains("bkrm")) {
                return "bankrakyat";
            } else if(removedSpace.Contains("rhb")) {
                return "rhb";
            }

            return "";
        }

        private async Task<string> WriteFile(IFormFile file){
            string orifilename = "";
            string filename = "";
            var exactpath = "";

            try {

                var nameInArray = file.FileName.Split('.');
                var extension = "." + nameInArray[nameInArray.Length - 1];

                orifilename = nameInArray[0].Replace(" ", "");
                // filename = DateTime.Now.Ticks.ToString() + orifilename + "."  + extension;
                filename = orifilename + "."  + extension;

                var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Controllers/Uploads/Files");

                if(!Directory.Exists(filepath)){
                    Directory.CreateDirectory(filepath);
                }

                exactpath = Path.Combine(Directory.GetCurrentDirectory(), "Controllers/Uploads/Files", filename);

                Console.WriteLine($"Filepath:{exactpath}");

                using(var stream = new FileStream(exactpath, FileMode.Create)){
                    await file.CopyToAsync(stream);
                }

            } catch(Exception e){

            }

            return exactpath;
        }

        [EnableCors("ThreaCORS")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        [Route("upload")]
        public async Task<IActionResult> StatementUpload(IFormFile file){
            Console.WriteLine("Writing pdf to directory...");
            var result = await WriteFile(file);

            JobParametersModel Params = new JobParametersModel();
            
            string[] ResultArr = result.Split("/");

            Params.FileName = ResultArr[ResultArr.Length - 1];
            Params.FileFormatting = getFileFormatting(Params.FileName);
            Params.FilePath = result;

            if(string.IsNullOrWhiteSpace(Params.FileFormatting)){
                Console.WriteLine("Pdf file names format not recognised.");
                return BadRequest("Pdf file names format not recognised.");
            } else {
                Console.WriteLine("Params:{0} {1}", Params.FilePath, Params.FileName);
                return (Accepted(await _queuedBackgroundService.PostWorkItemAsync(Params).ConfigureAwait(false)));
            }
        }

        [HttpGet]
        [Route("jobstatus/{jobid}")]
        public async Task<IActionResult> GetJobStatus(string jobid){
            Console.WriteLine("User is requesting for job status....");
            var job = await _computationJobStatusService.GetJobAsync(jobid).ConfigureAwait(false);

            // await _hubContext.Clients.All.ReceiveMessage("nikaqim", "testing from controller");

            if(job != null)
			{
				return Ok(job);
			}

			return NotFound($"Job with ID `{jobid}` not found");
        }

        [HttpGet]
        [Route("review/{jobid}")]
        public async Task<IActionResult> ReviewResult(string jobid){
            Console.WriteLine("User is requesting for job results....");
            var job = await _computationJobStatusService.GetJobAsync(jobid).ConfigureAwait(false);

            // await _hubContext.Clients.All.ReceiveMessage("nikaqim", "testing from controller");

            if(job != null)
			{
				return Ok(job);
			}

			return NotFound($"Job with ID `{jobid}` not found");
        }

        // // example starting background process
        // [HttpPost, Route("beginComputation")]
		// [ProducesResponseType(StatusCodes.Status202Accepted, Type = typeof(JobCreatedModel))]
		// public async Task<IActionResult> BeginComputation([FromBody] JobParametersModel obj)
		// {   
		// 	return Accepted(await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false));
		// }

    }    
}