var db     = {};
var sequel = require('sequelize');
var seq    = new sequel(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-API.sqlite'
});

db.todo        = seq.import(__dirname + "/models/todo.js");
db.seq         = seq;
db.sequel      = sequel;
module.exports = db;