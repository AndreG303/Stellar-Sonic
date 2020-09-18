var express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const axios = require("axios");
var PORT = process.env.PORT || 8080;
var app = express();
let db = require("./models");
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Import routes and give the server access to them.
// Routes
// ===============================================================
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
// Start our server so that it can begin listening to client requests.
// start server using sequelize
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)
  });
});
let pTitle = "yellow";
let pSinger = "coldplay";
paramTitle = { "t": pTitle };
paramSinger = { "s": pSinger };