'use strict'
const http = require('http')
const tools = require('./tools.js')
const {ipcMain} = require('electron')
const operations = {
  handshake: 0,
  shutdown: 1,
  abortShutdown: 2
}
// Remove later
let url = tools.getDeviceIps()[0]

ipcMain.on('selected_ip_inc', (event, val) => {
  url = val
})

const server = {
  _server: null,
  start: () => {
    try {
      this._server = http.createServer(app)
      var server = this._server
      server.listen(3000, url)
      console.log('Server running at ' + url + ' on port ' + 3000)
      return 1
    } catch (e) {
      tools.logErr(e)
    }

    function app (request, response) {
      console.log('received ' + request.method + ' request from ' + request.headers.referer || 'Unknown')

      var body = ''
      request.on('error', (err) => {
        console.log(err)
        response.write(err)
      }).on('data', (chunk) => {
        body += chunk
      }).on('end', () => {
        if (request.method !== 'OPTIONS') {
          var data = JSON.parse(body)
          handleData(data)
        }
      })
      tools.setHeaders(response)

      response.write('message for me')
      response.end()
    }
  },
  stop: () => {
    this._server.close()
    console.log('Server stopped')
    return 'Server stop'
  }
}

function handleData (data) {
  console.log(JSON.stringify(data))
  var timeout = (data.timeout || 0)

  if (data.operation === operations.shutdown) {
    // tools.issueWindowsCommand('shutdown -t ' + timeout + ' -s')
    console.log('Worked')
  }
}

module.exports = server
