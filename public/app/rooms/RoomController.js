angular.module('Flashlight')
    .factory('socket', function () {
        var socket = io.connect('http://192.168.10.20:3000/');
        return socket;
    })

    .controller('RoomController', function ($scope, socket, $interval, $location, $state) {
        $scope.signal = 0;

        socket.emit('connectToRoom', {token: $state.params.room});

        $interval(function () {

            var signalModel = {
                signal: Math.random(),
                token: $state.params.room
            };

            socket.emit('signal', signalModel);
        }, 500);
        //
        socket.on('processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;