import 'photonkit/dist/css/photon.css';
import '../../assets/css/main.css';

import {remote, ipcRenderer} from 'electron';
import settings from 'electron-settings';
import crypto from 'crypto';

window.addEventListener('load', () => {
  cancelButton();
  saveButton();
  void loadCredentials();
});

/**
 * Handle to cancel button
 */
function cancelButton() {
  const cancelButton = document.querySelector('#cancel-button');
  cancelButton?.addEventListener('click', () => {
    const prefsWindow = remote.getCurrentWindow();
    prefsWindow.close();
  })
}

/**
 * Handle to save button
 */
function saveButton() {
  const saveButton = document.querySelector('#save-button');
  const prefsForm: HTMLFormElement | null = document.querySelector('#preferences-form');

  saveButton?.addEventListener('click', (event) => {
    event.preventDefault();
    if (prefsForm && prefsForm.reportValidity()) {
      void saveCredentials();
    } else {
      ipcRenderer.send('show-dialog', {
        type: 'error',
        title: 'Platzipics',
        message: 'Por favor complete los campos requeridos'
      });
    }
  })
}

/**
 * Save credentials
 */
async function saveCredentials(): Promise<void> {
  try {
    const hostInput: HTMLInputElement | null = document.querySelector('#ftp-host');
    const portInput: HTMLInputElement | null = document.querySelector('#ftp-port');
    const userInput: HTMLInputElement | null = document.querySelector('#ftp-user');
    const passwordInput: HTMLInputElement | null = document.querySelector('#ftp-passwd');
    if (hostInput && portInput && userInput && passwordInput) {
      const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
      const IV = "5183666c72eec9e4"; // set random initialisation vector
      const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
      let encrypted = cipher.update(passwordInput.value, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      await settings.set('ftp.host', hostInput.value);
      await settings.set('ftp.port', portInput.value);
      await settings.set('ftp.user', userInput.value);
      await settings.set('ftp.passwd', encrypted);
      const prefsWindow = remote.getCurrentWindow();
      prefsWindow.close();
    }
  } catch(error: unknown) {
    console.error(error);
  }
}

/**
 * Load credentials
 */
async function loadCredentials(): Promise<void> {
  const hostInput: HTMLInputElement | null = document.querySelector('#ftp-host');
    const portInput: HTMLInputElement | null = document.querySelector('#ftp-port');
  const userInput: HTMLInputElement | null = document.querySelector('#ftp-user');
  const passwordInput: HTMLInputElement | null = document.querySelector('#ftp-passwd');

  if(hostInput && portInput && userInput && passwordInput) {
    if(await settings.has('ftp.host')) {
      hostInput.value = <string> await settings.get('ftp.host');
    }
    if(await settings.has('ftp.port')) {
      portInput.value = <string> await settings.get('ftp.port');
    }
    if(await settings.has('ftp.user')) {
      userInput.value = <string> await settings.get('ftp.user');
    }
    if(await settings.has('ftp.passwd')) {
      const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
      const IV = "5183666c72eec9e4"; // set random initialisation vector
      const encrypted = await settings.get('ftp.passwd');
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
      const decrypted = decipher.update(<string>encrypted, 'base64', 'utf8');
      const text = (decrypted + decipher.final('utf8'));
      passwordInput.value = text;
    }
  }
}