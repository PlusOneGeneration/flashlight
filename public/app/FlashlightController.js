angular.module('Flashlight')
    .factory('FlashlightResource', function ($resource) {
        return $resource('/api/flashlight')
    })

    .factory('socket', function () {
        var socket = io.connect('http://192.168.10.20:3000/');
        return socket;
    })

    .controller('FlashlightController', function ($scope, $state, FlashlightResource, socket, $interval) {
        $scope.listen = function () {
            $interval(function () {
                socket.emit('hello', {hello: 'world'});
            }, 500);

            socket.on('xxx', function () {
                console.log(arguments);
            });

            FlashlightResource.get(function (responce) {
                $state.go('room', {room: responce.room});
            });
        };
    })
;