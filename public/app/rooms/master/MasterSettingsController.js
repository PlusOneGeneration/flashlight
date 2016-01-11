angular.module('Flashlight')

    .service('SettingsService', function () {

        return {
            backgroundColor: 'rgb(0,0,0)',
            color: 'rgb(255,255,255)',
            scale: false,
            randomColors: false,
            smile: false,
            lsd: false
        };

    })

    .controller('MasterSettingsController', function ($scope, $state, $location, SocketService) {

        $scope.showMessage = function (message) {
            alert(message);
        };

        SocketService.emit('room.listener.create', {token: $state.params.room}, function (err, data) {
            if (err) return console.error(err);

            $scope.$apply(function () {
                $scope.shareUrl = $location.$$protocol + '://' + $location.$$host + '/' + $state.href('listener', {room: data.room});
            });
        });
    })

    .controller('MasterSettingsColorsController', function ($scope, SettingsService) {
        $scope.SettingsService = SettingsService;
    })

;