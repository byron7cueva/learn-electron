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
    const emailInput: HTMLInputElement | null = document.querySelector('#cloudup-user');
    const passwordInput: HTMLInputElement | null = document.querySelector('#cloudup-passwd');
    if (emailInput && passwordInput) {
      const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
      const IV = "5183666c72eec9e4"; // set random initialisation vector
      const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
      let encrypted = cipher.update(passwordInput.value, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      await settings.set('cloudup.user', emailInput.value);
      await settings.set('cloudup.passwd', encrypted);
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
  const emailInput: HTMLInputElement | null = document.querySelector('#cloudup-user');
  const passwordInput: HTMLInputElement | null = document.querySelector('#cloudup-passwd');

  if(emailInput && passwordInput) {
    if(await settings.has('cloudup.user')) {
      emailInput.value = <string> await settings.get('cloudup.user');
    }
    if(await settings.has('cloudup.passwd')) {
      const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
      const IV = "5183666c72eec9e4"; // set random initialisation vector
      const encrypted = await settings.get('cloudup.passwd');
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
      const decrypted = decipher.update(<string>encrypted, 'base64', 'utf8');
      const text = (decrypted + decipher.final('utf8'));
      passwordInput.value = text;
    }
  }
}