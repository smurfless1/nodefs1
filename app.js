let express = require('express');

// Set up the app object
let app = express();

// configure the app in a separate function
require('./appsetup')(app);

//let http = require('http').Server(app);
let api = require('./api/api');
app.use('/', api);

module.exports = app;
