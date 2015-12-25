var Stocks = require('../models/stocks.js');

function Handler () {

	this.getStocks = function(req, res) {
		Stocks.find({ })/*.sort({ 'when': 'desc'})*/.exec(function (err, result) { if (err) { throw err; } res.json(result); });			
	};
	
	this.addStock = function(req, res) {
		Stocks.create(new Stocks({ code: req.params.code }), function (err, result) { if (err) { throw err; } res.json(result); });
	};
	
	this.deleteStock = function(req, res) {
	    Stocks.findOneAndRemove({ 'code': req.params.code }, function (err, result) { if (err) { throw err; } res.json(result); });
	};
}
module.exports = Handler;