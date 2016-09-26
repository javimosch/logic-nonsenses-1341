angular.module('shopmycourse.controllers')

/**
 * @name ProfileSignUpCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Page d'inscription
*/

.controller('ProfileSignUpCtrl', function ($scope, $rootScope, $ionicModal, $ionicLoading, $ionicPopup, $state, toastr, Authentication, Validation, CurrentUser) {

  /**
   * Initialisation de la validation du formulaire
  */
  $scope.validation = Validation;

  /**
   * Initialisation du formulaire
  */
  $scope.isSignup = true;
  $scope.user = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    auth_token: '',
    auth_method: ''
  };

  /**
   * @name $scope.signUp
   * @description Lancement de l'inscription
  */
  $scope.signUp = function() {
    $ionicLoading.show({
      template: 'Nous créons votre compte...'
    });
    Authentication.signup($scope.user, function (correct, errorMessage) {
      $ionicLoading.hide();
      if (correct) {
        console.log('SignUp : Logged');
        $state.go('tabs.home');
      } else {
        toastr.warning(errorMessage, 'Authentification');
        console.log('SignUp error : ' + errorMessage);
      }
    });
  };
  
  function catchFacebookSigInErrors(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    console.log(errorCode, errorMessage, email, credential);
  }


  /**
   * @name $scope.signUpWithFacebook
   * @description Inscription avec Facebook
  */
  $scope.signUpWithFacebook = function () {
    $ionicPopup.show({
      templateUrl: 'templates/Profile/ExternalServicesPopup.html',
      title: 'Inscription avec Facebook',
      scope: $scope,
      buttons: [
        {
          text: 'Retour',
          onTap: function(e) {
            return (true);
          }
        },
        {
          text: 'OK',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.user.phone) {
              e.preventDefault();
              toastr.error('Votre numéro de téléphone comporte des erreurs');
            } else {
              
              var provider = new firebase.auth.FacebookAuthProvider();
          return firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            console.log(token, user);

            $scope.user.auth_token = token;
            $scope.user.auth_method = 'facebook';
            $scope.signUp();

          }).catch(catchFacebookSigInErrors);
          return true;
              
              facebookConnectPlugin.login(["email", "public_profile"], function(data) {
                $scope.user.auth_token = data.authResponse.accessToken;
                $scope.user.auth_method = 'facebook';
                $scope.signUp();
              }, function(error) {
                toastr.error('Une erreur est survenue lors de l\'inscription via Facebook', 'Inscription');
                console.log('Facebook signup errors : ', error);
              });
              return (true);
            }
          }
        }
      ]
    });
  };

  /**
   * @name $scope.signUpWithGoogle
   * @description Inscription avec Google
  */
  $scope.signUpWithGoogle = function () {
    $ionicPopup.show({
      templateUrl: 'templates/Profile/ExternalServicesPopup.html',
      title: 'Inscription avec Google',
      scope: $scope,
      buttons: [
        {
          text: 'Retour',
          onTap: function(e) {
            return (true);
          }
        },
        {
          text: 'OK',
          type: 'button-positive',
          onTap: function(e) {

            if (!$scope.user.phone) {
              e.preventDefault();
              toastr.error('Votre numéro de téléphone comporte des erreurs');
            } else {
              window.plugins.googleplus.disconnect();
              window.plugins.googleplus.login({
                  'webClientId': '979481548722-mj63ev1utfe9v21l5pdiv4j0t1v7jhl2.apps.googleusercontent.com',
                  'offline': true
                },
                function(data) {
                  $scope.user.id_token = data.idToken;
                  $scope.user.auth_method = 'google';
                  $scope.signUp();
                },
                function(error) {
                  toastr.error('Une erreur est survenue lors de l\'inscription via Google', 'Inscription');
                  console.log('Google signup errors : ', error);
                }
              );
              return (true);
            }
          }
        }
      ]
    });
  };

  /**
   * @name $scope.signUpWithEmail
   * @description Inscription classique avec email et mot de passe
  */
  $scope.signUpWithEmail = function () {
    $scope.user.auth_method = 'email';
    $scope.signUp();
  };

  /**
   * Affichage des popups CGU et CGU Lemonway
  */
  $ionicModal.fromTemplateUrl('templates/CGU.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openCGU = function () {
    $scope.modal.show();
  };
  $scope.openLemonWayCGU = function() {
    window.open('https://www.lemonway.fr/legal/conditions-generales-d-utilisation', '_system', 'location=yes');
    return false;
  };
  $scope.closeCGU = function () {
    $scope.modal.hide();
  };

})
