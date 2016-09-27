angular.module('shopmycourse.services')

/**
 * @name LoadingModal
 * @function Service
 * @memberOf shopmycourse.services
 * @description Loading modal for XHR operations.
 */

.factory('LoadingModal', function($window, $uibModal, $log) {

    var instance = null;

    function show(text) {
        $log.debug('LoadingModal: Show text ' + text);
        instance = $uibModal.open({
            animation: false,
            keyboard: false,
            backdrop: 'static',
            windowTopClass: 'static-backdrop',
            templateUrl: 'static-backdrop.html', /*app.templates.html*/
            controller: function($scope) {
                $scope.message = text;
            },
            size: 'sm'
        });
    }

    function hide() {
        $log.debug('LoadingModal: Hide');
        if (instance) instance.dismiss();
    }
    return {
        show: show,
        hide: hide
    };
});
