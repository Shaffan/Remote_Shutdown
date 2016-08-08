const {ipcRenderer, remote} = nodeRequire('electron')
let ls = localStorage
let initialising = true
let devToolsOpen = false

app.controller('ServerController', ['$scope', 'serverService', function($scope, serverService) {
    ipcRenderer.on('server_status_changed', (event, val) => {
        $scope.$apply(function() {
            $scope.server_status = val
        })
    })
    ipcRenderer.on('device_ips_loaded', (event, adapters) => {
        let storedValue = ls.getItem('defaultIp')
        let notNullOrZero = storedValue > 0 && storedValue !== null
        let storedIp = notNullOrZero ? storedValue : adapters[0]
        $scope.adapters = adapters
        $scope.$apply(function() {
            $scope.selectedOption = storedIp
        })
        ipcRenderer.send('selected_ip_inc', $scope.selectedOption)
        initialising = false
    })

    $scope.$watch('selectedOption', function(index) {
        if($scope.adapters && !initialising) {
          ipcRenderer.send('selected_ip_inc', $scope.selectedOption)
          ls.setItem('defaultIp', $scope.selectedOption)
        }
    })
    $scope.start_server = function() {
        if (!$scope.server_status) {
            serverService.start()
        }
    }
    $scope.stop_server = function() {
        serverService.stop()
    }
    $scope.reload = function() {
        const window = remote.getCurrentWindow()
        //serverService.stop()
        window.reload()
    }
    $scope.toggleDevTools = function() {
        if (!devToolsOpen) {
            ipcRenderer.send('open-devtools');
            devToolsOpen = true
        } else {
            ipcRenderer.send('close-devtools');
            devToolsOpen = false
        }

    }
}])
