/* eslint-disable unicorn/prevent-abbreviations */
import {
  ipcRenderer,
  IpcRendererEvent,
  remote,
  clipboard
} from 'electron';
import path from 'path';
import * as url from "url";
import settings from 'electron-settings';

import {
  addImageEvents,
  selectFirstImage,
  clearImages,
  loadImages
} from './imagesUi';
import { LiImage } from '../../types/LiImage';
import { saveImage } from './filters';

const { BrowserWindow } = remote;

/**
 * On the lintening pong event
 */
async function setIpc(): Promise<void> {
  ipcRenderer.on('load-images', (event: IpcRendererEvent, directory: string, images: LiImage[]) => {
    clearImages();
    loadImages(images);
    addImageEvents();
    selectFirstImage();
    void settings.set('directory', directory)
    .then(() => {
      const directoryEle = document.querySelector('#directory');
      if (directoryEle) directoryEle.innerHTML = directory;
    });
  });

  ipcRenderer.on('save-image', (event: IpcRendererEvent, file: string) => {
    saveImage(file, (error: NodeJS.ErrnoException | null) => {
      if(error) return showDialod('error', 'Platzipics', error.message);
      const image: HTMLImageElement | null = document.querySelector('#image-displayed');
      if (image) {
        image.dataset.filtered = file;
      }
      showDialod('info', 'Platzipics', 'La imagen fue guardada');
    });
  });

  const has = await settings.has('directory');
  if (has) {
    const directory = await settings.get('directory');
    ipcRenderer.send('load-directory', directory);
  }
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
  if (image && image.dataset.original) {
    const ext = path.extname(image.dataset.original);
    ipcRenderer.send('open-save-dialog', ext);
  }
}

/**
 * Launch dialod message
 * 
 * @param {string} type Type of dialog
 * @param {string} title Title of dialog
 * @param {string} message Message of dialog
 */
function showDialod(type: string, title: string, message: string): void {
  ipcRenderer.send('show-dialog', {type, title, message});
}

/**
 * Open dialog preferencies
 */
function openPreferences(): void {
  const preferencesWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: 'Preferences',
    center: true,
    modal: true,
    // No tiene barra de titulo
    frame: false,
    show: false,
    // Accediendo a la pantalla principal a traves de una variable global
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    parent: remote.getGlobal('mainWindow'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  let indexPath = '';
  if(process.env.NODE_ENV === "development") {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'preferences.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "preferences.html"),
      slashes: true,
    });
  }
  void preferencesWindow.loadURL(indexPath);

  // Se Omite windows
  // La version 10 de electron ya soportan todas las plataformas setParentWindow
  /* if (os.platform() !== 'win32') {
    preferencesWindow.setParentWindow(remote.getGlobal('mainWindow'));
  } */

  preferencesWindow.webContents.once('did-frame-finish-load', () => {
    preferencesWindow.show();
    preferencesWindow.focus();
    // preferencesWindow.webContents.openDevTools();
  });
}

function uploadImage(): void {
  const imageEle: HTMLImageElement | null = document.querySelector('#image-displayed');

  if (imageEle) {
    let image;
    if (imageEle.dataset.filtered) {
      image = imageEle.dataset.filtered;
    } else {
      image = imageEle.src;
    }
    ipcRenderer.send('upload-image', image);
    // Guardando la dirección al portapapeles
    clipboard.writeText(image);
  }
}

function pasteImage(): void {
  const image = clipboard.readImage()
  // Devuelve la información de la imagen en base64
  const data = image.toDataURL();

  // El clipboard devuelve la información en png
  if(data.includes('data:image/png;base64') && !image.isEmpty()) {
    const imgEle: HTMLImageElement | null = document.querySelector('#image-displayed');
    if (imgEle) {
      imgEle.src = data;
      imgEle.dataset.original = data;
    }
  } else {
    showDialod('error', 'Platzipics', 'No hay una imagen válida en el porta papeles');
  }
}

export {
  setIpc,
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage
}