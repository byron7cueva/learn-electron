import fs from 'fs';
import isImage from 'is-image';
import fileSize from 'filesize';
import path from 'path';
import {
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  dialog
} from "electron";

import {LiImage} from '../types/LiImage';

interface DialogMessageOptions {
  type: string;
  title: string;
  message: string;
}

/**
 * Setup handle events
 * 
 * @param {BrowserWindow} mainWindow Window
 */
function setupHandleEvents(mainWindow: BrowserWindow): void {
  /**
   * Main process listening ping events
   */
  
  ipcMain.on('open-directory', (event: IpcMainEvent) => {
    void dialog.showOpenDialog(mainWindow, {
      title: 'Seleccione la nueva ubicación',
      buttonLabel: 'Abrir ubicación',
      properties: ['openDirectory']
    })
    .then(result => {
      const images: LiImage[] = [];
      if (!result.canceled && result.filePaths.length > 0) {
        const directory = result.filePaths[0];
        fs.readdir(result.filePaths[0], (error: NodeJS.ErrnoException | null, files: string[]): void => {
          if (error) throw error;

          files.forEach((filename: string) => {
            if (isImage(filename)) {
              const imageFile = path.join(directory, filename);
              const stats = fs.statSync(imageFile);
              const size = fileSize(stats.size, {round: 0});
              images.push({filename, src: `file://${imageFile}`, size});
            }
          });
          event.sender.send('load-images', images);
        });
    }   
    })
    .catch(error => {
      console.error(error);
    })
  });

  ipcMain.on('open-save-dialog', (event: IpcMainEvent, extension: string) => {
      void dialog.showSaveDialog(mainWindow, {
        title: 'Guardar imagen modificada',
        buttonLabel: 'Guardar imagen',
        // eslint-disable-next-line unicorn/prefer-string-slice
        filters: [{name: 'Images', extensions: [extension.substr(1)]}],
        defaultPath: `name${extension}`,
      })
      .then(result => {
        if(result.canceled) return;
        event.sender.send('save-image', result.filePath);
      })
      .catch(error => {
        console.error(error);
      })
  });

  ipcMain.on('show-dialog', (event: IpcMainEvent, options: DialogMessageOptions) => {
    void dialog.showMessageBox(mainWindow, {
      type: options.type,
      title: options.title,
      message: options.message,
      buttons: ['Ok']
    });
  });
}

export default setupHandleEvents;