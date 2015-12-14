angular
  .module('Flashlight', ['ui.router', 'ngResource'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/flashlight");

    $stateProvider
      .state('flashlight', {
        url: "/flashlight",
        templateUrl: "app/flashlight.html",
        controller: 'FlashlightController'
      })
  })
;
