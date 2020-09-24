import {remote} from 'electron';
import {
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage
} from './ipcRendererEvents';
import {print} from './imagesUi';

/**
 * Create the Menu
 */
function createMenu(): void {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Abrir ubicación',
          click: openDirectory,
          // Shortcuts locales
          // Debe estar enfocada la aplicación para que pueda funcionar
          accelerator: 'CmdOrCtrl+O'
        },
        {
          label: 'Guardar',
          click: saveFile,
          accelerator: 'CmdOrCtrl+G'
        },
        {
          label: 'Preferences',
          click: openPreferences,
          accelerator: 'CmdOrCtrl+,'
        },
        {
          label: 'Cerrar',
          // Role es un menu estandar del sistema operativo
          role: 'quit'
        }
      ]
    },
    {
      label: 'Edición',
      submenu: [
        {
          label: 'Imprimir',
          click: print,
          accelerator: 'CmdOrCtrl+P'
        },
        {
          label: 'Subir ftp',
          click: uploadImage,
          accelerator: 'CmdOrCtrl+U'
        },
        {
          label: 'Pegar imagen',
          click: pasteImage,
          accelerator: 'CmdOrCtrl+V'
        },
        {
          type: 'separator'
        },
        {
          role: 'toggledevtools'
        }
      ]
    }
  ];
  const menu = remote.Menu.buildFromTemplate(template);
  remote.Menu.setApplicationMenu(menu);
}

export default createMenu;