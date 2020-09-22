// app: Permite controlar el ciclo de vida de la aplicación
// y diferentes evente, a traves de este puede ejecutar la aplicació
// reiniciarla entre otras acciones

// BrowserWindow: Es el que va permitirnos cargar todo el contenido
// visualmente de la aplicacion, permite crear ventanas.
import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  dialog,
  protocol,
  ProtocolRequest,
} from "electron";
import path from "path";
import * as url from "url";
import fs from 'fs';
import isImage from 'is-image';
import fileSize from 'filesize';

import devtools from './devtools';

// Ver lo que tiene el objeto
// console.dir(app)
let mainWindow: Electron.BrowserWindow | undefined;

/**
 * Create the principal window
 */
function createWindow() {
  /* Support to file protocol */
  protocol.registerFileProtocol('file', (request: ProtocolRequest, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola mundo',
    center: true,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: false,
      // worldSafeExecuteJavaScript: true
    },
  });

  // Evento que se ejecuta cuando la ventana es movida
  mainWindow.on('move', () => {
    const position = mainWindow?.getPosition();
    // console.log(`la posicion de la ventana es ${position}`);
  });

  // ready-to-show
  // Espera que el contenido sea cargado antes de mostrar la ventana
  // on los eventos se ejecutan multiples veces
  // once se ejecuta una sola vez
  mainWindow.once('ready-to-show', () => {
    // Una vez que esta listo el contenido se muestra la ventana
    mainWindow?.show();
  });


  // Cuando la ventana sea cerrada
  mainWindow.on('closed', () => {
    // Se asigna a null con el fin que no queden recursos
    // en memoria del objeto que visualiza en la ventana
    console.log('Cerrada');
    mainWindow = undefined;
    app.quit();
  });

  let indexPath: string = '';
  if(process.env.NODE_ENV === "development") {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
    devtools(mainWindow);
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "index.html"),
      slashes: true,
    });
  }
  void mainWindow.loadURL(indexPath);
}

/**
 * Main process listening ping event
 */
ipcMain.on('ping', (event: IpcMainEvent, args) => {
  console.log(`Se recibio ping - ${args}`);
  event.sender.send('pong', new Date());
});

ipcMain.on('open-directory', async (event: IpcMainEvent) => {
  try {
    const dir = await dialog.showOpenDialog(mainWindow, {
      title: 'Seleccione la nueva ubicación',
      buttonLabel: 'Abrir ubicación',
      properties: ['openDirectory']
    });
    let images: object[] = [];
    if (dir.filePaths.length > 0) {
      const directory = dir.filePaths[0];
      fs.readdir(dir.filePaths[0], (error: NodeJS.ErrnoException | null, files: string[]): void => {
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
  } catch(error: Error) {
    console.error(error.message)
  }
});

/**
 * Funtion execute when quit application
 */
function quitApp(): void {
  console.log('Saliendo');
}

// Para poder mostrar la ventana de debe esperar que la aplicacione esta lista
app.on("ready", createWindow);
// Antes que se cierre la aplicacion
app.on('before-quit', quitApp);
app.allowRendererProcessReuse = true;