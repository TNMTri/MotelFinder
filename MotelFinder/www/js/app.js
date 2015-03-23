// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'uiGmapgoogle-maps', 'ngMaterial', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })


    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading) {


        //$scope.centerOnMe = function () {
                $ionicLoading.show({
                    template: 'Loading...'
                });
        //    $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
        //        .then(function (position) {
        //            $scope.map = {
        //                center: {
        //                    latitude: position.coords.latitude,
        //                    longitude: position.coords.longitude
        //                },
        //                zoom: 12
        //            };
        //            $scope.options = {scrollwheel: true};
        //            $scope.marker = {
        //                id: 0,
        //                coords: {
        //                    latitude: position.coords.latitude,
        //                    longitude: position.coords.longitude
        //                },
        //                options: {draggable: true},
        //                zoom:12
        //
        //            };
        //            //$ionicLoading.hide();
        //        }, function (err) {
        //            // error
        //        });
        //    $ionicLoading.hide();
        //};

        //var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
            .then(function (position) {
                $scope.map = {
                    center: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    zoom: 14
                };
                $scope.options = {scrollwheel: true};
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude

                    },
                    options: {draggable: true},
                    zoom:14,
                    message : "Lat:"+position.coords.latitude+"-Long:"+ position.coords.longitude


                };
                $scope.markerlist=[
                    {
                       coords:{
                           latitude: 10,
                           longitude: 106
                       }
                    },
                    {
                        coords:{
                            latitude: 11,
                            longitude: 106
                        }
                    }
                    //{
                    //    latitude: position.coords.latitude+3,
                    //    longitude: position.coords.longitude
                    //},
                    //{
                    //    latitude: position.coords.latitude +4,
                    //    longitude: position.coords.longitude
                    //},
                    //{
                    //    latitude: position.coords.latitude +5,
                    //    longitude: position.coords.longitude
                    //}
                ];

                $ionicLoading.hide();
            }, function (err) {
                // error
            });


        //}
    });

