angular.module('shopmycourse.controllers')

/**
 * @name DeliveriesScheduleCtrl
 * @function Controleur
 * @memberOf shopmycourse.controllers
 * @description Sélection des créneaux d'une ou plusieurs propositions de livraison
 */

.controller('DeliveriesScheduleCtrl', function($scope, $rootScope, LoadingModal, $state, CurrentUser, CurrentAvailability, AvailabilityAPI, CurrentDelivery, DeliveryStore, CurrentAddress, lodash, moment, DomRefresher) {

  window.s = $scope;
  /**
   * Génération des créneaux de livraison à partir de maintenant
   */
  $scope.schedule =  null;
  $scope.selected = {};
  $scope.date = '';
  var times = ['08h - 10h', '10h - 12h', '12h - 14h', '14h - 16h', '16h - 18h', '18h - 20h', '20h - 22h'];
  var now = moment();
  $scope.onSelect = function(date) {

    var day = moment(date).hours(0).minutes(0).seconds(0);
    var scheduleTimes = [];
    lodash.each(times, function(time) {
      var hours = time.replace('h', '').split('-');
      var start = parseInt(hours[0]);

      day.hours(start);
      if (day.unix() >= (now.unix() - (90 * 60))) {
        scheduleTimes.push(time);
      }
    });

    DomRefresher(function() {
      $scope.schedule = {
        date: date.toDate(),
        times: scheduleTimes
      };
    });

  }

  /*
  for (var i = 0; i < 7; i++) {
    var date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
    var day = moment(date).hours(0).minutes(0).seconds(0);
    var scheduleTimes = [];
    lodash.each(times, function(time) {
      var hours = time.replace('h', '').split('-');
      var start = parseInt(hours[0]);

      day.hours(start);
      if (day.unix() >= (now.unix() - (90 * 60))) {
        scheduleTimes.push(time);
      }
    });
    $scope.schedules.push({
      date: date,
      times: scheduleTimes
    });
  };*/

  /**
   * @name $scope.selectTime
   * @description Sélection d'un ou plusieurs créneaux
   */
  $scope.selectTime = function(date, time) {
    // Si la case est déjà selectionnées
    if ($scope.isSelected(date, time)) {
      var index = $scope.selected[date].indexOf(time);
      $scope.selected[date].splice(index, 1);
      if ($scope.selected[date].length == 0) {
        delete $scope.selected[date];
      }
      return;
    }
    // Si la case n'est pas selectionnées
    else {
      if (!$scope.selected[date] || $scope.selected[date].length <= 0) {
        $scope.selected[date] = []
      }
      $scope.selected[date].push(time);
    }
  };

  /**
   * @name $scope.isSelected
   * @description Vérifie si le créneau a déjà été sélectionné
   */
  $scope.isSelected = function(date, time) {
    if (!$scope.selected[date] || $scope.selected[date].length <= 0) {
      return false;
    }
    return ($scope.selected[date].indexOf(time) > -1);
  };

  /**
   * @name $scope.validate
   * @description Vérifie qu'au moins un créneau a été sélectionné avant enregistrement de ceux-ci
   */
  $scope.validate = function() {
    if (Object.keys($scope.selected).length > 0) {
      $ionicLoading.show({
        template: 'Nous enregistrons votre disponibilité...'
      });
      CurrentAvailability.setSchedules($scope.selected, function(currentAvailability) {
        AvailabilityAPI.create(currentAvailability, function() {
          console.log('Availabilities created !');
          $ionicLoading.hide();
        }, function(err) {
          console.log('Erreur');
          console.log(err);
          $ionicLoading.hide();
        });
        $scope.modalTitle = "Bravo !";
        $scope.modalMessage = "Votre proposition de livraison a été enregistrée. Vous serez notifié dés qu'une demande de livraison correspondra à vos critères.";
        $scope.modalImg = 'img/notifs/bravo.png';
        $scope.modalClose = function() {
          CurrentDelivery.clear(function() {
            $state.go('tabs.home');
            $scope.modal.hide();
          });
        }
        $ionicModal.fromTemplateUrl('default-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      });
    }
    else {
      $ionicPopup.alert({
        title: 'Sélection du créneau',
        template: 'Merci de sélectionner au moins un créneau !'
      });
    }
  };



  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.options = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.options.minDate = $scope.options.minDate ? null : new Date();
  };

  $scope.toggleMin();

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [{
    date: tomorrow,
    status: 'full'
  }, {
    date: afterTomorrow,
    status: 'partially'
  }];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

});
