angular.module('shopmycourse.directives')
/**
 * @name notifications
 * @function Directive
 * @memberOf shopmycourse.directives
 * @description Affichage de la popup des notifications
 */

.directive('notifications', ['$modal',function($modal) {

  return {
    template: '<button class="button button-clear button-icon" ng-click="openNotificationsModal()"><i class="icon-smc-notification" style="font-size:32px;"></i></button>',
    link: function($scope, $element, $attrs) {


      var modal = $modal({
        scope: $scope,
        templateUrl: '/templates/NotificationsModal.html',
        show: false,
        onHide: function(a, b, c) {

        }
      });


      $scope.openNotificationsModal = function() {
        modal.$promise.then(modal.show);
      };



    }
  };
}]);
