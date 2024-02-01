
# import module

import os 
import img2pdf

from os import listdir, mkdir
from os.path import isfile, join, exists

from pdf2image import convert_from_path

def join2Pdf(pdfInputPath):
    print(pdfInputPath)

    # List all files in the directory and filter only PNG images (ending with ".png")
    image_files = [i for i in os.listdir(pdfInputPath) if i.endswith(".png")]
    print("image_files", image_files)

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

    pdfOutPath = "pdf/out"
    # check if out dir already exist
    if(not os.path.isdir(pdfOutPath)):
        mkdir(pdfOutPath)
    else:
        print("directory exists", pdfOutPath)

    # Write the PDF content to a file (make sure you have write permissions for the specified file)        
    with open(pdfOutPath + "/" + pdfFilename + ".pdf", "wb") as file:
        file.write(pdf_data)


if __name__ == "__main__":
    join2Pdf()