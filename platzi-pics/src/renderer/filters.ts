import filterous2200Min from "./lib/filterous2-2.0.0.min";

function applyFilter(filter: string, currentImage: HTMLImageElement) {
  const imgObj = new Image();
  imgObj.src = currentImage.src;

  filterous2200Min.importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage);
}

export default applyFilter;