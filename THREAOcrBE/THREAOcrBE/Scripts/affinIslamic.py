import shutil
import sys
import os
import cv2

import numpy as np
from matplotlib import pyplot as plt
import pdf2images as pdfspliter
import processimage as imageprocessor

import util as utils

def removeNoise(imagepath):
    # extracting parent directory and filename
    paths = imagepath.split("/")
    parentDirPath = "/".join(paths[0:len(paths)-1])
    filename = paths[len(paths)-1]

    # create output directory if not available
    outpath = parentDirPath + "/out"
    outfilename = outpath + "/" + filename.split(".png")[0]  + ".png"

    if(".png" in filename):
        if(not os.path.isdir(outpath)):
            os.mkdir(outpath)
        # else:
            # print("directory exists", outpath)

        img = cv2.imread(imagepath)

        thickFont = utils.thick_font(img)

        if(thickFont is not None):
            # grayscale = cv2.cvtColor(thickFont, cv2.COLOR_BGR2GRAY)
            # thresh2 = cv2.threshold(grayscale, 100, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

            # # do connected components processing
            # nlabels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh2, None, None, None, 8, cv2.CV_32S)

            # #get CC_STAT_AREA component as stats[label, COLUMN] 
            # areas = stats[1:,cv2.CC_STAT_AREA]

            # removedDot = np.zeros((labels.shape), np.uint8)

            # for i in range(0, nlabels - 1):
            #     if areas[i] >= 8:   #keep
            #         removedDot[labels == i + 1] = 255

            # result = 255 - removedDot

            cv2.imwrite(outfilename, thickFont)
            # print("Output file:", outfilename)
        
        else:
            cv2.imwrite(outfilename, thickFont)
            # print("Output file:", outfilename)

    # print("Removing Noise:(parentDirPath)", parentDirPath,"(filename)", filename)
    
    return outfilename

def removeBorder(filepath, thresval=0, kernelSizeH=(30,1), kernelSizeV=(1,30), iter=2):
    paths = filepath.split("/")
    parentDirPath = "/".join(paths[0:len(paths)-1])
    filename = paths[len(paths)-1]

    if(".png" in filepath):
        img = cv2.imread(filepath)
        thick_font = utils.thick_font(img)

        grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        result = img.copy()
        thresh = cv2.threshold(
            grayscale, 
            thresval, 
            255, 
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )[1]

        resultImg = imageprocessor.s_removeborder(result, thresh, kernelSizeH, kernelSizeV)

        grayscale2 = cv2.cvtColor(resultImg, cv2.COLOR_BGR2GRAY)
        thresh2 = cv2.threshold(
            grayscale2, 
            thresval, 
            255, 
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )[1]

        # removing additional noise 
        # do connected components processing
        nlabels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh2, None, None, None, 8, cv2.CV_32S)

        #get CC_STAT_AREA component as stats[label, COLUMN] 
        areas = stats[1:,cv2.CC_STAT_AREA]

        removedDot1 = np.zeros((labels.shape), np.uint8)
        removedDot2 = np.zeros((labels.shape), np.uint8)

        for i in range(0, nlabels - 1):
            if areas[i] >= 8:   #keep
                removedDot1[labels == i + 1] = 255

        for i in range(0, nlabels - 1):
            if areas[i] >= 30:   #keep
                removedDot2[labels == i + 1] = 255

        resultFinal = 255 - removedDot1
        noNoiseAre = 255 - removedDot2

        resultFinal[790:1829, 480:1067] = noNoiseAre[790:1829, 480:1067]

        resultFinalThin = utils.thin_font(resultFinal)

        ### end of removing noise ##

        outputdir = parentDirPath + "/removedBorder" 

        if(not os.path.isdir(outputdir)):
            os.mkdir(outputdir)
        # else:
            # print("directory exists", outputdir)

        ## print image without border
        cv2.imwrite(outputdir + "/" + filename, resultFinalThin)

    return outputdir


def main(filepath):
    outfilepath = removeNoise(filepath)
    finaldir = removeBorder(outfilepath)

    print(finaldir)
    
if __name__ == "__main__":
    main(sys.argv[1])