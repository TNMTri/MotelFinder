var motel_schema = require('../models/motel_schemal');

var http = require('http');

var mongoose = require('mongoose');

var radius = 1;
var number = 1;
var my_location = {
    lat: 10.767013,
    long: 106.690455
};

var motel_recent = [];

var controllers = {

    get_all_motel_array: function (req) {
        var motel_query = motel_schema.motel.find({});
        motel_query.exec(function (motel_error, motel_array) {
            if (motel_array && motel_array.length > 0) {
                req.session.motel_array_all = motel_array;
            } else {
                console.log(motel_array);
            }
        });
    },

    index: function (req, res) {

        //Get all:
        controllers.get_all_motel_array(req, res);

        setTimeout(function () {

            req.session.motel_array_all.forEach(function (motel) {

                var circumference = 40075.6; // Earth's circumference at the equator in km
                var distance = 0.0;

                //Calculate radians
                var latitude1Rad = my_location.lat * Math.PI / 180.0;
                var longitude1Rad = my_location.long * Math.PI / 180.0;
                var latitude2Rad = motel.address.latitude * Math.PI / 180.0;
                var longitude2Rad = motel.address.longitude * Math.PI / 180.0;

                var longitudeDiff = Math.abs(longitude1Rad - longitude2Rad);

                if (longitudeDiff > Math.PI) {
                    longitudeDiff = 2.0 * Math.PI - longitudeDiff;
                }

                var angleCalculation = Math.acos(Math.sin(latitude2Rad) * Math.sin(latitude1Rad) + Math.cos(latitude2Rad) * Math.cos(latitude1Rad) * Math.cos(longitudeDiff));

                distance = circumference * angleCalculation / (2.0 * Math.PI);
                motel.distance = (distance * 1000).toFixed(2);
            });

            //sort
            setTimeout(function () {
                for (i = 0; i < req.session.motel_array_all.length; i++) {
//                    console.log(req.session.motel_array_all[i].distance);
                    for (j = i + 1; j < req.session.motel_array_all.length; j++) {
//                        console.log(req.session.motel_array_all[i].distance + " vs " + req.session.motel_array_all[j].distance);
                        if ((req.session.motel_array_all[i].distance - req.session.motel_array_all[j].distance) > 0) {
                            var temporary = req.session.motel_array_all[i];
                            req.session.motel_array_all[i] = req.session.motel_array_all[j];
                            req.session.motel_array_all[j] = temporary;
                        }
                    }
                }
            });
            setTimeout(function () {
//                res.render('index', { title: req.session.motel_array_all});
                controllers.get_more(req, res);
            }, 1000)

        });
    },

    get_more: function (req, res) {

        if (req.session.motel_array_all.length == motel_recent.length) {

            res.render('index', {title: motel_recent, notification: "Không còn nhà trọ nào cả."});

        } else {

            for (i = motel_recent.length; i < req.session.motel_array_all.length; i++) {

//                console.log(motel_recent.length);

                if (motel_recent.length == number * 10) {
//                    console.log(number);
                    number++;
                    res.render('index', {title: motel_recent});

                } else {

                    if (req.session.motel_array_all[i].distance <= radius * 500) {

                        motel_recent.push(req.session.motel_array_all[i]);

                    } else {

                        radius++;
                        motel_recent.push(req.session.motel_array_all[i]);

                    }
                }
            }

        }

    }
};

module.exports = function (router) {

    router.get('/', controllers.index);
    router.get('/get_more', controllers.get_more);

    return router;
};