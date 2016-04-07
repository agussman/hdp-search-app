var express = require("express");
var PythonShell = require("python-shell");

var app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.static("public"));
app.use(express.static("node_modules"));

app.get("/", function(request, response) {
	response.sendFile(__dirname + "/views/index.html");
});

app.get("/api", function(request, response) {

	var file = request.query.file ? request.query.file : "1603.09723.pdf";
	var shell = new PythonShell("hdp.py", { mode: "json", args: [file] });
	
	shell.on("message", function (message) {
	  response.json(message);
	});
});

app.listen(app.get("port"), function() {
	console.log("server is running...");
});