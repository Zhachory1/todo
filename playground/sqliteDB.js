var sequel = require('sequelize');
var seq = new sequel(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/bsd.sqlite'
});

var Todo = seq.define('todo', {
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

seq.sync().then(function() {
	console.log("Everything is synced.");

	Todo.findById(3).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log("Could not find todo!");
		}
	})

	// Todo.create({
	// 	description: "Take out the trash",
	// 	// completed:   false
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		description: "Clean office"
	// 	});
	// }).then(function () {
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%Office%'
	// 			}
	// 		}
	// 	})
	// }).then(function (todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo) {
	// 			console.log(todo.toJSON())
	// 		});
	// 	} else {
	// 		console.log("No todo found!");
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });
})