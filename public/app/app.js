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
            .state('rooms', {
                url: "/rooms",
                templateUrl: "app/rooms/rooms.html"
            })
            .state('room', {
                url: "/rooms/:room",
                templateUrl: "app/rooms/room.html",
                controller: 'RoomController'
            })
    })
;
