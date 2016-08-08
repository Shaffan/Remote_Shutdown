const {Menu, ipcMain} = require('electron')
const electron = require('electron')
const server = require('./server/main.js')
const tray = require('./tray.js')
const {getDeviceIps} = require('./server/tools.js')
// Module to control application life.
const {app, BrowserWindow} = electron
// Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null
let willQuitApp = false

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 750,
    height: 550,
    //frame: false,
    show: false,
    icon: './power_symbol.png',
    resizable: false
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/client/views/index.html`)

  // Open the DevTools.
  //win.webContents.openDevTools()

  win.once('ready-to-show', () => {
    win.setMenu(null);
    win.show()
  })

  win.webContents.on('did-finish-load', () => {
    let ips = getDeviceIps()
    win.webContents.send('device_ips_loaded', ips)
  })

  win.on('close', (e) => {
    if (willQuitApp) {
      /* the user tried to quit the app */
      win = null
    } else {
      /* the user only tried to close the window */
      e.preventDefault()
      win.hide()
    }
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

let shouldQuit = app.makeSingleInstance(() => {
  // Focus the window if user attempted to open a second instance.
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    } else if (!win.isVisible()) {
      win.show()
    }
    win.focus()
  }
})

if (shouldQuit) {
  app.quit();
  return;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  tray.create()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  win = null
  willQuitApp = true
  tray.destroy()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('open-devtools', () => {
  win.webContents.openDevTools()
})
ipcMain.on('close-devtools', () => {
  win.webContents.closeDevTools()
})

ipcMain.on('start_server', (event, arg) => {
  var message = server.start()
  win.webContents.send('server_status_changed', message)
})
ipcMain.on('stop_server', (event, arg) => {
  var message = server.stop()
  win.webContents.send('server_status_changed', message)
})
