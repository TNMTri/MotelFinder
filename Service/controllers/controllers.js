var motel_schema = require('../models/motel_schemal');

var http = require('http');

var mongoose = require('mongoose');

var radius = 1;
var number = 1;

var init = true;

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

        //Đưa ví trí hiện tại vào đây:
//        my_location.lat = "";
//        my_location.long = "";

        //Lấy tất cả nhà trọ xung quanh, nếu database nhiều sẽ thay đổi thành lấy từng đoạn:
        if (init == true) {
            init = false;
            controllers.get_all_motel_array(req, res);

            setTimeout(function () {

                req.session.motel_array_all.forEach(function (motel) {

                    var circumference = 40075.6; //Chu vi trái đất tính từ xích đạo.
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
                    motel.distance = (distance * 1000).toFixed(5);
                });

                //Sắp xếp:
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

                console.log("Start app.");
                for (var i = motel_recent.length; i < req.session.motel_array_all.length; i++) {
                    if (motel_recent.length == number * 10) {
                        number++;
//                        res.send(motel_recent);
                        res.render('index', {motel_array: motel_recent});

                    } else {
                        if (req.session.motel_array_all[i].distance <= radius * 500) {
                            motel_recent.push(req.session.motel_array_all[i]);
                        } else {
                            radius++;
                            motel_recent.push(req.session.motel_array_all[i]);
                        }
                    }
                }
            });
        } else {
            res.send(motel_recent);
            res.render('index', {motel_array: motel_recent});
        }
    },

    get_more: function (req, res) {
        console.log("Đâm!");
        if (req.session.motel_array_all.length == motel_recent.length) {
            console.log("Hết rồi.");
            res.send(motel_recent);
        } else {
            for (var i = motel_recent.length - 1; i < req.session.motel_array_all.length; i++) {
                if (motel_recent.length == number * 10) {
                    number++;
                    res.send(motel_recent);
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
    },

    start_app: function (req, res) {
        controllers.get_all_motel_array(req, res);
        console.log("Start app...");
//        console.log(req.body.objectData);
        res.render("index");
    },

    get_more2: function (req, res) {
        console.log("get_more2 running");
        res.contentType('json');
        res.send({ text: 'some text' });
    }
};

module.exports = function (router) {

//    router.get('/', controllers.index); //Vừa vào thì chạy cái này.
//    router.get('/get_more/', controllers.get_more);
    router.get('/start_app/', controllers.start_app);
    router.get('/get_more2/', controllers.get_more2);

    return router;
};