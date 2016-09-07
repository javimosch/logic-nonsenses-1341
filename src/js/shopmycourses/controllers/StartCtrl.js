angular.module('shopmycourse.controllers')

/**
 * @name StartCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Page d'accueil pour les utilisateurs non connectés
*/

.controller('StartCtrl', function($scope, $state, CurrentUser, CurrentAddress) {

  /**
   * Initialisation de l'utilisateur s'il il est connecté
  */
  if (CurrentUser.isLogged()) {
    CurrentAddress.init();
    $state.go('tabs.home');
  }
  
  console.log('start ctrl')

})
