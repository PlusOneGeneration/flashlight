angular
    .module('Flashlight', ['ui.router', 'SocketService', 'AudioService'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/flashlight");

        $stateProvider
            .state('flashlight', {
                url: "/flashlight",
                templateUrl: "app/flashlight.html",
                controller: 'FlashlightController'
            })
            .state('room', {
                url: "/rooms/:room",
                templateUrl: "app/rooms/master.html",
                controller: 'MasterController'
            })
            .state('listener', {
                url: "/listener/:room",
                templateUrl: "app/rooms/listener.html",
                controller: 'ListenerController'
            })
    })
;
