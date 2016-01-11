angular.module('Flashlight')

    .directive('visualization', function (SettingsService) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.SettingsService = SettingsService;

                scope.$watchCollection('SettingsService', function (settings) {
                    scope.settings = settings;
                });


                //var rand = function () {
                //    return parseInt(Math.random(0, 255) * 255);
                //};

                element.css('background', 'rgb(255,255,255)');
                //element.css('background', 'url(/styles/smile-512.png) no-repeat center center');

                scope.$watch('signal', function (signal) {
                    element.css('background-color', 'rgb(' + (signal) + ' , ' + (signal) + ', ' + (signal) + ')');
                    var opacity = signal / 255;

                    //var color = 'rgb(' + rand() + ' , ' + rand() + ', ' + rand() + ')';

                    //element.css('background', color);
                    element.css('opacity', opacity);
                    //element.css('-webkit-transform', 'scale('+ opacity +')');
                    //element.css('-webkit-transform', 'rotate('+ opacity +')');
                    //element.css('-webkit-border-radius', signal * 50);



                });
            },
            scope: {
                signal: "=signal"
            }
        }
    })

;