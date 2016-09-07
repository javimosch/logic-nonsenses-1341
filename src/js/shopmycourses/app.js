// Ionic Shop My Course App

angular.module('shopmycourse', [
  //'jrCrop',
  'ui.router',
  'toastr',
  'ngLodash',
  'angularMoment',
  'LocalForageModule',
  'shopmycourse.filters',
  'shopmycourse.controllers',
  'shopmycourse.routes',
  'shopmycourse.services',
  'shopmycourse.directives'
])

/*
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})*/

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('HTTPInterceptor');
})

/*
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text(' ').icon('icon-smc-back');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.swipeBackEnabled(false);
})*/

.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    maxOpened: 1
  });
})

.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.config({
      driver      : 'localStorageWrapper',
      name        : 'ShopMyCourse',
      version     : 1.0,
      storeName   : 'main',
      description : 'Main local database for ShopMyCourse mobile app'
    });
}])

.filter('replaceHttp', function () {
  return function (url) {
    if(url) {
      return url.replace(/http:/g, 'https:');
    }
  };
});
