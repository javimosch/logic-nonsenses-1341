angular.module('shopmycourse.controllers')

/**
 * @name ProfileShowCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Page des paramètres
*/

.controller('ProfileShowCtrl', function($scope, $ionicLoading, $state, $ionicPopup, $ionicModal, Authentication, CurrentUser, CurrentAddress, UserAPI) {

  /**
   * Initialisation de la valeur du portefeuille à 0
  */
  $scope.walletValue = 0;

  /**
   * Affichage du message de chargement pour récupérer le profil
  */
  $ionicLoading.show({
    template: 'Nous récupérons votre profil...'
  });

  /**
   * Chargement de l'utilisateur actuel
  */
  $scope.user = {};
  CurrentUser.get(function (user) {
    $scope.user = user;
    $scope.avatarBackground = CurrentUser.getAvatar();
    UserAPI.getWallet({idUser: user.id}, function (wallet) {
      $scope.walletValue = wallet.value;
    });
    $ionicLoading.hide();
  });

  /**
   * @name $scope.togglePhone
   * @description Affichage d'une popup de confirmation quand il y a modification des options de partage du téléphone
  */
  $scope.togglePhone = function () {
    if (!$scope.user.share_phone) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Masquer son numéro de téléphone',
        template: 'Êtes-vous sûr de vouloir masquer votre numéro de téléphone ?<br>On vous le déconseille afin de pouvoir communiquer plus facilement avec les autres utilisateurs, si un article est manquant par exemple.<br>De plus cela peut détériorer la note laissée par les autres utilisateurs.'
      });
      confirmPopup.then(function (res) {
        $scope.user.share_phone = !res;
        $ionicLoading.show({
          template: 'Nous sauvegardons vos préférences...'
        });
        UserAPI.update($scope.user, function (user) {
          $ionicLoading.hide();
          CurrentUser.set(user, function() {});
          $scope.user = user;
        });
      });
    } else {
      $ionicLoading.show({
        template: 'Nous sauvegardons vos préférences...'
      });
      UserAPI.update($scope.user, function (user) {
        $ionicLoading.hide();
        CurrentUser.set(user, function() {});
        $scope.user = user;
      });
    }
  };

  /**
   * Affichage de la popup "Charte de confidentialité"
  */
  $ionicModal.fromTemplateUrl('templates/Privacy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openPrivacy = function() {
    $scope.modal.show();
  };
  $scope.closePrivacy = function() {
    $scope.modal.hide();
  };

  /**
   * Affichage de la popup "Conditions générales d'utilisation"
  */
  $ionicModal.fromTemplateUrl('templates/CGU.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modalCGU = modal;
  });
  $scope.openCGU = function () {
    $scope.modalCGU.show();
  };
  $scope.closeCGU = function () {
    $scope.modalCGU.hide();
  };

  /**
   * @name $scope.logout
   * @description Lancement de la déconnexion
  */
  $scope.logout = function () {
    Authentication.logout(function() {
      window.plugins.googleplus.disconnect(function (msg) {
        console.log(msg);
      });
      $state.go('start');
    });
  };

})
