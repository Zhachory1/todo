var sequel = require('sequelize');
var seq = new sequel(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/bsd.sqlite'
});

var todo = seq.define('todo', {
	description: {
		type: sequel.STRING,
		allowNull: false,
		validate: {
			len: [1, 256]
		}
	},
	completed: {
		type: sequel.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var user = seq.define('user', {
	email: sequel.STRING
});

todo.belongsTo(user);
user.hasMany(todo);

seq.sync().then(function() {
	console.log("Everything is synced.");

	user.findById(1).then(function (user) {
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			})
		})
	});

	// user.create({
	// 	email: "zhachory@example.com"
	// }).then(function () {
	// 	return todo.create({
	// 		description: 'Clean yard'
	// 	});
	// }).then(function (todo) {
	// 	user.findById(1).then(function (user) {
	// 		user.addTodo(todo);
	// 	});
	// });
});