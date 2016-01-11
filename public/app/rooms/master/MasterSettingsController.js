angular.module('Flashlight')

    .service('SettingsService', function () {

        return {
            color: 'white',
            effect: null
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