angular.module('Flashlight')
    .factory('FlashlightResource', function ($resource) {
        return $resource('/api/flashlight')
    })

    .controller('FlashlightController', function ($scope, $state, FlashlightResource) {
        $scope.listen = function () {
            FlashlightResource.get(function (responce) {
                $state.go('room', {room: responce.room});
            });
        };
    })
;