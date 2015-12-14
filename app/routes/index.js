'use strict';

var path = process.cwd();
var Handler = require(path + '/app/controllers/handler.server.js');

module.exports = function (app) {
    
	app.route('/').get(function (req, res) { res.sendFile(path + '/public/index.html');	});
	
	var handler = new Handler();			
	app.route('/api/stocks/')
		.get(handler.getStocks);
		
	app.route('/api/stock/:code')
		.post(handler.addStock)
		.delete(handler.deleteStock);
};
