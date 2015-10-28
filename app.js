(function(require, undefined){
"use strict";
// APM newrelic agent
require('newrelic');

var app = require('koa')();
var forceSSL = require('koa-force-ssl');
var spdy = require('spdy');
var fs = require('fs');
var compose = require('koa-compose');
var router = require('koa-router')();
var staticServer = require('koa-file-server')({ root: './build', maxage: '31536000000' });

var restAPI = composer(require('../httpChecker/app.js'));

// compose koa apps
function composer(app) {
  var middleware = (app.middleware)?app.middleware:app;
  return compose(middleware);
}

// Force SSL on all page
app.use(forceSSL('443', 'httpchecker.website'));

// add security header
app.use(function *(next) {
  this.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://static.woopra.com/js/ https://www.woopra.com/track/");
  this.set("X-Frame-Options", "DENY");
  this.set("X-Content-Type-Options", "nosniff");
  this.set("X-XSS-Protection", "1; mode=block");
  this.set("Strict-Transport-Security", "max-age=31536000; preload");
  yield* next;
});

// serve static resources
app.use(staticServer);

// map index.html to '/' to add server push if available
router.get('/', function *(next) {
  yield* this.fileServer.send('html/index.html');
});

// route for user actions
router.get('/api', function *(next) {
console.log(this.request, this.request.path); 
this.request.path='/';
  return yield restAPI.call(this, next);
});

// route for user actions
router.post('/api/check', function *(next) {
this.request.path='/check';
  return yield restAPI.call(this, next);
});

// route for user actions
router.get('/result', function *(next) {
  return yield* this.fileServer.send('html/result.html');
});

app.use(router.routes()).use(router.allowedMethods());

var fn = app.callback();
require('http').createServer(fn).listen(8080, function(err) {
  if (err) throw err;
  console.log('http server listening on port %s', this.address().port);
});

require('./certificate-chain.js').getCAs('/usr/share/ssl-cert/gandi-intermediate.crt', function(CAs){
  var sslOptions = {
    key: fs.readFileSync('/usr/share/ssl-cert/httpchecker.key'),
    cert: fs.readFileSync('/usr/share/ssl-cert/httpchecker.crt'),
    ca: CAs,
    requestCert: true
  }

  spdy.createServer(sslOptions, fn).listen(4443, function(err) {
    if (err) throw err;
    console.log('https server listening on port %s', this.address().port);
  });
});
})(require);
