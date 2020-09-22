/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import filterous from "./lib/filterous2-2.0.0.min";

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

export default applyFilter;