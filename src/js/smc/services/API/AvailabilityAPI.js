angular.module('shopmycourse.services')

/**
 * @name AvailabilityAPI
 * @function Service
 * @memberOf shopmycourse.services
 * @description Gestion des disponibilités avec le serveur
 */

.service('AvailabilityAPI', function(API, Configuration,lodash) {
  var self = {};
  Configuration.ready().then(function() {
    var resource = API(Configuration.apiEndpoint + 'availabilities', {
      idAvailability: '@idAvailability'
    }, {
      // Création d'une disponibilité
      'create': {
        method: 'POST',
        url: Configuration.apiEndpoint + 'availabilities',
        headers: {
          'Authorization': 'Bearer'
        },
        cache: false
      },
      // Récupération des disponibilités
      'get': {
        method: 'GET',
        url: Configuration.apiEndpoint + 'availabilities',
        headers: {
          'Authorization': 'Bearer'
        },
        cache: false,
        isArray: true
      },
      // Suppression d'une disponibilité correspondant à :idAvailability
      'delete': {
        method: 'DELETE',
        url: Configuration.apiEndpoint + 'availabilities/:idAvailability',
        headers: {
          'Authorization': 'Bearer'
        },
        cache: false
      },
      // Annulation d'une disponibilité correspondant à :idAvailability
      'cancel': {
        method: 'POST',
        url: Configuration.apiEndpoint + 'availabilities/:idAvailability/cancel',
        headers: {
          'Authorization': 'Bearer'
        },
        cache: false
      }
    });
    lodash.extend(self, resource);
  });
  return self;
});
