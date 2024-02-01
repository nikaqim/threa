using THREAOcrBE.Models;
using System.Diagnostics;

using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

using Newtonsoft.Json;

using Microsoft.AspNetCore.SignalR;
using THREAOcrBE.Hubs;

namespace THREAOcrBE.Services
{
	public interface IComputationWorkService
	{
		Task<JobResultModel> DoWorkAsync(string JobId, JobParametersModel work,
			CancellationToken cancellationToken);
	}

	public sealed class ComputationWorkService : IComputationWorkService
	{
		private readonly IComputationJobStatusService _computationJobStatus;
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IHubContext<JobHub, IChatClient> _hubContext;

		public ComputationWorkService(
			IComputationJobStatusService computationJobStatus,
			IHttpClientFactory httpClientFactory,
			IHubContext<JobHub, IChatClient> hubContext
			)
		{
			_computationJobStatus = computationJobStatus;
			_httpClientFactory = httpClientFactory;
			_hubContext = hubContext;
		}

		/// <summary>
		/// Do some work. This is where the meat of the processing is done
		/// </summary>
		public async Task<JobResultModel> DoWorkAsync(string jobId, JobParametersModel work,
			CancellationToken cancellationToken)
		{
			// here's an HttpClient if you need one
			var httpClient = _httpClientFactory.CreateClient();
			var result = new JobResultModel();

			// stopwatch to measure progress
			var sw = new Stopwatch();
			sw.Start();

			// comment for skipping image process
			/*
			var ImageProcessing = new ImageProcessing();
			Console.WriteLine("work.FilePath: {0}", work.FilePath);
			
			var returnDataStr = await ImageProcessing.PdfProcess(work.FilePath, "split");

			ReturnSplitPdfModel SplitPdf = JsonConvert.DeserializeObject<ReturnSplitPdfModel>(returnDataStr);

			Console.WriteLine("Pdf info: {0} : {1}", SplitPdf.OutputDir, SplitPdf.Len);

			Console.WriteLine("Running background taskks...");

			// Go to images output directory and process image accordingly
			string[] filenames = Directory.GetFiles(SplitPdf.OutputDir, "*.png");

			string images2pdfDir = "";

			for(var i=0; i < filenames.Length; i++){
				// Console.WriteLine("Processing images[{0}]: {1}", i, filenames[i]);
				images2pdfDir = await ImageProcessing.RemoveNoise(filenames[i]);

				// make sure we only update status once a second
				if(sw.ElapsedMilliseconds >= 1000)
				{
					sw.Restart();
					await _computationJobStatus.UpdateJobProgressInformationAsync(
						jobId, $"Current result: running",
						(i+1) / (double)SplitPdf.Len).ConfigureAwait(false);
				}
			}

			Console.WriteLine("Final dir: {0}", images2pdfDir);
			var pdfOutPath = await ImageProcessing.PdfProcess(images2pdfDir, "join");			

			Console.WriteLine("Pdf pre-processing completed: {0}", pdfOutPath);
			// OCRInterpreter OcrInterpreter = new OCRInterpreter(pdfOutPath);
			*/
			
			
			await _hubContext.Clients.All.ReceiveMessage("System", "Image processing has been completed...");
			
			OCRInterpreter Interpreter = new OCRInterpreter("./Services/images2pdf/AFFINISLAMICSEPT2023.pdf", _hubContext);

			await _hubContext.Clients.All.ReceiveMessage("System", "Decoding file with OCR");
			JobResultModel Results = await Interpreter.DecodePDFFile("./Services/images2pdf/AFFINISLAMICSEPT2023.pdf"); // for testing
			await _hubContext.Clients.All.ReceiveMessage("System", "Completed....");
			// string outfilepath = await Interpreter.DecodePDFFile(pdfOutPath); // production-ready
		
			/*
			for (ulong i = 0; i < 1000; ++i)
			{
				// next = unchecked(next * 1103515245 + 12345);
				// result.CalculatedResult = next / 65536 % 32768;

				await Task.Delay(1000,
					cancellationToken).ConfigureAwait(false); // simulate long-running task.

				// make sure we only update status once a second
				if(sw.ElapsedMilliseconds >= 1000)
				{
					sw.Restart();
					await _computationJobStatus.UpdateJobProgressInformationAsync(
						jobId, $"Current result: running",
						i / (double)1000).ConfigureAwait(false);
				}
			}
			*/

			/*
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"Done", 1.0).ConfigureAwait(false);
			*/

			return Results;
		}
	}
}
