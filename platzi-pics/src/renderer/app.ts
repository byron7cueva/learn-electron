import 'photonkit/dist/css/photon.css';
import '../assets/css/main.css';

type HTMLImageElementOrNull = HTMLImageElement | null;

/**
 * Add the events to image list
 */
function addImageEvents() {
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
function changeImage(node: HTMLElement) {
  const liSelected: HTMLElement | null = document.querySelector('li.selected');
  if (liSelected) {
    liSelected.classList.remove('selected');
  }
  node.classList.add('selected');
  const imageDisplayed: HTMLImageElementOrNull = document.querySelector('#image-displayed');
  const imgNode: HTMLImageElementOrNull = node.querySelector('img')
  if (imageDisplayed && imgNode) {
    imageDisplayed.src = imgNode.src;
  }
}

window.addEventListener('load', () => {
  addImageEvents();
});