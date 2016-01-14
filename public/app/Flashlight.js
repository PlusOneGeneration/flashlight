angular
    .module('Flashlight', ['ui.router', 'SocketService',
        'angular-clipboard', 'ja.qr', 'color.picker', 'ngAnimate'])
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
                templateUrl: "app/rooms/master/master.html",
                controller: 'MasterController'
            })
            .state('listener', {
                url: "/listener/:room",
                templateUrl: "app/rooms/listener/listener.html",
                controller: 'ListenerController'
            })
            .state('room.settings', {
                url: "/settings",
                views: {
                    'toolbar@room': {
                        templateUrl: "app/rooms/master/settings.html",
                        controller: 'MasterSettingsController'
                    }
                }
            })
            .state('listener.settings', {
                url: "/settings",
                templateUrl: "app/rooms/listener/settings.html",
                controller: 'ListenerSettingsController'
            })
    })
;
