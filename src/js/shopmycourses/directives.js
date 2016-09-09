angular.module('shopmycourse.directives', [])

.directive('includeReplace', function() {
    return {
        require: 'ngInclude',
        restrict: 'A',
        link: function(scope, el, attrs) {
            el.html(el.children().html()); // My changes in the line
        }
    };
})

.directive('blankDirective', [function() {

}]);
