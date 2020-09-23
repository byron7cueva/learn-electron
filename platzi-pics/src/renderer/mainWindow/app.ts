import 'photonkit/dist/css/photon.css';
import '../../assets/css/main.css';

import {
  setIpc,
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage
} from './ipcRendererEvents';
import {
  addImageEvents,
  searchImagesEvent,
  selectEvent,
  selectFirstImage,
  print
} from './imagesUi';

window.addEventListener('load', () => {
  void setIpc();
  addImageEvents();
  searchImagesEvent();
  selectEvent();
  selectFirstImage();
  handleClickEvent('open-directory', openDirectory);
  handleClickEvent('save-button', saveFile);
  handleClickEvent('open-preferences', openPreferences);
  handleClickEvent('print-button', print);
  handleClickEvent('upload-button', uploadImage);
  handleClickEvent('paste-button', pasteImage);
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