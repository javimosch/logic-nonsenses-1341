angular.module('shopmycourse.services')

/**
 * @name CardAPI
 * @function Service
 * @memberOf shopmycourse.services
 * @description Gestion des portefeuilles avec le serveur
*/

.service('CardAPI', function (API, Configuration) {

    var resource = API(Configuration.apiEndpoint + 'wallets', { idUser: '@idUser' },
    {
      // Récupération d'un portefeuille correspondant à :idUser
      'get': { method: 'GET', url: Configuration.apiEndpoint + 'wallets/:idUser', headers: { 'Authorization': 'Bearer' }, cache: false },
      // Mise à jour d'un portefeuille correspondant à :idUser
      'update': { method: 'PUT', url: Configuration.apiEndpoint + 'wallets/:idUser', headers: { 'Authorization': 'Bearer' }, cache: false }
    });

    return resource;
});
