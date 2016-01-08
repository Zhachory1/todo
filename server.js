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
	res.json(todos);
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

	if(_.isString(body.task) && _.isBoolean(body.complete) && body.task.trim().length > 0) {
		body.id = todoNextId++;
		todos.push(body);
		res.json(body);
	} else {
		res.status(400).send();
	}
});

app.listen(PORT, function () {
	console.log("Express server is running on port " + PORT + "...");
});