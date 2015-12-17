angular.module('Flashlight')
    .controller('FlashlightController', function ($scope, $state, SocketService) {
        $scope.listen = function () {
            SocketService.emit('room.create', function (err, data) {
                if (err) return console.error(err);
                $state.go('room', {room: data.room});
            });
        };
    })
;