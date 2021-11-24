from imageio import imread, imsave
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

def average(img, x, y, blurfactor):
    rtotal = gtotal = btotal = 0
    for y2 in range(y - blurfactor, y + blurfactor + 1):
        for x2 in range(x - blurfactor, x + blurfactor + 1):
            r = int(img[y2,x2,0])
            g = int(img[y2,x2,1])
            b = int(img[y2,x2,2])
            rtotal = rtotal + r
            gtotal = gtotal + g
            btotal = btotal + b
    raverage = rtotal // ((blurfactor * 2 + 1)**2)
    gaverage = gtotal // ((blurfactor * 2 + 1)**2)
    baverage = btotal // ((blurfactor * 2 + 1)**2)
    return (raverage, gaverage, baverage)

def blur():
    img = imread('cat.jpg')
    width = img.shape[1]
    height = img.shape[0]

    blurfactor = int(3)

    img2 = Image.new("RGB", (width, height), (0,0,0))

    for y in range(blurfactor, height - blurfactor):
        for x in range(blurfactor, width - blurfactor):
            print('x:', x,'/',width-blurfactor, '    y:', y,'/',height-blurfactor)
            r = int(img[y,x,0])
            g = int(img[y,x,1])
            b = int(img[y,x,2])
            r2, g2, b2 = average(img, x, y, blurfactor)
            img2.putpixel((x,y), (r2,g2,b2))

    img2.save("blur.jpg")
    img2.show()

def main():
    blur()

if __name__ == '__main__':
    main()

