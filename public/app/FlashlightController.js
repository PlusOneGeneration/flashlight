angular.module('Flashlight')
  .factory('FlashlightResource', function ($resource) {
    return $resource('/api/flashlight')
  })

  .controller('FlashlightController', function ($scope, FlashlightResource) {
    $scope.listen = function () {
      FlashlightResource.get(function (response) {
        alert(response.message)
      })
    }
  })
;