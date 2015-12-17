angular.module('Flashlight')
    .factory('Room', function ($resource) {
        return $resource('/api/rooms/:roomId')
    })
    .controller('FlashlightController', function ($scope, $state, Room) {
        $scope.listen = function () {
            new Room().$save().then(function (room) {
                $state.go('room', {room: room.room});
            });
        };
    })
;