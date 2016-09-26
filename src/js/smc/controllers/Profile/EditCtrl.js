angular.module('shopmycourse.controllers')

/**
 * @name ProfileEditCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Édition du profil dans les paramètres
*/

.controller('ProfileEditCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $ionicViewSwitcher, $ionicPopup, $jrCrop, Validation, CurrentUser, UserAPI, Camera, $ionicActionSheet) {

  /**
   * Initialisation de la validation du formulaire
  */
  $scope.validation = Validation;

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
      $ionicLoading.hide();
  });

  /**
   * @name getPictureFromCamera
   * @description Récupération d'une photo à partir de l'appareil photo / galerie
  */
  getPictureFromCamera = function(type) {
    Camera.getPicture(type, function(imageData) {
      $jrCrop.crop({
          url: 'data:image/jpeg;base64,' + imageData,
          width: 200,
          height: 200,
          cancelText: 'Annuler',
          chooseText: 'OK'
      }).then(function(image) {
        // Pass the base64 string to avatar.url for displaying in the app
        $scope.avatarBackground = image.toDataURL();
        // Pass the base64 string to the param for rails saving
        $scope.user.avatar = image.toDataURL();
        $scope.$apply();
      }, function() {
        console.log('jrCrop: User canceled or couldn\'t load image.');
      });
    }, function (error) {
      console.log('Camera: ' + error);
    }, {
      correctOrientation: true,
      targetWidth: 200,
      targetHeight: 200
    });
  };

  /**
   * @name $scope.changeAvatar
   * @description Sélection du mode pour modifier l'avatar
  */
  $scope.changeAvatar = function() {
    var photoSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Prendre une photo' },
        { text: 'Accéder à la galerie' }
      ],
      titleText: 'Modifier votre avatar',
      cancelText: 'Annuler',
      cancel: function() {},
      buttonClicked: function(index) {
        getPictureFromCamera(index);
        return true;
      }
    });
  };

  /**
   * @name $scope.endEdit
   * @description Enregistrement du profil
  */
  $scope.endEdit = function () {
    $ionicLoading.show({
      template: 'Nous sauvegardons votre profil...'
    });
    UserAPI.update($scope.user, function (user) {
      $ionicLoading.hide();
      if (user) {
        $scope.user = user;
        CurrentUser.set(user, function () {
          $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
          });
          $state.go('tabs.profile');
        });
      } else {
        console.log(errorCode);
      }
    }, function(err) {
      $ionicLoading.hide();
      console.log(err);
    });
  };

})
