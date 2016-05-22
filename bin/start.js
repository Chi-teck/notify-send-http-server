#!/usr/bin/env node

var http = require('http');
var spawn = require('child_process').spawn;
var url = require('url');
var opts = require('optimist').argv;

var server = http.createServer(function (request, response) {
  var urlParsed = url.parse(request.url, true);

  if (urlParsed.pathname != '/') {
    response.statusCode = 404;
    response.end();
  }
  else if (!urlParsed.query.body) {
    response.statusCode = 500;
    response.end();
  }
  else {
    var parameters = [];
    if (urlParsed.query.urgency) {
      parameters.push('--urgency=' + urlParsed.query.urgency);
    }
    if (urlParsed.query.summary) {
      parameters.push(urlParsed.query.summary);
    }
    parameters.push(urlParsed.query.body);
    spawn('notify-send', parameters);
    response.end('sent');
  }

});

var port = opts.p || 1337;
var host = opts.h || 'localhost';

server.listen(port, host, function () {
  console.log('Listening on http://%s:%s', host, port);
});

server.on('error', function (error) {
  console.error('Error:', error.code);
});

