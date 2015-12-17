angular.module('Flashlight')
    .controller('RoomController', function ($scope, $interval, $location, $state, SocketService) {
        $scope.signal = 0;

        $scope.shareListening = function () {
            SocketService.emit('room.listener', {token: $state.params.room}, function (err, data) {
                if (err) return console.error(err);
                var url = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/rooms/'+data.room;
                alert(url);
            });
        };

        $interval(function () {
            var signalModel = {
                signal: Math.random(),
                token: $state.params.room
            };
            SocketService.emit('room.signal', signalModel);
        }, 2000);

        SocketService.on('processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;