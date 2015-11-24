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
		.then(function (bars) {
			Users.find({}).exec(function (err, users) { 
				if (err) { throw err; }
				for (var i = 0; i < bars.businesses.length; i++) {
					bars.businesses[i]["going"] = users.filter(function (value) {
						return value.goingTo == bars.businesses[i].id;
					}).length;
				}
				res.json(bars); 
			});
		})
		.catch(function (err) {
			console.error(err);
			res.json({total: 0, businesses: []});
		});		
	};
	
	this.addGoing = function (req, res) {
		Users.findOneAndUpdate({ 'id': req.user.id }, { 'goingTo': req.query.goingto })
			.exec(function (err, result) { if (err) { throw err; } res.json(result); });
	}
}
module.exports = Handler;