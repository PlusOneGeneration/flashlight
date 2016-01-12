angular.module('Flashlight')

    .directive('isDisabled', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch('isDisabled', function (value) {
                    if (value) {
                        element.find('input').attr('disabled', 'disabled');
                        element.find('input').parent().addClass('disabled');
                        element.addClass('disabled');

                    } else {
                        element.find('input').removeAttr('disabled');
                        element.removeClass('disabled');
                        element.find('input').parent().removeClass('disabled');
                    }
                });
            },
            scope: {
                isDisabled: "="
            }
        }
    })
;