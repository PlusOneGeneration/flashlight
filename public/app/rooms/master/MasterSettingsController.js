angular.module('Flashlight')

    .service('SettingsService', function () {

        var settings = {
            backgroundColor: 'rgb(0,0,0)',
            color: 'rgb(255,255,255)',
            scale: false,
            randomColors: false,
            smile: false,
            lsd: false,
            showSettings: false
        };

        var defaultSettings = _.merge({}, settings);

        return {
            settings: settings,
            reset: function () {
                _.merge(this.settings, defaultSettings);
            }
        };

    })

    .controller('MasterSettingsController', function ($scope, $rootScope, $state, $location, SocketService, SettingsService, AudioService, $timeout) {
        $scope.SettingsService = SettingsService;
        $scope.showSettings = false;

        $scope.stopped = AudioService.getStatus();
        $scope.view = 'settings.colors';

        $scope.reset = function () {
            $timeout(function () {
                SettingsService.reset();
            }, 0)
        };

        $scope.toggle = function () {
          if ($scope.stopped) {
              $scope.start();
          } else {
              $scope.stop();
          }
        };

        $scope.start = function () {
            AudioService.start();
            $scope.stopped = AudioService.getStatus();
        };

        $scope.stop = function () {
            AudioService.stop();
            $scope.stopped = AudioService.getStatus();
        };


        $scope.showMessage = function (message) {
            $rootScope.message = message;
            $timeout(function () {
                $rootScope.message = '';
            }, 1500)
        };

        SocketService.emit('room.listener.create', {token: $state.params.room}, function (err, data) {
            if (err) return console.error(err);

            $scope.$apply(function () {
                $scope.shareUrl = $location.$$protocol + '://' + $location.$$host + '/' + $state.href('listener', {room: data.room});
            });
        });
    })
;