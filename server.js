var express = require("express");

var PORT = process.env.PORT || 8080;

var app = express();
let db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// var routes = require("./controllers/burgerController.js");

// app.use(routes);

// Routes
// ===============================================================
require("./routes/user-api-routes.js")(app);

// Start our server so that it can begin listening to client requests.
// app.listen(PORT, function() {
//   // Log (server-side) when our server has started
//   console.log("Server listening on: http://localhost:" + PORT);
// });

// start server using sequelize
db.sequelize.sync().then(function(){
  app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT)
  });
});