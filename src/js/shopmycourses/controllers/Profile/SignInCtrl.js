angular.module('shopmycourse.controllers')

/**
 * @name ProfileSignInCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Page de connexion
 */

.controller('ProfileSignInCtrl', function($scope, $modal, $rootScope, $state, toastr, Authentication, Validation, CurrentUser, UserAPI) {

  /**
   * Initialisation de la validation du formulaire
   */
  $scope.validation = Validation;

  /**
   * Initialisation du formulaire
   */
  $scope.isSignin = true;
  $scope.init = function() {
    $scope.user = {
      email: '',
      password: ''
    };
  };

  /**
   * @name $scope.signIn
   * @description Lancement de la connexion
   */
  $scope.signIn = function() {

    //$ionicLoading.show({
    //      template: 'Nous vérifions vos identifiants...'
    //});

    Authentication.login($scope.user, function(correct, errorMessage) {

      //$ionicLoading.hide();

      if (correct) {
        $scope.init();
        $state.go('tabs.home');
      }
      else {
        toastr.warning(errorMessage, 'Authentification');
        console.error('SignIn error : ' + errorMessage);
      }
    });
  };

  $scope.init();


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

  var self = $scope;


  $scope.handleSignInFacebookButton = function() {
    $modal({
      scope: $scope,
      templateUrl: '/templates/Profile/ExternalServicesPopup.html',
      show: true,
      controller: function($scope) {
        $scope.ok = function() {
          self.signIn.signInWithFacebook();
          $scope.$hide();
        }
        $scope.close = function() {
          $scope.$hide();
        }
      }
    });
  }

  /**
   * @name $scope.signInWithFacebook
   * @description Connexion avec Facebook
   */
  $scope.signInWithFacebook = function() {
    var provider = new window.firebase.auth.FacebookAuthProvider();
    window.firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;

      console.info('logged', user);

      $scope.user.auth_token = token;
      $scope.user.auth_method = 'facebook';
      //$scope.signIn();
      toastr.error('Logged', 'Connexion');

      // ...
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.warn('error', errorCode, errorMessage, email, credential);
      toastr.error('Une erreur est survenue lors de la connexion via Facebook', 'Connexion');
    });


    return;
  };



  /**
   * @name $scope.signInWithGoogle
   * @description Connexion avec Google
   */
  $scope.signInWithGoogle = function() {
    $ionicPopup.show({
      templateUrl: 'templates/Profile/ExternalServicesPopup.html',
      title: 'Connexion avec Google',
      scope: $scope,
      buttons: [{
        text: 'Retour',
        onTap: function(e) {
          return (true);
        }
      }, {
        text: 'OK',
        type: 'button-positive',
        onTap: function(e) {
          window.plugins.googleplus.disconnect();
          window.plugins.googleplus.login({
              'webClientId': '979481548722-mj63ev1utfe9v21l5pdiv4j0t1v7jhl2.apps.googleusercontent.com',
              'offline': true
            },
            function(data) {
              $scope.user.id_token = data.idToken;
              $scope.user.auth_method = 'google';
              $scope.signIn();
            },
            function(error) {
              toastr.error('Une erreur est survenue lors de la connexion via Google', 'Connexion');
              console.log('Google login errors : ', error);
            }
          );
          return (true);
        }
      }]
    });
  };

  /**
   * @name $scope.signInWithEmail
   * @description Connexion classique avec email et mot de passe
   */
  $scope.signInWithEmail = function() {
    $scope.user.auth_method = 'email';
    $scope.signIn();
  };

  /**
   * @name $scope.forgotPassword
   * @description Ouverture de la popup pour mot de passe oublié
   */
  $scope.forgotPassword = function() {
    if (!$scope.user.email || $scope.user.email.length <= 0) {
      toastr.warning('Veuillez rentrer une adresse email valide', 'Mot de passe oublié');
      return;
    }
    $ionicLoading.show({
      template: 'Envoi du mot de passe...'
    });
    UserAPI.forgotPassword({
      user: {
        email: $scope.user.email
      }
    }, function(data) {
      toastr.info('Votre mot de passe a été envoyé par email', 'Mot de passe oublié');
      $ionicLoading.hide();
    }, function(err) {
      toastr.warning('Cettre adresse email n\'est pas enregistrée', 'Mot de passe oublié');
      $ionicLoading.hide();
    });
  };

  /**
   * Affichage des popups CGU et CGU Lemonway
   **/
  var CGUModal = $modal({
    scope: $scope,
    templateUrl: '/templates/CGU.html',
    show: false,
    onHide: function(a, b, c) {

    }
  });


  $scope.openCGU = function() {
    //$scope.modal.show();
    CGUModal.$promise.then(CGUModal.show);
  };
  $scope.openLemonWayCGU = function() {
    window.open('https://www.lemonway.fr/legal/conditions-generales-d-utilisation', '_system', 'location=yes');
    return false;
  };
  $scope.closeCGU = function() {
    $scope.modal.hide();
  };

});
