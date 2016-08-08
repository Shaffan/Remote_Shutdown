const {Tray, Menu, app, shell, BrowserWindow} = require('electron')
let _tray
const ctxTemplate = [
  {label: 'Remote Shutdown',
    submenu: [
      {label: 'View on GitHub', click() {shell.openExternal('https://github.com/Shaffan/Remote_Shutdown')}}
    ]
  },
  {type: 'separator'},
  {label: 'Quit', click() { app.quit() }}
]

const tray = {
  create: () => {
    _tray = new Tray('./power_symbol.png')
    const {shell} = require('electron')
    const contextMenu = Menu.buildFromTemplate(ctxTemplate)
    _tray.setContextMenu(contextMenu)
    _tray.setToolTip('Remote Shutdown')
    _tray.on('right-click', () => {
      _tray.popUpContextMenu()
    })
    _tray.on('double-click', () => {
      BrowserWindow.getAllWindows()[0].show()
    })
  },
  displayBalloon: (title, content) => {
    _tray.displayBalloon({title: title, content: content})
  },
  destroy: () => _tray.destroy()
}

module.exports = tray
