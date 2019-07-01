var express = require('express');
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const corsOptions = {
  origin: (origin, cb) => {
    cb(null, true)
  }
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers setup
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/rider', require('./routes/rider'));
app.use('/ride', require('./routes/ride'));
app.use('/driver', require('./routes/driver'));
/*
app.use('/admin', require('./routes/admin'));
app.use('/fare', require('./routes/fare'));
app.use('/ridesHistory', require('./routes/ridesHistory'));
app.use('/reset', require('./routes/reset'));
app.use('/credits', require('./routes/credits'));
app.use('/promoCode', require('./routes/promoCode'));
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
