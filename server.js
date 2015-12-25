'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGOLAB_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
	
var io;
var refreshAll = function (req, res, next) { io.emit('event'); return next(); };
routes(app, refreshAll);

var port = process.env.PORT || 8080;
var server = app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
io = require('socket.io').listen(server);
