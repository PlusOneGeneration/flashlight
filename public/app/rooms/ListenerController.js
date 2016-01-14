angular.module('Flashlight')
    .controller('ListenerController', function ($scope, $state, SocketService, SettingsService) {
        $scope.signal = 0;

        $scope.listener = true;

        $scope.SettingsService = SettingsService;

        SocketService.emit('room.connect', {token: $state.params.room});

        SocketService.scopeOn($scope,'room.signal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;