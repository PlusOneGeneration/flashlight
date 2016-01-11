angular.module('Flashlight')

    .controller('MasterController', function ($scope, $interval, $location,
                                              $state, SocketService, AudioService,
                                              SettingsService) {
        $scope.signal = 0;
        $scope.SettingsService = SettingsService;
        $scope.showSettings = false;

        AudioService.listen(function (data) {
            var model = {
                signal: data,
                token: $state.params.room
            };
            SocketService.emit('room.signal', model);
        });

        $scope.$on('$destroy', function () {
            AudioService.stop();
        });

        SocketService.emit('room.connect', {token: $state.params.room});

        SocketService.scopeOn($scope, 'room.signal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;