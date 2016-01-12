var express    = require('express');
var bp         = require("body-parser");
var _          = require("underscore");
var db         = require("./db.js")
var app        = express();
var todos      = [];
var todoNextId = 1;
const PORT     = process.env.PORT || 3000;

app.use(bp.json());

app.get("/", function(req, res) {
	res.send("Todo API Root");
});

// GET /todos
app.get("/todos", function(req, res) {
	var query = req.query;
	var where = {};
	if (query.hasOwnProperty("completed")) {
		where.completed = (query.completed === 'true');
	}
	if (query.hasOwnProperty("q") && query.q.length > 0) {
		where.description = {
			$like: "%" + query.q.toLowerCase() + "%"
		};
	}

	db.todo.findAll({
		where
	}).then(function(todos) {
		res.json(todos)
	}, function(e) {
		res.status(500).json(e);
	});
});

// GET /todos/:id
app.get("/todos/:id", function(req, res) {
	db.todo.findById(parseInt(req.params.id)).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).json(e);
	});
});

app.post("/todos", function(req, res) {
	var body = _.pick(req.body, "description", "completed");
	body.description = body.description.trim();

	db.todo.create(body).then(function(todo) {
		res.json(todo);
	}, function(e) {
		res.status(400).json(e);
	});
});

app.delete("/todos/:id", function(req, res) {
	var task = _.findWhere(todos, {
		id: parseInt(req.params.id)
	});
	if (typeof task === 'undefined') {
		res.status(404).send();
	} else {
		todos = _.without(todos, task);
		res.send("Task has been deleted");
	}
});

app.put("/todos/:id", function(req, res) {
	var body = _.pick(req.body, "task", "complete");
	var task = _.findWhere(todos, {
		id: parseInt(req.params.id)
	});
	var valid = {};

	if (typeof task === 'undefined') {
		return res.status(404).send();
	}

	if (body.hasOwnProperty("complete") && _.isBoolean(body.complete)) {
		valid.complete = body.complete;
	} else if (body.hasOwnProperty("complete")) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty("task") && _.isString(body.task) && body.task.length > 0) {
		valid.task = body.task.trim();
	} else if (body.hasOwnProperty("task")) {
		return res.status(400).send();
	}

	_.extendOwn(task, valid);

	res.json(task);
});

db.seq.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express server is running on port " + PORT + "...");
	});
});