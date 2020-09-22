// app: Permite controlar el ciclo de vida de la aplicación
// y diferentes evente, a traves de este puede ejecutar la aplicació
// reiniciarla entre otras acciones

// BrowserWindow: Es el que va permitirnos cargar todo el contenido
// visualmente de la aplicacion, permite crear ventanas.
import {
  app,
  BrowserWindow,
  protocol,
  ProtocolRequest,
} from "electron";
import path from "path";
import * as url from "url";

import devtools from './devtools';
import handleErrors from './handleErrors';
import setupHandleMainEvents from './ipcMainEvents';

// Ver lo que tiene el objeto
// console.dir(app)

// Definiendo una variable global
declare global {
  // eslint-disable-next-line no-var
  var mainWindow: BrowserWindow | undefined;
}

/**
 * Create the principal window
 */
function createWindow() {
  /* Support to file protocol */
  protocol.registerFileProtocol('file', (request: ProtocolRequest, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });

  globalThis.mainWindow = new BrowserWindow({
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
      // Habilitando remote module
      enableRemoteModule: true,
      // worldSafeExecuteJavaScript: true
    },
  });

  setupHandleMainEvents(globalThis.mainWindow);
  handleErrors(globalThis.mainWindow);

  // Evento que se ejecuta cuando la ventana es movida
  globalThis.mainWindow.on('move', () => {
    // const position = mainWindow?.getPosition();
    // console.log(`la posicion de la ventana es ${position}`);
  });

  // ready-to-show
  // Espera que el contenido sea cargado antes de mostrar la ventana
  // on los eventos se ejecutan multiples veces
  // once se ejecuta una sola vez
  globalThis.mainWindow.once('ready-to-show', () => {
    // Una vez que esta listo el contenido se muestra la ventana
    globalThis.mainWindow?.show();
  });


  // Cuando la ventana sea cerrada
  globalThis.mainWindow.on('closed', () => {
    // Se asigna a null con el fin que no queden recursos
    // en memoria del objeto que visualiza en la ventana
    console.log('Cerrada');
    globalThis.mainWindow = undefined;
    app.quit();
  });

  let indexPath = '';
  if(process.env.NODE_ENV === "development") {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
    devtools(globalThis.mainWindow);
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "index.html"),
      slashes: true,
    });
  }
  void globalThis.mainWindow.loadURL(indexPath);
}

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