angular.module('Flashlight')
    .controller('RoomController', function ($scope, $interval, $location, $state, SocketService) {
        $scope.signal = 0;

        SocketService.emit('room.connect', {token: $state.params.room});

        $interval(function () {
            var signalModel = {
                signal: Math.random(),
                token: $state.params.room
            };
            SocketService.emit('room.signal', signalModel);
        }, 100);

        SocketService.scopeOn($scope, 'processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });

        SocketService.emit('room.listener', {token: $state.params.room}, function (err, data) {
            if (err) return console.error(err);
            $scope.shareUrl = $state.href('listener')+data.room;
        });
    })
;