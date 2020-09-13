// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const { sequelize } = require("../models");

const { QueryTypes } = db.Sequelize;
// const records = await sequelize.query('select 1 as `foo.bar.baz`', {
//   nest: true,
//   type: QueryTypes.SELECT
// });
// console.log(JSON.stringify(records[0], null, 2));

//const sequelizeQuery = require('util').promisify(sequelize.query.bind(sequelize));

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        username: req.user.username
      });
    }
  });




  /// =========================== added from Jivko

  app.get("/api/mainlists", (req, res) => {

    db.MainList.findAll({}).then(function (dbMainList) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbMainList);
    });

  });
  app.get("/api/playlists", (req, res) => {

    db.MainList.findAll({}).then(function (dbMainList) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbMainList);
    });

  });

  //=====================================
  // GET route for getting all of the posts
  app.get("/api/posts", function (req, res) {
    // findAll returns all entries for a table when used with no options
    db.Post.findAll({}).then(function (dbPost) {
      // We have access to the posts as an argument inside of the callback function
      res.json(dbPost);
    });

  });

  app.get("/api/test", async function (req, res) {
    console.log("Got you")
    const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(artist) as `artists` FROM playlist_joe101 GROUP BY genre;", {
      nest: true,
      type: QueryTypes.SELECT,
      raw: true,
      plain: false
    });
    res.json(results);
  })

  // SELECT genre FROM playlist_joe101 GROUP BY genre

  // POST route for saving a new post
  app.post("/api/posts", function (req, res) {
    // create takes an argument of an object describing the item we want to insert
    // into our table. In this case we just we pass in an object with a text and
    // complete property
    db.Post.create({
      author: req.body.author,
      body: req.body.body
    }).then(function (dbPost) {
      // We have access to the new post as an argument inside of the callback function
      res.json(dbPost);
    }).catch(function (e) {
      res.json({ error: "error!" });
    });

  });




  // app.get("/html/test", (req, res) =>{
  //  db.User.findAll({}).then(function (data) {
  //       // We have access to the posts as an argument inside of the callback function
  //       // res.json(dbUser);
  //   // cat.all(function(data) {
  //     var hbsObject = {
  //       users: data[0].datavalues,
  //       layout: "ajax1"
  //     };
  //     console.log(hbsObject);

  //     res.render("test1", hbsObject);
  //   });
  // })
  app.get("/html/test", (req, res) => {
    db.User.findAll({}).then(function (data) {
      // We have access to the posts as an argument inside of the callback function
      // res.json(dbUser);
      // cat.all(function(data) {
      var hbsObject = {
        users: data[0],
        layout: "ajax1"
      };
      console.log(hbsObject);

      res.render("usertable", hbsObject);
    });
  });




  ///=======================================

 

};