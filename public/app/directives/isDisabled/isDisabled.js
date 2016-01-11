angular.module('Flashlight')

    .directive('isDisabled', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch('isDisabled', function (value) {
                    if (value) {
                        element.find('input').attr('disabled', 'disabled');
                        element.find('button').attr('disabled', 'disabled');
                        element.addClass('disabled');

                    } else {
                        element.find('input').removeAttr('disabled');
                        element.find('button').removeAttr('disabled');
                        element.removeClass('disabled');
                    }
                });
            },
            scope: {
                isDisabled: "="
            }
        }
    })
;