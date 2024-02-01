using System;
using System.Runtime.Serialization;

namespace THREAOcrBE.Models
{
	[DataContract]
	public class JobParametersModel
	{
		[DataMember]
		public string FileName { get; set; }

		[DataMember]
		public string FilePath { get; set; }

		[DataMember]
		public string FileExtension { get; set; }

		[DataMember]
		public string FileFormatting { get; set; }

		// TODO: Add any other parameters for work
	}
}
