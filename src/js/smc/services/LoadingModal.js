angular.module('shopmycourse.services')

/**
 * @name LoadingModal
 * @function Service
 * @memberOf shopmycourse.services
 * @description Loading modal for XHR operations.
 */

.factory('LoadingModal', function($window, $uibModal, $log, DomRefresher) {

    var instance = null;

    function show(text) {
        $log.debug('LoadingModal: Show text ' + text);
        instance = $uibModal.open({
            animation: false,
            keyboard: false,
            backdrop: 'static',
            windowTopClass: 'static-backdrop',
            templateUrl: 'static-backdrop.html',
            /*app.templates.html*/
            controller: function($scope) {
                $scope.message = text;
            },
            size: 'sm'
        });
    }

    function hide() {
        $log.debug('LoadingModal: Hide');
        DomRefresher(function(){
            if (instance) instance.dismiss();
        },200);
    }


    window.LoadingModal = {
        show: show,
        hide: hide,
        getInstance: function() {
            return instance;
        }
    };

    return window.LoadingModal;
});
