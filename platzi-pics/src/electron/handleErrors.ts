import {
  app,
  BrowserWindow,
  dialog,
  Event,
  Details
} from 'electron';

/**
 * Relaunch of Application
 * 
 * @param {BrowserWindow} mainWindow Window
 */
async function relaunchApp(mainWindow: BrowserWindow) {
  try {
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Platzipics',
      message: 'Ocurrió un error inesperado, se reiniciará el aplicativo',
      buttons: ['ok']
    });
    app.relaunch();
    app.exit(0);
  } catch(error: unknown) {
    console.error(error);
  }
}

/**
 * Setup the electron errors
 * 
 * @param {BrowserWindow} mainWindow Window
 */
function setupErrors(mainWindow: BrowserWindow): void {
  /* Evento cuando el aplicativo deje de responder */
  mainWindow.webContents.on('render-process-gone', (event: Event, details: Details) => {
    if (details.reason === 'killed') {
      void relaunchApp(mainWindow);
    }
  });

  /* Evento cuando no responde la pantalla */
  mainWindow.on('unresponsive', () => {
    void dialog.showMessageBox(mainWindow, {
      type: 'question',
      title: 'Platzipics',
      message: 'Un proceso está tardando demasiado, puede esperar o reiniciar el aplicativo manualmente',
      buttons: ['Esperar', 'Reiniciar']
    }).then((result) => {
      if (result.response === 1) {
        void relaunchApp(mainWindow);
      }
    })
  });

  /* Manejo de exepciones no capturadas */
  process.on('uncaughtException', () => {
    void relaunchApp(mainWindow);
  });
}

export default setupErrors;