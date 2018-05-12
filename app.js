let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyparser = require('body-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let filesRouter = require('./routes/files');
let usersRouter = require('./routes/users');

let app = express();
let http = require('http').Server(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/files', filesRouter);
app.use('/users', usersRouter);

module.exports = app;
