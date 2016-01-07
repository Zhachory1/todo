var express = require('express');
var bp = require("body-parser");

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
	for(var i = 0; i < todos.length; i++) {
		if(req.params.id == todos[i].id) {
			res.json(todos[i]);
		}
	}
	res.status(404).send();
});

app.post("/todos", function (req, res) {
	var body = req.body;
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function () {
	console.log("Express server is running on port " + PORT + "...");
});