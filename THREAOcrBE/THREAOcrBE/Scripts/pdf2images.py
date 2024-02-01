
import sys
import img2pdf
import asyncio
import json

import os 
from os import listdir, mkdir
from os.path import isfile, join, exists

from pdf2image import convert_from_path

async def join2Pdf(pdfInputPath):
    # print("pdfInputPath:", pdfInputPath)

    # List all files in the directory and filter only PNG images (ending with ".png")
    image_files = [i for i in os.listdir(pdfInputPath) if i.endswith(".png")]

    image_arr = []
    pdfFilename = image_files[0].split("_")[0]

    for filename in image_files:
        image_arr.append(pdfInputPath + "/" + filename)

    # sort page
    image_arr.sort()

    # a4 size
    a4inpt = (img2pdf.mm_to_pt(210),img2pdf.mm_to_pt(297))
    layout_fun = img2pdf.get_layout_fun(a4inpt)

    # Convert the list of JPEG images to a single PDF file
    pdf_data = img2pdf.convert(image_arr,layout_fun=layout_fun)

    pdfOutPath = "./Services/images2pdf"
    # check if out dir already exist
    if(not os.path.isdir(pdfOutPath)):
        mkdir(pdfOutPath)
    # else:
    #     print("directory exists", pdfOutPath)

    outfilepath = pdfOutPath + "/" + pdfFilename + ".pdf"

    # Write the PDF content to a file (make sure you have write permissions for the specified file)        
    with open(outfilepath, "wb") as file:
        file.write(pdf_data)

    print(outfilepath)
    return outfilepath

async def convertPdf2Images(filepath):
    # print("filepath::", filepath)
    returnObj = {}

    filepathArr = filepath.split("/")
    filename = filepathArr[len(filepathArr)-1]

    filename_modified = filename.split(".")[0]
    output_dir = "./Services/pdf2images/" + filename_modified

    # check if out dir already exist
    if(not os.path.isdir(output_dir)):
        # print("creating directory", output_dir)
        mkdir(output_dir)

    images = convert_from_path(filepath)
    
    for i in range(len(images)):
        output_filename = filename_modified + "_" + str(i) +'.png'

        # Save pages as images in the pdf
        # print("Exporting images...", i, ": " + output_filename)
        images[i].save(output_dir + "/" + output_filename, 'PNG') 

    returnObj["OutputDir"] = output_dir
    returnObj["Len"] = len(images)

    print(json.dumps(returnObj))

    return output_dir

if __name__ == "__main__":
    if(sys.argv[2] == "split"):
        asyncio.run(convertPdf2Images(sys.argv[1]))
    else:
        asyncio.run(join2Pdf(sys.argv[1]))
    
