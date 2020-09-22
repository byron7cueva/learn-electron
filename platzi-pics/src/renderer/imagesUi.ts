import url, {Url} from 'url';
import path from 'path';

import applyFilter from './filters';
import { LiImage } from './LiImage';

type HTMLImageElementOrNull = HTMLImageElement | null;
type HTMLElementOrNull = HTMLElement | null;

/**
 * Add the events to image list
 */
function addImageEvents(): void {
  const thumbs: NodeListOf<HTMLElement> = document.querySelectorAll('li.list-group-item');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      changeImage(this);
    });
  });
}

/**
 * Change principal image
 * 
 * @param {HTMLElement} liElement li selected from list images
 */
function changeImage(liElement: HTMLElementOrNull): void {
  const imageDisplayed: HTMLImageElementOrNull = document.querySelector('#image-displayed');
  let source = '';
  if (liElement) {
    const liSelected: HTMLElement | null = document.querySelector('li.selected');
    if (liSelected) {
      liSelected.classList.remove('selected');
    }
    liElement.classList.add('selected');
    const imgNode: HTMLImageElementOrNull = liElement.querySelector('img')
    if (imgNode) {
      source = imgNode.src;
    }
  }

  if (imageDisplayed) {
    imageDisplayed.src = source;
    imageDisplayed.dataset.original = source;
  }
}

/**
 * Select first image don't hidden
 */
function selectFirstImage(): void {
  const image: HTMLElementOrNull = document.querySelector('li.list-group-item:not(.hidden)');
  changeImage(image);
}

/**
 * Filter the images
 */
function searchImagesEvent(): void {
  const searchBox: HTMLInputElement | null = document.querySelector('#search-box');

  if (searchBox) {
    searchBox.addEventListener('keyup', function() {
      const regex = new RegExp(this.value.toLowerCase(),'gi');
      if (this.value.length > 0) {
        const thumbs: NodeListOf<HTMLImageElement> = document.querySelectorAll('li.list-group-item img');
        thumbs.forEach(thumb => {
          const fileUrl: Url = url.parse(thumb.src);
          const fileName = path.basename(fileUrl.pathname);
          const parentNode = (thumb.parentNode as HTMLElement);
          if (regex.exec(fileName)) {
            parentNode.classList.remove('hidden');
          } else {
            parentNode.classList.add('hidden');
          }
        });
      } else {
        const thumbs: NodeListOf<HTMLElement> = document.querySelectorAll('li.hidden');
        thumbs.forEach(thumb => {
          thumb.classList.remove('hidden');
        });
      }
      selectFirstImage();
    })
  }
}

/**
 * Event to selected filter
 */
function selectEvent(): void {
  const select: HTMLSelectElement | null = document.querySelector('#filters');
  select?.addEventListener('change', function() {
    const imgELement: HTMLImageElement = document.querySelector('#image-displayed');
    applyFilter(this.value, imgELement);
  });
}

/**
 * Clear all images from list
 */
function clearImages(): void {
  const oldImages: NodeListOf<HTMLElement> = document.querySelectorAll('li.list-group-item');
  oldImages.forEach((image: HTMLElement) => {
    image.remove();
  })
}

/**
 * Render images on list
 * 
 * @param {LiImage[]} images List of images
 */
function loadImages(images: LiImage[]): void {
  const imagesList = document.querySelector('ul.list-group');
  images.forEach((image: LiImage) => {
    const liElement = templateLiImage(image);
    imagesList?.insertAdjacentHTML('beforeend', liElement);
  });
}

/**
 * Generate template
 * 
 * @param {LiImage} image Image to generate template
 * @returns {string} Template
 */
function templateLiImage(image: LiImage): string {
  const {filename, src, size} = image;
  return `
    <li class="list-group-item">
    <img class="media-object pull-left" src="${src}" height="32">
    <div class="media-body">
      <strong>${filename}</strong>
      <p>${size}</p>
    </div>
  </li>
  `;
}

export {
  addImageEvents,
  changeImage,
  selectFirstImage,
  selectEvent,
  searchImagesEvent,
  clearImages,
  loadImages,
  templateLiImage
}