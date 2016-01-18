var express    = require('express');
var bp         = require("body-parser");
var _          = require("underscore");
var db         = require("./db.js")
var bc         = require('bcryptjs');
var midWare    = require("./midWare.js")(db);
var app        = express();
var todos      = [];
var todoNextId = 1;
const PORT     = process.env.PORT || 3000;

app.use(bp.json());

app.get("/", function (req, res) {
	return res.send("Todo API Root");
});

// GET /todos
app.get("/todos", midWare.reqAuth, function (req, res) {
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
		where: where
	}).then(function(todos) {
		return res.json(todos)
	}, function(e) {
		return res.status(500).json(e);
	});
});

// GET /todos/:id
app.get("/todos/:id", midWare.reqAuth, function (req, res) {
	db.todo.findById(parseInt(req.params.id, 10)).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			return res.status(404).send();
		}
	}, function(e) {
		return res.status(500).json(e);
	});
});

app.post("/todos", midWare.reqAuth, function (req, res) {
	var body = _.pick(req.body, "description", "completed");
	body.description = body.description.trim();

	db.todo.create(body).then(function(todo) {
		return res.json(todo);
	}, function(e) {
		return res.status(400).json(e);
	});
});

app.delete("/todos/:id", midWare.reqAuth, function(req, res) {
	db.todo.destroy({
		where: {
			id: parseInt(req.params.id, 10)
		}
	}).then(function (affRows) {
		if (affRows) {
			return res.status(204).send();
		} else {
			return res.status(404).json({
				error: "No todo with that id."
			});
		}
	}, function (e) {
		return res.status(500).send();
	})
});

app.put("/todos/:id", midWare.reqAuth, function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body   = _.pick(req.body, "description", "completed");
	var atts   = {};

	if (body.hasOwnProperty("completed")) {
		atts.completed = body.completed;
	}
	if (body.hasOwnProperty("description")) {
		atts.description = body.description;
	}

	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			todo.update(atts).then(function (todo) {
				return res.json(todo.toJSON());
			}, function	(e) {
				return res.status(400).json(e);
			});
		} else {
			return res.status(404).send();
		}
	}, function (e) {
		return res.status(500).json(e);
	});
});

app.post("/users", function (req, res) {
	var body = _.pick(req.body, "email", "password");
	body.email = body.email.trim();

	db.user.create(body).then(function (user) {
		return res.json(user.toPublicJSON());
	}, function(e) {
		return res.status(400).json(e);
	});
});

app.post("/users/login", function (req, res) {
	var body = _.pick(req.body, "email", "password");

	db.user.auth(body).then(function (user) {
		var token = user.generateToken("auth");
		if(token) {
			return res.header("Auth", token).json(user.toPublicJSON());
		} else {
			return res.status(401).send();
		}
		
	}, function () {
		return res.status(401).send();
	});
});

db.seq.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log("Express server is running on port " + PORT + "...");
	});
});