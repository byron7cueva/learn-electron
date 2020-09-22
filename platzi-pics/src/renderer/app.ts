import 'photonkit/dist/css/photon.css';
import '../assets/css/main.css';

import {setIpc, openDirectory} from './ipcRendererEvents';
import {
  addImageEvents,
  searchImagesEvent,
  selectEvent
} from './imagesUi';

window.addEventListener('load', () => {
  setIpc();
  addImageEvents();
  searchImagesEvent();
  selectEvent();
  handleClickEvent('open-directory', openDirectory);
});

/**
 * Add event listerner click to button
 * 
 * @param {string} id Id of button
 * @param {Function} func Handle of event
 */
function handleClickEvent(id: string, func: () => void): void {
  const openDirectory: HTMLButtonElement | null = document.querySelector(`#${id}`);
  if (openDirectory) {
    openDirectory.addEventListener('click', func);
  }
}