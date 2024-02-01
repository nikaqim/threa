import sys
import os 
import cv2
import shutil

from matplotlib import pyplot as plt
import pdf2images as pdfspliter
import processimage as imageprocessor
import numpy as np

import util as utils

def m_removeDots(imagedir):
    outpath = ""
    index = 0

    for file in os.listdir(imagedir):
        imgpath = imagedir + "/" + file
        outpath = imagedir + "/out"

        if(".png" in file):

            if(not os.path.isdir(outpath)):
                os.mkdir(outpath)
            else:
                print("directory exists", outpath)

            print(index, ":", imgpath)
            index += 1

            img = cv2.imread(imgpath)

            # display(imgpath)

            thickFont = utils.thick_font(img)

            if(thickFont is not None):
                grayscale = cv2.cvtColor(thickFont, cv2.COLOR_BGR2GRAY)
                thresh2 = cv2.threshold(grayscale, 100, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

                # do connected components processing
                nlabels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh2, None, None, None, 8, cv2.CV_32S)

                #get CC_STAT_AREA component as stats[label, COLUMN] 
                areas = stats[1:,cv2.CC_STAT_AREA]

                removedDot = np.zeros((labels.shape), np.uint8)

                for i in range(0, nlabels - 1):
                    if areas[i] >= 8:   #keep
                        removedDot[labels == i + 1] = 255

                result = 255 - removedDot

                outfilename = outpath + "/" + file.split(".")[0] + "_" + str(index) + ".png" 

                cv2.imwrite(outfilename, result)
                print("Output file:", outfilename)
            
            else:
                outfilename = outpath + "/" + file.split(".")[0] + "_" + str(index) + ".png" 
                cv2.imwrite(outfilename, thickFont)
                print("Output file:", outfilename)

    return outpath

def m_removeBorder(imagedir, thresval=0, kernelSizeH=(30,1), kernelSizeV=(1,30), iter=2):
    outputdir = ""
    for file in os.listdir(imagedir):
        if(".png" in file):
            print("filename:", file)
            filepath = imagedir + "/" + file

            
            img = cv2.imread(filepath)

            grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            result = img.copy()
            thresh = cv2.threshold(
                grayscale, 
                thresval, 
                255, 
                cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
            )[1]

            resultImg = imageprocessor.s_removeborder(result, thresh) 

            outputdir = imagedir + "/removedBorder" 

            if(not os.path.isdir(outputdir)):
                os.mkdir(outputdir)
            else:
                print("directory exists", outputdir)

            ## print image without border
            cv2.imwrite(outputdir + "/" + file, resultImg)

            # display("tmp/removeborder.png")

    return outputdir

def main(inDir):
    if("AFFIN ISLAMIC" in inDir):

        dotRemovedPath = m_removeDots(inDir)
        borderRemovedPath = m_removeBorder(dotRemovedPath)

        pdfspliter.join2Pdf(borderRemovedPath)

    # CIMB ISLAMIC
    elif("CIMB ISLAMIC" in inDir):
        outpath = cimb.processpdf(inDir)

        pdfspliter.join2Pdf(outpath)
        print("CIMB Islamic outpath" + outpath)

    # removing directory and files within directory
    shutil.rmtree(inDir)

    dotRemovedPath = m_removeDots(inDir)
    borderRemovedPath = m_removeBorder(dotRemovedPath)

    pdfspliter.join2Pdf(borderRemovedPath)


if __name__ == "__main__":
    main(sys.argv[1])
