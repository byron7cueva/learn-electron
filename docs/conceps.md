# Electron

* Es un framework para crear aplicaciones de escritotio con tecnologias web.

* Lo crearon github, para crear atom editor.

* MacOS (cocoa)

* Windows (Windos Form)

* Linux (gtk o qt)

* Necesita node.js y chromiun para funcionar.

  * Node.js se encarga del proceso principal. Es el encargado de conectar con todas las partes nativas del sistema operativo, como los menus, los dialogos, las ventanas, todos estos componentes que son nativos del Sistema operativo.
  * Chromiun, permite ver el contenido visual.

* Comunicación entre procesos (IPC).

  * Esta permite la comuncación entre el proceso principal que esta corriendo en node.js y el proceso de rendeizado.

  ![image-20200919171321900](./assets/ipc.png)

## Herramientas

### Windows

Se debe instalar lo siguiente, esto instala las dependencias para compilar modulos para ello necesita c y python.

```bash
npm install --global windows-build-tools
```

## Cargar contenido

* Como es una ventana de un navegador, se puede cargar contenido local (html local) o externo (urls externas).
* Cuando es contenido local la carga es inmediata, pero cuando se carga contenido remoto se depende de la red.

## Electron compile

* Permite escribir en diferentes tecnologías que no estan soportadas de forma nativa en html y compila el código en tiempo de ejecucion para despreocuparse de ese paso.

*cross-env:* Módulo para que se utilice las variables de entorno sin importar como se definen en los distintos sistemas operativos.

```json
"dev": "cross-env NODE_ENV=development electron src/index.js"
```

### Módulos deprecados

* *electron-debug:* Se utiliza para habilitar las herramientas de chrome dev tools, agrega unos shorcups para lanzar la devtools,
* *devtron:* Son las herreamientas oficiales de Electron para hacer debug de la aplicación.

### Frameworks para aplicaciones de escritorio

* *photonkit.com:* Los componentes son muy similares a los de MacOS.
* *Xel:* Esta hecho para aplicativos de electron, parecido a material design. Utiliza templates esta basado en webcomponents

## JavaScript en el Frontend

* Tenemos acceso al API: DOM, de nodejs y de electron.

## Comunicación Proceso principal y proceso de renderizado.

* ipcRender: Es el objeto que corre en el proceso de renderizado y permite comunicarse con el main process.
* ipcMain: Protocolo de comunicación para el proceso principal.

## Errores

* Eventos de crashed: Son eventos cuando la pantalla muere.
* unresponsive: Cuando la pantalla no responde
* uncaughtException: Son las excepciones que no fueron manejadas.

## Module remote

* Desde el proceso de renderizado permite llamar a partes del API del proceso principal, como por ejemplo: BrowserWindow
* Se llama desde el proceso de renderizado pero esta utilizando el proceso principal.

