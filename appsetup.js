let express = require('express');
let path = require('path');
let morgan = require('morgan');
let bodyparser = require('body-parser');

/**
 * This configures the global use statements.
 * It may be mostly aesthetic. I'm fine with that.
 * @param app the app to configure
 */
module.exports = function(app) {
    app.use(morgan('dev'));
    //app.use(express.json());
    //app.use(express.urlencoded({ extended: false }));
    app.use(bodyparser.urlencoded({extended: true}));
    app.use(bodyparser.json());
    //app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
};
