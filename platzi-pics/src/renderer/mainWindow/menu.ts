import {remote} from 'electron';
import {
  openDirectory,
  saveFile,
  openPreferences,
  uploadImage,
  pasteImage
} from './ipcRendererEvents';
import {print} from './imagesUi';

function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Abrir ubicación',
          click: openDirectory
        },
        {
          label: 'Guardar',
          click: saveFile
        },
        {
          label: 'Preferences',
          click: openPreferences
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
          click: print
        },
        {
          label: 'Subir ftp',
          click: uploadImage
        },
        {
          label: 'Pegar imagen',
          click: pasteImage
        }
      ]
    }
  ];
  const menu = remote.Menu.buildFromTemplate(template);
  remote.Menu.setApplicationMenu(menu);
}

export default createMenu;