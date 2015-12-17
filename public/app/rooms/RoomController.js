angular.module('Flashlight')
    .controller('RoomController', function ($scope, SocketService, $interval, $location, $state) {
        $scope.signal = 0;
        POC_analyser(function (data) {

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