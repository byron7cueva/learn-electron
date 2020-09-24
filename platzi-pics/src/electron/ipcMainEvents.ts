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
import {Client} from 'basic-ftp';
import settings from 'electron-settings';
import crypto from 'crypto';

import {LiImage} from '../types/LiImage';
import { ResponseProcess } from '../types/ResponseProcess';

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
      if (!result.canceled && result.filePaths.length > 0) {
        loadImages(event, result.filePaths[0]);
      }
    })
    .catch(error => {
      console.error(error);
    })
  });

  ipcMain.on('load-directory', (event: IpcMainEvent, directory: string) => {
    loadImages(event, directory);
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
    showDialod(mainWindow, options);
  });

  ipcMain.on('upload-image', (event: IpcMainEvent, imagePath: string) => {
    void uploadImage(imagePath)
      .then((response: ResponseProcess) => {
        event.sender.send('finish-upload', response);
      });
  });
}

/**
 * Load images
 * 
 * @param {IpcMainEvent} event Event
 * @param {string} filePath File path images
 */
function loadImages(event: IpcMainEvent, filePath: string) {
  const images: LiImage[] = [];
  const directory = filePath;
  fs.readdir(filePath, (error: NodeJS.ErrnoException | null, files: string[]): void => {
    if (error) throw error;

    files.forEach((filename: string) => {
      if (isImage(filename)) {
        const imageFile = path.join(directory, filename);
        const stats = fs.statSync(imageFile);
        const size = fileSize(stats.size, {round: 0});
        images.push({filename, src: `plp://${imageFile}`, size});
      }
    });
    event.sender.send('load-images', filePath, images);
  });
}

function showDialod(mainWindow: BrowserWindow, options: DialogMessageOptions) {
  void dialog.showMessageBox(mainWindow, {
    type: options.type,
    title: options.title,
    message: options.message,
    buttons: ['Ok']
  });
}

async function uploadImage(imagePath: string): Promise<ResponseProcess> {
  try {
    const hasHost = await settings.has('ftp.host');
    const hasPort = await settings.has('ftp.port');
    const hasUser = await settings.has('ftp.user');
    const hasPassword = await settings.has('ftp.passwd');

    if (hasHost && hasPort && hasUser && hasPassword) {
      const host = await settings.get('ftp.host');
      const port = await settings.get('ftp.port');
      const user = await settings.get('ftp.user');

      const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
      const IV = "5183666c72eec9e4";
      const encrypted = await settings.get('ftp.passwd');
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
      const decrypted = decipher.update(<string>encrypted, 'base64', 'utf8');
      const password = (decrypted + decipher.final('utf8'));

      let pathUpload = imagePath.replace('plp://', '');
      pathUpload = decodeURI(pathUpload);
      const fileName = path.basename(pathUpload);
      const client = new Client();
      await client.access({host, port, user, password});
      await client.uploadFrom(fs.createReadStream(pathUpload), fileName);
      return {
        success: true,
        data: `ftp://${host}/${fileName}`,
        message: 'Imagen cargada al ftp con exito'
      };
    } else {
      return {success: false, message: 'Por favor complete las preferencias del ftp'};
    }
  } catch {
    return {success: false, message: 'Verifique su conexión y/o verifique sus credenciales del ftp'};
  }
}

export default setupHandleEvents;