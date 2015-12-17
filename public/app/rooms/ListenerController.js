angular.module('Flashlight')
    .controller('ListenerController', function ($scope, $state, SocketService) {
        console.log('!!!!!!!');
        SocketService.emit('room.connect', {token: $state.params.room});

        SocketService.on('processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;