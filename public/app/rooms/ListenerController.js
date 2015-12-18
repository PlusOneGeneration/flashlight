angular.module('Flashlight')
    .controller('ListenerController', function ($scope, $state, SocketService) {
        $scope.signal = 0;
        SocketService.emit('room.connect', {token: $state.params.room});
        SocketService.on('processedSignal', function (data) {
            $scope.$apply(function () {
                $scope.signal = data.signal;
            });
        });
    })
;