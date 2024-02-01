using Newtonsoft.Json;

namespace THREAOcrBE.Models
{
	public sealed class JobCreatedModel
	{
		[JsonProperty("jobId")]
		public string JobId { get; set; }

		[JsonProperty("queuePosition")]
		public int QueuePosition { get; set; }
	}
}
