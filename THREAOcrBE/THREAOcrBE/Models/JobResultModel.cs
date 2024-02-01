using System;
using System.Runtime.Serialization;

namespace THREAOcrBE.Models
{
	[DataContract]
	public class JobResultModel
	{
		[DataMember]
		public string InputPath { get; set; }

		[DataMember]
		public string InputFile { get; set; }

		[DataMember]
		public string OutputPath { get; set; }

		[DataMember]
		public string ConfidenceRate { get; set; }

		[DataMember]
		public List<DataLineRow> Results { get; set; }

		[DataMember]
		public JobExceptionModel Exception { get; set; }

		public JobResultModel() {
			Results = new List<DataLineRow>();
		}
	}
}
