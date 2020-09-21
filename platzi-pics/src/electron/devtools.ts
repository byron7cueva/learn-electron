import {BrowserWindow} from 'electron';

const devtools = (window: BrowserWindow): void => {
  window.webContents.on('did-frame-finish-load', () => {
    // window.webContents.openDevTools();
  });
};

export default devtools;