import 'photonkit/dist/css/photon.css';
import '../../assets/css/main.css';

import {remote} from 'electron';

window.addEventListener('load', () => {
  cancelButton();
});

/**
 * Handle to cancel button
 */
function cancelButton() {
  const cancelButton = document.querySelector('#cancel-button');
  cancelButton?.addEventListener('click', (() => {
    const prefsWindow = remote.getCurrentWindow();
    prefsWindow.close();
  }))
}