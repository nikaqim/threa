import os 
import cv2
from matplotlib import pyplot as plt
import numpy as np

# displaying-different-images-with-actual-size-in-matplotlib-subplot
def display(im_path):
    dpi = 80
    im_data = plt.imread(im_path)

    height, width  = im_data.shape[:2]
    
    # What size does the figure need to be in inches to fit the image?
    figsize = width / float(dpi), height / float(dpi)

    # Create a figure of the right size with one axes that takes up the full figure
    fig = plt.figure(figsize=figsize)
    ax = fig.add_axes([0, 0, 1, 1])

    # Hide spines, ticks, etc.
    ax.axis('off')

    # Display the image.
    ax.imshow(im_data, cmap='gray')

    plt.show()


# thicken font weight
def thick_font(image, scale=(2,2), it=1):
    image = cv2.bitwise_not(image)
    kernel = np.ones(scale,np.uint8)

    if(image is not None):
        image = cv2.dilate(image, kernel, iterations=it)
        image = cv2.bitwise_not(image)

    return (image)

def thin_font(image, scale=(2,2), it=1):
    import numpy as np
    image = cv2.bitwise_not(image)
    kernel = np.ones(scale,np.uint8)
    image = cv2.erode(image, kernel, iterations=it)
    image = cv2.bitwise_not(image)
    return (image)