angular.module('shopmycourse.services')

/**
 * @name NotificationAPI
 * @function Service
 * @memberOf shopmycourse.services
 * @description Gestion des produits avec le serveur
*/

.service('ProductAPI', function (API, Configuration) {

    var resource = API(Configuration.apiEndpoint + 'products', {},
    {
      // Recherche d'un produit
      'search': { method: 'GET', url: Configuration.apiEndpoint + 'products', headers: { 'Authorization': 'Bearer' }, cache: false, isArray: true }
    });

    return resource;
});
