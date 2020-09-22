/* eslint-disable unicorn/prevent-abbreviations */
import { ipcRenderer, IpcRendererEvent } from 'electron';

import {
  addImageEvents,
  selectFirstImage,
  clearImages,
  loadImages
} from './imagesUi';
import { LiImage } from './LiImage';

/**
 * On the lintening pong event
 */
function setIpc(): void {
  // Render process listening pong event
  ipcRenderer.on('pong', (event: IpcRendererEvent, args: string) => {
    console.log(`pong recibido ${args}`)
  });

  ipcRenderer.on('load-images', (event: IpcRendererEvent, images: LiImage[]) => {
    clearImages();
    loadImages(images);
    addImageEvents();
    selectFirstImage();
  });
}

/**
 * Send to main process ping event
 */
function sendIpc(): void {
  // Send data to main process by ping event
  ipcRenderer.send('ping', new Date());
}

/**
 * Event to emit to main process for open directory 
 */
function openDirectory(): void {
  ipcRenderer.send('open-directory');
}

export {
  setIpc,
  sendIpc,
  openDirectory
}