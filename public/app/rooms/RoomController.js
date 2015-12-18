angular.module('Flashlight')
    .controller('RoomController', function ($scope, SocketService, $interval, $location, $state, AudioService) {
        $scope.signal = 0;
        AudioService.listen(function (data) {
            var signalModel = {
                signal: data,
                token: $state.params.room
            };

            SocketService.emit('room.signal', signalModel);
        });

        SocketService.emit('room.connect', {token: $state.params.room});

        SocketService.scopeOn($scope, 'processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;