/* eslint-disable unicorn/prevent-abbreviations */
import { ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';

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

  ipcRenderer.on('save-image', (event: IpcRendererEvent, file: string) => {
    console.log(file);
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
 * Emit event to main process for open directory 
 */
function openDirectory(): void {
  ipcRenderer.send('open-directory');
}

/**
 * Event event to main process for save file
 */
function saveFile(): void {
  const image: HTMLImageElement | null = document.querySelector('#image-displayed');
  if (image) {
    const ext = path.extname(image.dataset.original);
    ipcRenderer.send('open-save-dialog', ext);
  }
}


export {
  setIpc,
  sendIpc,
  openDirectory,
  saveFile
}