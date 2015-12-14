'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
	code: String,
	when: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', Stock);
