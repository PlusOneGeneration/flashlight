angular.module('Flashlight')
    .controller('RoomController', function ($scope, SocketService, $interval, $location, $state) {
        $scope.signal = 0;

        SocketService.emit('room.connect', {token: $state.params.room});

        $interval(function () {

            var signalModel = {
                signal: Math.random(),
                token: $state.params.room
            };

            SocketService.emit('room.signal', signalModel);
        }, 500);
        //
        SocketService.scopeOn($scope, 'processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;