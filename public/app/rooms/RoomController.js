angular.module('Flashlight')
    .controller('RoomController', function ($scope, socket, $interval, $location, $state) {
        $scope.signal = 0;

        socket.emit('room.connect', {token: $state.params.room});

        $interval(function () {

            var signalModel = {
                signal: Math.random(),
                token: $state.params.room
            };

            socket.emit('room.signal', signalModel);
        }, 500);
        //
        socket.on('processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;