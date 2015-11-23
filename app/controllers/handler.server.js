'use strict';

var Users = require('../models/users.js');

function Handler () {
	
	this.getBars = function (req, res) {
		var Yelp = require('yelp');
		
		var yelp = new Yelp({
		  consumer_key: process.env.YELP_CONSUMER_KEY,
		  consumer_secret: process.env.YELP_CONSUMER_SECRET,
		  token: process.env.YELP_TOKEN,
		  token_secret: process.env.YELP_TOKEN_SECRET,
		});
		
		yelp.search({ term: 'bars', location: req.params.city, limit: 10, offset: req.query.offset })
		.then(function (result) {
			res.json(result);
		})
		.catch(function (err) {
			console.error(err);
			res.json({total: 0, businesses: []});
		});		
	};
	
	this.addGoing = function (req, res) {
		
	}
	
	this.removeGoing = function (req, res) {
		
	}
}
module.exports = Handler;