import os 
import cv2
from matplotlib import pyplot as plt
import numpy as np

import util as utils

def s_removeborder(result, threshImg, kernelSizeH=(30,1), kernelSizeV=(1,30)):
    rmH_img = remove_horizontal(result, threshImg, kernelSizeH)
    rmV_img = remove_vertical(rmH_img, threshImg, kernelSizeV)

    return rmV_img

def thresholdImage(img, thresval=0):
    grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(
        grayscale, 
        thresval, 
        255, 
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )[1]

    return thresh

def remove_horizontal(img, threshImg, kernelSize=(30,1), iter=2):
    result = img.copy()

    # remove horizontal lines
    horizontal_kernel2 = cv2.getStructuringElement(cv2.MORPH_RECT, kernelSize)
    remove_horizontal2 = cv2.morphologyEx(threshImg, cv2.MORPH_OPEN, horizontal_kernel2, iterations=iter)

    cnts = cv2.findContours(remove_horizontal2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    for c in cnts:
        cv2.drawContours(result, [c], -1, (255,255,255), 5)

    return result

def remove_vertical(img, threshImg, kernelSize=(1,30), iter=2):
    result = img.copy()

    # remove vertical lines
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, kernelSize)
    remove_vertical = cv2.morphologyEx(threshImg, cv2.MORPH_OPEN, vertical_kernel, iterations=iter)

    cnts = cv2.findContours(remove_vertical, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]

    for c in cnts:
        cv2.drawContours(result,[c], -1, (255,255,255), 5)  
    
    return result
    
def removeNoiseByErode(imagePath):
    img = cv2.imread(imagePath)
    
    erodeImg = utils.thin_font(img, (2,2), 1)
    dilateImg = utils.thick_font(erodeImg, (2,2), 1)

    return dilateImg

def cropImage(img, cropArea, indexName=""):
    croppedImg = img[cropArea["y1"]:cropArea["y2"], cropArea["x1"]:cropArea["x2"]]

    if(indexName == ""):
        cv2.imwrite("tmp/cropped.png", croppedImg)
    else:
        cv2.imwrite( "tmp/" + indexName + "_cropped.png", croppedImg)

    return croppedImg

def removeUnwantedNoise(img, filepath=""):
    img_copy = img.copy()
    hsv = cv2.cvtColor(img_copy, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (0, 0, 120), (255, 5, 255))

    nzmask = cv2.inRange(hsv, (0, 0, 5), (255, 255, 255))
    nzmask = cv2.erode(nzmask, np.ones((3,3)))

    new_img = img_copy.copy()
    new_img[np.where(mask)] = 255

    grayscale = cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)
    thresh2 = cv2.threshold(grayscale, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    result = 255 - thresh2

    pathsplit = filepath.split("/")
    parentDirList = pathsplit[0:(len(pathsplit)-1)]
    parentDirPath = "/".join(parentDirList)
    outpath = parentDirPath + "/nonoise/"

    filename = pathsplit[len(pathsplit)-1].split(".")[0] + "_nonoise.png"
    outputfile = outpath + filename

    if(filepath == ""):
        cv2.imwrite("tmp/nonoise.png", result)
    else:
        cv2.imwrite(outputfile, result)

    # return result
    return outputfile 

def joinImage(src, sec, cropArea):
    rtnImg = src.copy()
    img = cv2.imread(sec)

    # rtnImg[cropArea["y1"]:cropArea["y2"], cropArea["x1"]:cropArea["x2"]] = sec
    rtnImg[cropArea["y1"]:cropArea["y2"], cropArea["x1"]:cropArea["x2"]] = img

    return rtnImg
