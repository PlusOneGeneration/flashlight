angular.module('Flashlight')

    .controller('MasterController', function ($scope, $interval, $location, $state, SocketService, AudioService) {
        $scope.signal = 0;

        AudioService.listen(function (data) {
            var model = {
                signal: data,
                token: $state.params.room
            };
            SocketService.emit('room.signal', model);
        });

        SocketService.emit('room.connect', {token: $state.params.room});

        SocketService.scopeOn($scope, 'room.signal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });

        SocketService.emit('room.listener.create', {token: $state.params.room}, function (err, data) {
            if (err) return console.error(err);
            $scope.shareUrl = $state.href('listener', {room: data.room});
        });
    })
;