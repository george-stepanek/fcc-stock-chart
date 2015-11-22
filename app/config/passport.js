'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({ 'id': id }, { '_id': false }, function (err, user) {
			done(err, user);
		});
	});
	
	var authenticate = function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.id = profile.id;
					newUser.displayName = profile.displayName;
					newUser.photo = profile.photos[0].value;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}

	passport.use(new TwitterStrategy({
		consumerKey: process.env.TWITTER_KEY,
		consumerSecret: process.env.TWITTER_SECRET,
		callbackURL: process.env.APP_URL + 'auth/twitter/callback'
	},
	authenticate ));

	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_KEY,
		clientSecret: process.env.FACEBOOK_SECRET,
		callbackURL: process.env.APP_URL + 'auth/facebook/callback',
		profileFields: ['id', 'displayName', 'photos']
	},
	authenticate));
};
