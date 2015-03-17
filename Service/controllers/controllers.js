var motel_schema = require('../models/motel_schemal');

var mongoose = require('mongoose');

var controllers = {
    index: function (req, res) {
        res.render('index', { title: 'Express' });
    }
};

module.exports = function (router) {
    router.get('/', controllers.index);
    return router;
};
