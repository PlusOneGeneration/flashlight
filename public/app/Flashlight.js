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
                templateUrl: "app/rooms/layout.html",
                controller: 'MasterController'
            })
            .state('room.settings', {
                url: "/settings",
                views: {
                    'toolbar@room': {
                        templateUrl: "app/rooms/settings.html",
                        controller: 'SettingsController'
                    }
                }
            })
            .state('listener', {
                url: "/listener/:room",
                templateUrl: "app/rooms/layout.html",
                controller: 'ListenerController'
            })

            .state('listener.settings', {
                url: "/settings",
                views: {
                    'toolbar@listener': {
                        templateUrl: "app/rooms/settings.html",
                        controller: 'SettingsController'
                    }
                }
            })
    })
;
