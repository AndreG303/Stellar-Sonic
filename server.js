var express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const axios = require("axios");
// 

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
// var routes = require("./controllers/burgerController.js");

// app.use(routes);

// Routes
// ===============================================================
// require("./routes/user-api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

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

// "useQueryString":true     },"params":{
  let pTitle="yellow";
  let pSinger="coldplay";
  
   paramTitle ={"t":pTitle};
   paramSinger={"s": pSinger};
  
  
  //const axios = require("axios");
//  songSearch = function ( pTitle, pSinger) {
//   axios({
//     "method":"GET",
//     "url":"https://theaudiodb.p.rapidapi.com/searchtrack.php",
//     "headers":{
//     "content-type":"application/octet-stream",
//     "x-rapidapi-host":"theaudiodb.p.rapidapi.com",
//     "x-rapidapi-key":"847928476cmsheaaf2b6abd565d9p1758d2jsn129d9533941b",
//     "useQueryString":true
//     },"params":{
//       paramTitle,
//       paramSinger
//     }
//     })
//     .then((response)=>{

//       console.log(response)
//     })
//     .catch((error)=>{
//       console.log(error)
//     });
//   };