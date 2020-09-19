'use strict'

// app: Permite controlar el ciclo de vida de la aplicación
// y diferentes evente, a traves de este puede ejecutar la aplicació
// reiniciarla entre otras acciones

// BrowserWindow: Es el que va permitirnos cargar todo el contenido
// visualmente de la aplicacion
const {app, BrowserWindow} = require('electron')

// Ver lo que tiene el objeto
// console.dir(app)

// Antes que se cierre la aplicacion
app.on('before-quit', () => {
  console.log('Saliendo')
})

// Para poder mostrar la ventana de debe esperar que la aplicacione esta lista
app.on('ready', () => {
  let win = new BrowserWindow()

  // Cuando la ventana sea cerrada
  win.on('close', () => {
    // Se asigna a null con el fin que no queden recursos
    // en memoria del objeto que visualiza en la ventana
    win = null
    app.quit()
  })
})