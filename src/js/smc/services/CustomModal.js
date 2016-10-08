angular.module('shopmycourse.services')

/**
 * @name CustomModal
 * @function Service
 * @memberOf shopmycourse.services
 * @description Custom modal for custom templates.
 */

.factory('CustomModal', function($window, $uibModal, $log,$modal,$q) {

    function create(templateUrl, scopeParam,showOnStartup) {
        var deferred = $q.defer()
        $log.debug('CustomModal: create from '+templateUrl);
        
        var overwriteScope = null;
        
        var modal = $modal({
            //scope: scope,
            templateUrl: templateUrl,
            show: showOnStartup || false,
            controller: function($scope) {
                
                overwriteScope = function(object){
                    for(var prop in object){
                        $scope[prop] =  object[prop];
                    }
                }
                
                overwriteScope(scopeParam);
                
                $scope.resolveModal = function(result){
                    $scope.$hide();
                    deferred.resolve(result);
                }
            }
        });
        return {
            show:function(customScope){
                deferred = $q.defer()
                modal.show();
                if(customScope) overwriteScope(customScope);
                return deferred.promise;
            },
            hide:function(){
                modal.hide();
            }
        };
    }

    return create;
});
