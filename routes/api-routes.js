// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const { sequelize } = require("../models");
require('dotenv').config();
console.log("CLAUDINARY", process.env.CLAUDINARY_CLOUDNAME);
console.log("CLAUDINARY", process.env.CLAUDINARY_PRESET);
const { QueryTypes } = db.Sequelize;
// const records = await sequelize.query('select 1 as `foo.bar.baz`', {
  //   nest: true,
  //   type: QueryTypes.SELECT
  // });
  // console.log(JSON.stringify(records[0], null, 2));
  
  //const sequelizeQuery = require('util').promisify(sequelize.query.bind(sequelize));
  
  module.exports = function (app) {;
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
        username: req.user.username,
        profilePicture: req.user.profilePicture,
        cloudUploadName: process.env.CLAUDINARY_CLOUDNAME,
        cloudUploadPreset: process.env.CLAUDINARY_PRESET
      });
    }
  });



  app.get("/api/user_data1", (req, res) => {
    db.User.findAll({}).then(function (dbMainList) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbMainList);
    });



  });


  // var replacement1= require("../public/js/d3userDyna")
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
  app.get("/api/posts", function (req, res) {
    var query = {};
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
    }
    db.Post.findAll({
      where: query
    }).then(function (dbPost) {
      res.json(dbPost);
    });
  });



  app.get("/api/testU1", async function (req, res) {
    const results = await sequelize.query('SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(title) as `title`, GROUP_CONCAT(artist) as `artist` FROM PlaylistsUsers WHERE UserId = $replacement1 GROUP BY genre', {
      bind: {replacement1 : req.query.replacement1},
      nest: true,
      type: QueryTypes.SELECT,
      raw: true,
      plain: false

      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea

      

    }).then(data => {
        console.log(data);
        res.json(data);

      })
      .catch(err => {
        res.json({ err });

      });
  });
////////==================================to uncomment once api dynamic ready

// // SELECT genre FROM playlist_users GROUP BY genre
// app.get("/api/testU/:id", async function (req, res) {
//   console.log("Got you");
//   console.log(req.params.id);

//   const results = await sequelize.query('SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(title) as `title`, GROUP_CONCAT(artist) as `artist` FROM PlaylistsUsers WHERE UserId = ' + req.params.id + ' GROUP BY genre', {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// });
// // SELECT genre FROM playlist_users GROUP BY genre
// app.get("/api/test0", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(title) as `title`, GROUP_CONCAT(artist) as `artist` FROM PlaylistsUsers WHERE UserId = 1 GROUP BY genre", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// });



// app.get("/api/test", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(song) as `songs`, GROUP_CONCAT(artist) as `artists` FROM playlist_joe101 GROUP BY genre;", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// })

// app.get("/api/test1", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(song) as `songs`, GROUP_CONCAT(artist) as `artists` FROM playlist_andrewdalba GROUP BY genre;", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// })

// app.get("/api/test2", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(song) as `songs`, GROUP_CONCAT(artist) as `artists` FROM playlist_chris123 GROUP BY genre;", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// })

// app.get("/api/test3", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(song) as `songs`, GROUP_CONCAT(artist) as `artists` FROM playlist_slash GROUP BY genre;", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// })

// app.get("/api/test4", async function (req, res) {
//   console.log("Got you")
//   const results = await sequelize.query("SELECT genre, COUNT(*) as `number`,GROUP_CONCAT(song) as `songs`, GROUP_CONCAT(artist) as `artists` FROM playlist_blondie202 GROUP BY genre;", {
//     nest: true,
//     type: QueryTypes.SELECT,
//     raw: true,
//     plain: false
//   });
//   res.json(results);
//   console.log(results);
// })
///========================  temporary commented








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

// "/api/shazam-add"
app.post("/api/shazam-add", function (req, res) {
  // create takes an argument of an object describing the item we want to insert
  // into our table. In this case we just we pass in an object with a text and
  // complete property
  db.PlaylistsUsers.create({
    artist: req.body.artist,
    coverArt: req.body.coverArt,
    genre: req.body.genre,
    title: req.body.title,
    year: req.body.year,
    youtubeVideo: req.body.youtubeVideo,
    username: req.body.username,
    UserId: req.body.userId
  }).then(function (dbPlaylistsUsers) {
    // We have access to the new post as an argument inside of the callback function
    res.json(dbPlaylistsUsers);
    console.log(PlaylistsUsers);
  }).catch(function (e) {
    res.json({ error: "error!" });
  });

});


app.get("/html/test", (req, res) => {
  db.User.findAll({}).then(function (data) {
    // We have access to the posts as an argument inside of the callback function
    // res.json(dbUser);
    // cat.all(function(data) {
    // console.log(data);
    var hbsObject = {
      users: data,
      layout: "ajax1"

    };
    for (i = 0; i < data.length; i++) {
      let userId = data[i].dataValues.id;
      let userUsername = data[i].dataValues.username;
      let userEmail = data[i].dataValues.email;
      // console.log("userJa");
      // console.log(userId, userUsername, userEmail);

    }
    // console.log("hbsObject");
    // console.log(hbsObject);

    res.render("usertable", hbsObject);
  });
});




///=======================================
// route for uploading a picture
app.put("/api/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  }
  else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    const id = req.user.id;
    db.User.update({
      profilePicture: req.body.profilePicture
    },
      {
        where: {
          id: id
        }
      })
      .then(data => {
        res.json(data);

      })
      .catch(err => {
        res.json({ err });

      });
  }
});
  // db.User.update({
  //   profilePicture: "TEST,TEST",
  // },
  //   {
  //     where: {
  //       id: 1
  //     }
  //   }
  // );


  //   db.User.update({
  //     profilePicture: "TEST,TEST"
  //   },
  //     {
  //       where: {
  //         id: 1
  //       }
  //     }
  // });




}
