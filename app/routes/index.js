'use strict';

var path = process.cwd();
var Handler = require(path + '/app/controllers/handler.server.js');

module.exports = function (app, refreshAll) {

	app.route('/').get(function (req, res) { res.sendFile(path + '/public/index.html');	});
	
	var handler = new Handler();			
	app.route('/api/stocks/')
		.get(handler.getStocks);
		
	app.route('/api/stock/:code')
		.post(refreshAll, handler.addStock)
		.delete(refreshAll, handler.deleteStock);
};
