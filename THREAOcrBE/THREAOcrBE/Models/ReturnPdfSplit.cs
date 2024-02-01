using System;
using System.Runtime.Serialization;

namespace THREAOcrBE.Models
{
    [DataContract]
	public class ReturnSplitPdfModel
	{
		[DataMember]
		public string OutputDir { get; set; }

		[DataMember]
		public int Len { get; set; }
	}
}
