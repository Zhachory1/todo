var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;
var todos = [
	{
		id: 1,
		task: "Shower, you stink",
		complete: false
	},{
		id: 2,
		task: "Complete the todo app",
		complete: false
	},{
		id: 3,
		task: "New task I need to do",
		complete: true
	}
]

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

app.listen(PORT, function () {
	console.log("Express server is running on port " + PORT + "...");
});