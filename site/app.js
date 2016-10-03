(function (){

'use strict';


  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        list: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }


  NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.searchTerm = '';

        menu.narrowid = function(searchTerm) {
            MenuSearchService.getMatchedMenuItems(searchTerm)
                .then(function (response) {
                    menu.items = response;
                })
                .catch(function (error) {
                   console.log("Something went terribly wrong.");
                });
        };

        menu.removeItem = function(itemIndex) {
            menu.items.splice(itemIndex, 1);
        };
    }



  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
    service.getMatchedMenuItems = function(searchTerm) {
      return $http({method: "GET", url: ("https://davids-restaurant.herokuapp.com/menu_items.json")})
      .then(function(response){
        var theItems = response.data.menu_items;
        var foundItems = [];
        if (searchTerm==""){
          return foundItems;
        }
        for (var i = 0; i < theItems.length; i++) {
          var theDescription = theItems[i].description;
          if (theDescription.toLowerCase().indexOf(searchTerm) >=0) {
            foundItems.push(theItems[i]);
          }
        }
      return foundItems;
    })
    .catch(function (error) {
        console.log("oopsie doopsie with ajax call");
    });
  };
}


})();
