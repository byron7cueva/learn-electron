/* eslint-disable unicorn/prevent-abbreviations */
import { ipcRenderer, IpcRendererEvent } from 'electron';

/**
 * On the lintening pong event
 */
function setIpc(): void {
  // Render process listening pong event
  ipcRenderer.on('pong', (event: IpcRendererEvent, args: any) => {
    console.log(`pong recibido ${args}`)
  })
}

/**
 * Send to main process ping event
 */
function sendIpc(): void {
  // Send data to main process by ping event
  ipcRenderer.send('ping', new Date());
}

export {
  setIpc,
  sendIpc
}