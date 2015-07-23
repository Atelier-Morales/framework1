
/* global angular */

/**
 * Basic directives for content display
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    app.directive('sidebar', function() {
            
            return {
                restrict: 'E',
                templateUrl: 'templates/footer.html'
            }
    });
})();