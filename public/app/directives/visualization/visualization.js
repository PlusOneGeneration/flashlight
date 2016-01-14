angular.module('Flashlight')

    .directive('visualization', function (SettingsService) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                scope.SettingsService = SettingsService;

                var randomColors = SettingsService.settings.randomColors;
                var scale = SettingsService.settings.scale;
                var smile = SettingsService.settings.smile;
                var lsd = SettingsService.settings.lsd;

                var rand = function () {
                    return parseInt(Math.random(0, 255) * 255);
                };

                scope.$watch('SettingsService.settings', function (settings) {
                    scope.settings = settings;
                    randomColors = settings.randomColors;
                    scale = settings.scale;
                    smile = settings.smile;
                    lsd = settings.lsd;

                    element.parent().css('background-color', scope.settings.backgroundColor);

                    if (!randomColors) {
                        element.css('background', scope.settings.color);
                    }
                }, true);

                scope.$watch('signal', function (signal) {
                    var opacity = signal / 255;

                    if (randomColors) {
                        element.css('background', 'rgb(' + rand() + ' , ' + rand() + ', ' + rand() + ')');
                    }

                    if (scale) {
                        element.css('-webkit-border-radius', signal * 50);
                        element.css('-webkit-transform', 'scale(' + opacity + ')');
                    } else {
                        element.css('-webkit-border-radius', 0);
                        element.css('-webkit-transform', 'scale(1)');
                    }
                    if (lsd) {
                        element.css('-webkit-border-radius', signal * 50);
                        element.css('-webkit-transform', 'scale(' + opacity + ')');
                        element.css('-webkit-transform', 'rotate(' + rand() + 'deg)');
                        element.css('background', 'rgb(' + rand() + ' , ' + rand() + ', ' + rand() + ')');
                    }

                    if (smile) {
                        element.css('background', 'url(/styles/smile-512.png) no-repeat center center');
                        //element.css('-webkit-transform', 'rotate(' + rand() + 'deg)');
                    }

                    element.css('opacity', opacity);
                });
            },
            scope: {
                signal: "=signal"
            }
        }
    })
;