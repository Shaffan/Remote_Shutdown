const os = require('os');
const util = require('util')
const fs = require('fs')

var tools = {
  issueWindowsCommand: function(cmd) {
    const exec = require('child_process').exec;
    var child = exec(cmd, function(error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  },
  setHeaders: function(response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  },
  getDeviceIps: function() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    return addresses;
  },
  logErr: function (errObj) {
    var log_file = fs.createWriteStream(__dirname + '/../logs/DebugLog.txt', {flags : 'a'})
    const log_stdout = process.stdout

    console.log(errObj)
    log_file.write(util.format('%s - %s :\r\n', new Date().toLocaleString("uk"), errObj.stack))
  }
};



module.exports = tools;
