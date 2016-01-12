var db     = {};
var env    = process.env.NODE_ENV || 'development';
var Seq = require('sequelize');
var seq;

if(env === 'production') {
	seq = new Seq(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	seq = new Seq(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-API.sqlite'
	});
}

db.todo        = seq.import(__dirname + "/models/todo.js");
db.seq         = seq;
db.Seq         = Seq;
module.exports = db;