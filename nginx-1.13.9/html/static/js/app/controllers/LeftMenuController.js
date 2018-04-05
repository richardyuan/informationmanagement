app.controller('LeftMenuController', function($scope) {
    $('#side-menu').metisMenu();
})
.directive('leftMenu', function() {
    return {
        templateUrl: 'tpl/menu.html'
    };
});