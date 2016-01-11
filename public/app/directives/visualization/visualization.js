angular.module('Flashlight')

    .directive('visualization', function (SettingsService) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                scope.SettingsService = SettingsService;

                var randomColors = SettingsService.randomColors;
                var scale = SettingsService.scale;
                var smile = SettingsService.smile;
                var lsd = SettingsService.lsd;

                var rand = function () {
                    return parseInt(Math.random(0, 255) * 255);
                };

                scope.$watchCollection('SettingsService', function (settings) {
                    scope.settings = settings;
                    randomColors = settings.randomColors;
                    scale = settings.scale;
                    smile = settings.smile;
                    lsd = settings.lsd;

                    element.parent().css('background-color', scope.settings.backgroundColor);

                    if (!randomColors) {
                        element.css('background', scope.settings.color);
                    }
                });

                scope.$watch('signal', function (signal) {
                    var opacity = signal / 255;

                    if (randomColors) {
                        element.css('background', 'rgb(' + rand() + ' , ' + rand() + ', ' + rand() + ')');
                    }

                    if (scale) {
                        element.css('-webkit-transform', 'scale(' + opacity + ')');
                        element.css('-webkit-border-radius', signal * 50);
                    } else {
                        element.css('-webkit-transform', 'scale(1)');
                        element.css('-webkit-border-radius', 0);
                    }
                    if (lsd) {
                        element.css('-webkit-transform', 'scale(' + opacity + ')');
                        element.css('-webkit-border-radius', signal * 50);
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