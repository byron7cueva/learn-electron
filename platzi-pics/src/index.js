'use strict'

// app: Permite controlar el ciclo de vida de la aplicación
// y diferentes evente, a traves de este puede ejecutar la aplicació
// reiniciarla entre otras acciones

// BrowserWindow: Es el que va permitirnos cargar todo el contenido
// visualmente de la aplicacion, permite crear ventanas.
const {app, BrowserWindow} = require('electron')

// Ver lo que tiene el objeto
// console.dir(app)

// Antes que se cierre la aplicacion
app.on('before-quit', () => {
  console.log('Saliendo')
})

// Para poder mostrar la ventana de debe esperar que la aplicacione esta lista
app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola mundo',
    center: true,
    maximizable: false,
    show: false
  })

  //Evento que se ejecuta cuando la ventana es movida
  win.on('move', () => {
    const position = win.getPosition()
    console.log(`la posicion de la ventana es ${position}`)
  })

  // ready-to-show
  // Espera que el contenido sea cargado antes de mostrar la ventana
  //on los eventos se ejecutan multiples veces
  //once se ejecuta una sola vez
  win.once('ready-to-show', () => {
    // Una vez que esta listo el contenido se muestra la ventana
    win.show()
  })

  // Cuando la ventana sea cerrada
  win.on('close', () => {
    // Se asigna a null con el fin que no queden recursos
    // en memoria del objeto que visualiza en la ventana
    win = null
    app.quit()
  })

  // Cargando contenido en la ventana
  // Url externa
  // win.loadURL('http://devdocs.io/')
  // Recurso local
  win.loadURL(`file://${__dirname}/renderer/index.html`)
})