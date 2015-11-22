'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	id: String,
	displayName: String,
	photo: String,
    nbrClicks: {
        clicks: Number
    }
});

module.exports = mongoose.model('User', User);
