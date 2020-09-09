var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");

const port = 3000; // Defining our port no for the app to run

// To render the index.html
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Establishing connection with the MySql server.
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "assignment",
});

// This will let us know if there were  any errors while connecting with the database
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("connected");
  }
});

// When this route is accessed, the queries will be executed, and the value is stored in a variable called 'rows'
// Rows is then returned a json object with a status of 200

app.get("/data", (req, res) => {
  connection.query(
    "Create or REPLACE VIEW v1 as SELECT MAX(Age) as Age, Ingroup from people where Age not in (SELECT MAX(Age) from people GROUP BY Ingroup ORDER BY Person) GROUP BY Ingroup UNION SELECT MAX(Age) as Age, Ingroup from people GROUP BY Ingroup;"
  );
  connection.query(
    "(select Person, v1.Age, v1.Ingroup from v1 left JOIN people as p on v1.Age = p.Age and v1.Ingroup = p.Ingroup) Order by Ingroup, Person;",
    function (error, rows, fields) {
      if (!!error) {
        res.status(500);
        res.json({ message: "Please try again later", error });
      } else {
        res.json(rows).status(200);
      }
    }
  );
});

// this renders the index.html file which is inside the public folder
app.get("/", (req, res) => {
  res.render("index.html");
  res.status(200);
});

app.listen(port, function () {
  console.log("\n Server is running on port " + port);
});

module.exports = app; // for testing
