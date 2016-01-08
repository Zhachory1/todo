var express = require('express');
var bp = require("body-parser");
var _ = require("underscore");

var app = express();
var todos = [];
var todoNextId = 1;

const PORT = process.env.PORT || 3000;

app.use(bp.json());

app.get("/", function (req, res) {
	res.send("Todo API Root");
});

// GET /todos
app.get("/todos", function (req, res) { 
	var query = req.query;
	var filtTodo = todos;
	if(query.hasOwnProperty("completed") && query.completed == 'true') {
		filtTodo = _.where(filtTodo, {complete: true});
	} else if (query.hasOwnProperty("completed") && query.completed == 'false') {
		filtTodo = _.where(filtTodo, {complete: false});
	}

	if(query.hasOwnProperty("q") && query.q > 0) {
		filtTodo = _.filter(filtTodo, function (obj) {
			return obj.task.toLowerCase().indexOf(query.q.toLowerCase()) > -1;
		});
	}
	res.json(filtTodo);
});

// GET /todos/:id
app.get("/todos/:id", function (req, res) {
	var task = _.findWhere(todos, {id: parseInt(req.params.id)});
	if(typeof task === 'undefined') {
		res.status(404).send();
	} else {
		res.json(task);
	}
});

app.post("/todos", function (req, res) {
	var body = _.pick(req.body, "task", "complete");
	body.task = body.task.trim();

	if(_.isString(body.task) && _.isBoolean(body.complete) && body.task.length > 0) {
		body.id = todoNextId++;
		todos.push(body);
		res.json(body);
	} else {
		res.status(400).send();
	}
});

app.delete("/todos/:id", function (req, res) {
	var task = _.findWhere(todos, {id: parseInt(req.params.id)});
	if(typeof task === 'undefined') {
		res.status(404).send();
	} else {
		todos = _.without(todos, task);
		res.send("Task has been deleted");
	}
});

app.put("/todos/:id", function (req, res) {
	var body = _.pick(req.body, "task", "complete");
	var task = _.findWhere(todos, {id: parseInt(req.params.id)});
	var valid = {};

	if(typeof task === 'undefined') {
		return res.status(404).send();
	}

	if(body.hasOwnProperty("complete") && _.isBoolean(body.complete)) {
		valid.complete = body.complete;
	} else if (body.hasOwnProperty("complete")) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty("task") && _.isString(body.task) &&  body.task.length > 0) {
		valid.task = body.task.trim();
	} else if (body.hasOwnProperty("task")) {
		return res.status(400).send();
	}

	_.extendOwn(task, valid);

	res.json(task);
});

app.listen(PORT, function () {
	console.log("Express server is running on port " + PORT + "...");
});