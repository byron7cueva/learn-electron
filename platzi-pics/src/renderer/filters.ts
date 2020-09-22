/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import filterous from "./lib/filterous2-2.0.0.min";
import fs from 'fs';

/**
 * Apply filter to image
 * 
 * @param {string} filter Name filter to apply
 * @param {HTMLImageElement} currentImage Image elemento to apply filter
 */
function applyFilter(filter: string, currentImage: HTMLImageElement): void {
  const imgObject = new Image();
  imgObject.src = currentImage.src;
  
  filterous.importImage(imgObject, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

/**
 * Save image
 * 
 * @param {string} fileName Name of file
 * @param {Function} callback Callback
 */
function saveImage(fileName: string, callback: (error: NodeJS.ErrnoException | null) => void): void {
  const image: HTMLImageElement | null = document.querySelector('#image-displayed');
  if (image) {
    let fileSource = image.src;
    fileSource = fileSource?.replace(/^data:([+/A-Za-z-]+);base64,/,'');
    fs.writeFile(fileName, fileSource, 'base64', callback)
  }
}

export {
  applyFilter,
  saveImage
}