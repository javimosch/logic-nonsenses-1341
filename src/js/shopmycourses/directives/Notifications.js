angular.module('shopmycourse.directives', [])

/**
 * @name notifications
 * @function Directive
 * @memberOf shopmycourse.directives
 * @description Affichage de la popup des notifications
*/

.directive('notifications', ['$ionicModal', function($ionicModal) {

    return {
        template: '<button class="button button-clear button-icon" ng-click="openNotificationsModal()"><i class="icon-smc-notification" style="font-size:32px;"></i></button>',
        link: function($scope, $element, $attrs) {

          $ionicModal.fromTemplateUrl('templates/NotificationsModal.html', {
              scope: $scope,
              animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.notificationsModal = modal
          });

          $scope.openNotificationsModal = function () {
            $scope.notificationsModal.show();
          };

          $scope.closeNotificationsModal = function () {
            $scope.notificationsModal.hide();
          };

        }
    };
}]);
