app.factory('serverService', [function() {
  const {ipcRenderer} = nodeRequire('electron')

  return {
      start: function() {
          ipcRenderer.send('start_server');
      },
      stop: function() {
          ipcRenderer.send('stop_server');
      }
  }
}]);
