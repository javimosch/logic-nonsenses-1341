angular.module('shopmycourse.services')

/**
 * @name DeliveryRequestAPI
 * @function Service
 * @memberOf shopmycourse.services
 * @description Gestion des demandes de livraison avec le serveur
*/

.service('DeliveryRequestAPI', function (API, Configuration) {

    var resource = API(Configuration.apiEndpoint + 'delivery_requests', { idDeliveryRequest: '@idDeliveryRequest' },
    {
        // Création d'une demande de livraison
        'create': { method: 'POST', url: Configuration.apiEndpoint + 'delivery_requests', headers: { 'Authorization': 'Bearer' }, cache: false },
        // Annulation d'une demande de livraison correspondant à :idDeliveryRequest
        'cancel': { method: 'POST', url: Configuration.apiEndpoint + 'delivery_requests/:idDeliveryRequest/cancel', headers: { 'Authorization': 'Bearer' }, cache: false }
    });

    return resource;
});
