import numpy as np
import pywt
import cv2

def w2d(img, mode='haar', level=1):
    img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    img_gray = np.float32(img_gray) / 255.0

    coeffs = pywt.wavedec2(img_gray, mode, level=level)
    coeffs_H = list(coeffs)
    coeffs_H[0] *= 0  # Remove approximation coefficients

    img_reconstructed = pywt.waverec2(coeffs_H, mode)
    img_reconstructed *= 255
    return np.uint8(img_reconstructed)
