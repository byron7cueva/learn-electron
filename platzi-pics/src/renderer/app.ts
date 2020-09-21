import 'photonkit/dist/css/photon.css';
import '../assets/css/main.css';
import './lib/filterous2-2.0.0.min.js';

import url, {Url} from 'url';
import path from 'path';

import applyFilter from './filters';

type HTMLImageElementOrNull = HTMLImageElement | null;
type HTMLElementOrNull = HTMLElement | null;

window.addEventListener('load', () => {
  addImageEvents();
  searchImagesEvent();
  selectEvent();
});

/**
 * Add the events to image list
 */
function addImageEvents(): void {
  const thumbs: NodeListOf<HTMLElement> = document.querySelectorAll('li.list-group-item');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      changeImage(this);
    })
  })
}

/**
 * Change principal image
 * 
 * @param {HTMLElement} node li selected from list images
 */
function changeImage(node: HTMLElementOrNull): void {
  const imageDisplayed: HTMLImageElementOrNull = document.querySelector('#image-displayed');
  if (node) {
    const liSelected: HTMLElement | null = document.querySelector('li.selected');
    if (liSelected) {
      liSelected.classList.remove('selected');
    }
    node.classList.add('selected');
    const imgNode: HTMLImageElementOrNull = node.querySelector('img')
    if (imageDisplayed && imgNode) {
      imageDisplayed.src = imgNode.src;
    }
  } else {
    imageDisplayed.src = '';
  }
}

/**
 * Filter the images
 */
function searchImagesEvent() {
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
 * Select first image don't hidden
 */
function selectFirstImage() {
  const image: HTMLElement = document.querySelector('li.list-group-item:not(.hidden)');
  changeImage(image);
}

function selectEvent() {
  const select: HTMLSelectElement = document.querySelector('#filters');
  select.addEventListener('change', function() {
    applyFilter(this.value, document.querySelector('#image-displayed'));
  });
}