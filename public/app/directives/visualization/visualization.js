angular.module('Flashlight')

    .directive('visualization', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch('signal', function (signal) {
                    element.css('background-color', 'rgb(' + signal + ' , ' + signal + ', ' + signal + ')');
                });
            },
            scope: {
                signal: "=signal"
            }
        }
    })

;