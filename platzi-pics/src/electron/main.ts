// app: Permite controlar el ciclo de vida de la aplicación
// y diferentes evente, a traves de este puede ejecutar la aplicació
// reiniciarla entre otras acciones

// BrowserWindow: Es el que va permitirnos cargar todo el contenido
// visualmente de la aplicacion, permite crear ventanas.
import { app, BrowserWindow } from "electron";
import path from "path";
import * as url from "url";

import devtools from './devtools';

// Ver lo que tiene el objeto
// console.dir(app)
let mainWindow: Electron.BrowserWindow | undefined;

/**
 *
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola mundo',
    center: true,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
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

  if (process.env.NODE_ENV === "development") {
    void mainWindow.loadURL(`http://localhost:4000`);
    devtools(mainWindow);
  } else {
    void mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
}

/**
 *
 */
function quitApp() {
  console.log('Saliendo')
}

// Para poder mostrar la ventana de debe esperar que la aplicacione esta lista
app.on("ready", createWindow);
// Antes que se cierre la aplicacion
app.on('before-quit', quitApp);
app.allowRendererProcessReuse = true;