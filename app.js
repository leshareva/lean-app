var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookie = require('cookie');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var mongoClient = require('mongodb').MongoClient;
var app = express();
var sharedsession = require("express-socket.io-session");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
mongoClient.connect('mongodb://localhost:27017/test', function(err, db){
  app.set('mongodb', db);
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'test',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  name: 'sid',
  store: new MongoStore({
    url: 'mongodb://localhost/test',
    touchAfter: 24 * 3600 // time period in seconds
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.post('/login', function (req, res) {
  req.app.get('mongodb').collection('accounts').findOne({'login':req.body.login}, function(err, user){
    if (user && user.password === req.body.password) req.session.save(function(err) {
      req.session.user = user;
      res.redirect('/');
    });
    else res.redirect('/');
  });
});
app.post('/register', function (req, res) {
  req.app.get('mongodb').collection('accounts').insertOne({'login':req.body.login, password: req.body.password}, function(err, user){
    if (user && user.password === req.body.password) req.session.save(function(err) {
      req.session.user = user;
      res.redirect('/');
    });
    else res.redirect('/');
  });
});
app.get('/logout', function(req, res) {
  if (req.session) {
    var id = req.sessionID;
    io.clients(function(err, clients){
      clients.forEach(function(cl){
        var socket = io.sockets.connected[cl];
        console.log(socket.handshake.sessionID);
        if (socket.handshake.sessionID === id){
          socket.emit('reload');
        }
      });
    });
    req.session.destroy();
    res.redirect('/');
  }
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



var debug = require('debug')('express-socket-session:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server);
io.use(sharedsession(session({
  secret: 'test',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  name: 'sid',
  store: new MongoStore({
    url: 'mongodb://localhost/test',
    touchAfter: 24 * 3600 // time period in seconds
  })
}), {
  autoSave: true
}));

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
io.on('connection', function (socket) {
  socket.on('test', function (t) {
    if (socket.handshake.session.user) {
      io.emit('test', socket.handshake.session);
    } else {
      socket.emit('news', 'not auth');
    }
  });
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
