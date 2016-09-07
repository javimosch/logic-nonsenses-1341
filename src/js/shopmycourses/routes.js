angular.module('shopmycourse.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tabs', {
    url: '/tabs',
    templateUrl: window._STATIC + 'templates/TabBar.html',
    abstract: true,
    resolve: {
      currentUser: function (CurrentUser) {
        var promise = CurrentUser.init(function() {});
        return promise;
      },
      currentDelivery: function (CurrentDelivery) {
        var promise = CurrentDelivery.init(function() {});
        return promise;
      }
    }
  })

  .state('tabs.home', {
    url: '/home',
    cache: false,
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tabs.deliveries', {
    url: '/deliveries',
    cache: false,
    views: {
      'deliveries-tab': {
        templateUrl: window._STATIC + 'templates/Deliveries/List.html',
        controller: 'DeliveriesListCtrl'
      }
    }
  })

  .state('tabs.shopdelivery', {
    url: '/delivery/create/shop',
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Deliveries/Shop.html',
        controller: 'DeliveriesShopCtrl'
      }
    }
  })

  .state('tabs.scheduledelivery', {
    url: '/delivery/create/schedule',
    cache: false,
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Deliveries/Schedule.html',
        controller: 'DeliveriesScheduleCtrl'
      }
    }
  })

  .state('tabs.confirmdelivery', {
    url: '/delivery/create/confirm',
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Deliveries/Confirm.html',
        controller: 'DeliveriesConfirmCtrl'
      }
    }
  })

  .state('tabs.delivery', {
    url: '/delivery/:idDelivery',
    cache: false,
    views: {
      'deliveries-tab': {
        templateUrl: window._STATIC + 'templates/Deliveries/Show.html',
        controller: 'DeliveriesShowCtrl'
      }
    }
  })

  .state('tabs.orders', {
    url: '/orders',
    cache: false,
    views: {
      'orders-tab': {
        templateUrl: window._STATIC + 'templates/Orders/List.html',
        controller: 'OrdersListCtrl'
      }
    }
  })

  .state('tabs.order', {
    url: '/order/:idOrder',
    cache: false,
    views: {
      'orders-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Show.html',
        controller: 'OrdersShowCtrl'
      }
    }
  })

  .state('tabs.orderpayment', {
    url: '/order/:idOrder/payment',
    cache: false,
    views: {
      'orders-tab': {
        templateUrl: window._STATIC + 'templates/Profile/EditCreditCard.html',
        controller: 'ProfileEditCreditCardCtrl'
      }
    }
  })


  .state('tabs.sendOrder', {
    url: '/order/:idOrder/send',
    views: {
      'orders-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Send.html',
        controller: 'OrdersSendCtrl'
      }
    }
  })

  .state('tabs.ordercontent', {
    url: '/order/:idOrder/content',
    cache: false,
    views: {
      'orders-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Content.html',
        controller: 'OrdersContentCtrl'
      }
    },
    resolve: {
      currentCart: function (CurrentCart) {
        var promise = CurrentCart.init();
        return promise;
      }
    }
  })

  .state('tabs.profile', {
    url: '/profile',
    cache: false,
    views: {
      'profile-tab': {
        templateUrl: window._STATIC + 'templates/Profile/Show.html',
        controller: 'ProfileShowCtrl'
      }
    }
  })

  .state('tabs.editprofile', {
    url: '/profile/edit',
    views: {
      'profile-tab': {
        templateUrl: window._STATIC + 'templates/Profile/Edit.html',
        controller: 'ProfileEditCtrl'
      }
    }
  })

  .state('tabs.editcreditcard', {
    url: '/profile/creditcard/edit',
    views: {
      'profile-tab': {
        templateUrl: window._STATIC + 'templates/Profile/EditCreditCard.html',
        controller: 'ProfileEditCreditCardCtrl'
      }
    }
  })

  .state('tabs.editaddress', {
    url: '/profile/address/edit',
    views: {
      'profile-tab': {
        templateUrl: window._STATIC + 'templates/Profile/EditAddress.html',
        controller: 'ProfileEditAddressCtrl'
      }
    }
  })

  .state('start', {
    url: '/start',
    templateUrl: window._STATIC + 'templates/Start.html',
    controller: 'StartCtrl',
    resolve: {
      CurrentUserLoading: function (CurrentUser) {
        var promise = CurrentUser.init(function() {});
        return promise;
      }
    }
  })

  .state('signin', {
    url: '/profile/signin',
    templateUrl: window._STATIC + 'templates/Profile/SignIn.html',
    controller: 'ProfileSignInCtrl'
  })

  .state('signup', {
    url: '/profile/signup',
    templateUrl: window._STATIC + 'templates/Profile/SignUp.html',
    controller: 'ProfileSignUpCtrl'
  })

  .state('tabs.scheduleorder', {
    url: '/order/create/schedule',
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Schedule.html',
        controller: 'OrdersScheduleCtrl'
      }
    }
  })

  .state('tabs.addressorder', {
    url: '/order/create/address',
    cache: false,
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Address.html',
        controller: 'OrdersAddressCtrl'
      }
    }
  })

  .state('tabs.shoporder', {
    url: '/order/create/shop',
    cache: false,
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Shop.html',
        controller: 'OrdersShopCtrl'
      }
    }
  })

  .state('tabs.confirmorder', {
    url: '/order/create/confirm',
    views: {
      'home-tab': {
        templateUrl: window._STATIC + 'templates/Orders/Confirm.html',
        controller: 'OrdersConfirmCvtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/start')

});
