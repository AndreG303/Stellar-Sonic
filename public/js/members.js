// const axios = require("axios");
// var userPopulate = require("../js/d3userDyna");

$(document).ready(() => {
  var availableTags = [];
  //global variables
  var userBtn = $(".btn-userBtn");
  let username; // globally keeps track of the current user that is logged in
  let userId; // globally keeps track of the current user's id in users that is logged in
  let username1 = username;
  var searchString = "";

  const openForm = function (event) {
    event.preventDefault();
    $("#popupChatBox").attr("style", "display:block");
    $("#chatBtn").attr("style", "display:none");
    chatScrollToBottom();
  }
  const closeForm = function (event) {
    event.preventDefault();
    $("#popupChatBox").attr("style", "display:none");
    $("#chatBtn").attr("style", "display:block");
  }

  //global functions
  function chatScrollToBottom() {
    const chatbox = document.getElementById("post-area");
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  chatScrollToBottom();
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page

  //api functions
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.username);
    $(".member-icon").attr("src", data.profilePicture);
    $(".member-icon").attr("width", "120");

    
    
    
    username = data.username;
    userId = data.id;
    
    console.log("1st get at members.js");
    console.log(username);
    userBtn.text(username + "'s list");

  }).then



  setInterval(function (moment, chatScrollToBottom) {
    $.get("/api/posts", function (data) {
      var lastChatLength = window.__lastChatLength;
      if (typeof lastChatLength === 'undefined') {
        lastChatLength = -1;
      }
      if (lastChatLength !== data.length) {
        if (data.length !== 0) {
          $("#post-area").html('');
          for (var i = 0; i < data.length; i++) {
            var row = $("<div>");
            row.addClass("post");
            // moment('01/12/2016', 'DD/MM/YYYY', true).format()
            // console.log(data[i].createdAt);
            row.append("<p> [" + moment(data[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSSZ").format("h:mma") + "] <span id= 'chatboxUsername' style = 'font-weight: bold;'>" + data[i].author + ":</span> " + data[i].body + "</p>");
            $("#post-area").append(row);
          }
        }


        chatScrollToBottom();
      }
      window.__lastChatLength = data.length;
      // userPopulate(userArray);
    });
  }, 2000, moment, chatScrollToBottom);

  $("#chatBtn").on("click", openForm);
  $("#closeChatBtn").on("click", closeForm);

  $("#post-submit").on("click", function (event) {
    event.preventDefault();

    var newPost = {
      author: username,
      body: $("#post-box").val().trim()
    };
    console.log(newPost);
    // Send an AJAX POST-request with jQuery
    $.post("/api/posts", newPost)
      // On success, run the following code
      .then(function () {
        var row = $("<div>");
        row.addClass("post");
        row.append("<p> [" + moment(newPost.created_at).format("h:mma") + "] <span id='chatboxUsername' style = 'font-weight: bold;'>" + newPost.author + ":</span> " + newPost.body + "</p>");
        $("#post-area").append(row);
        chatScrollToBottom();
      });

    // Empty each input box by replacing the value with an empty string
    $("#author").val("");
    $("#post-box").val("");

    // scrollToBottom();

  });

  //==================shazam API call - get the hints 
  const searchHints = function (evKey) {
    searchString = $("#input-title-ja").val();

    if ((searchString === 0) || (searchString.length < 6)) {

      // searchString = searchString += evKey;
      console.log(evKey);
      console.log(searchString);
      console.log("no call , string is too short");


    }
    else if ((searchString.length === 6) || (searchString.length === 10) || (searchString.length === 14) || (searchString.length === 20)) {
      // searchString = searchString += evKey;
      console.log(evKey);
      console.log(searchString);
      // console.log($("#input-title-ja").val());
      console.log("doing the call");
      availableTags.length = 0;


      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://shazam.p.rapidapi.com/auto-complete?locale=en-US&term=" + searchString,
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "shazam.p.rapidapi.com",
          "x-rapidapi-key": "6f4c62189fmshacee60036d76b2cp101a45jsn8679c155c21e"
        }
      }

      $.ajax(settings).done(function (response) {

        console.log(response);
        for (var i = 0; i < response.hints.length; i++) {
          let hints = response.hints[i].term;
          availableTags.push(hints);

        }
        console.log(availableTags);
      });
    }

    $(function () {

      $("#input-title-ja").autocomplete({
        source: availableTags
      });
    });
  }





  // all music api get==============================

  //onClick functions
  $(".btn-allMusic").on("click", function (event) {
    event.preventDefault();
    $.get("/api/mainlists", function (data) {
      if (data.length !== 0) {
        for (var i = 0; i < data.length; i++) {
          var row = $("<div>");
          row.addClass("mainlists");
          row.append("<p>" + data[i].artist + " release: " + data[i].release + " genre: " + data[i].genre + " title:" + data[i].title + " year" + data[i].year + '</p><p><button type="button" class="btn btn-addSong">Add to playlist</button></p>');
          $("#main-music-area").prepend(row);
        }
      }
    });
  });

  $(".btn-userBtn").on("click", function (event) {
    event.preventDefault();
    $.get("/api/playlists", function (data) {
      if (data.length !== 0) {
        for (var i = 0; i < data.length; i++) {
          var row = $("<div>");
          row.addClass("playlists");
          row.append("<p>" + data[i].artist + " release: " + data[i].release + "genre: " + data[i].genre + "title:" + data[i].title + " year" + data[i].year + "</p>");
          $("#user-music-area").prepend(row);
        }
      }
    });
  });

  // functions to handle opening and closing of the chatbox


  // theaudioDB free api trigger and function
  $(".btn-searchSong").on("click", function (event) {
    event.preventDefault();
    const titleInput = $("input#input-title-ja");
    let title = titleInput.val().trim();
    console.log(title);
    songSearch1(title);

  });


  //===========================add song trigger
  $(function () {
    $(".btn-addSong").on("click", function (event) {

      var artist = $(this.data[i].artist) + " release: " + data[i].release + " genre: " + data[i].genre + " title:" + data[i].title + " year" + data[i].year


      var id = $(this).data("id");
      var newSleep = $(this).data("newsleep");

      var newSleepState = {
        sleepy: newSleep
      };

      // Send the PUT request.
      $.ajax("/api/cats/" + id, {
        type: "PUT",
        data: newSleepState
      }).then(
        function () {
          console.log("changed sleep to", newSleep);
          // Reload the page to get the updated list
          location.reload();
        }
      );
    });

    $(".create-form").on("submit", function (event) {
      // Make sure to preventDefault on a submit event.
      event.preventDefault();

      var newCat = {
        name: $("#ca").val().trim(),
        sleepy: parseInt($("[name=sleepy]:checked").val().trim())
      };

      // Send the POST request.
      $.ajax("/api/cats", {
        type: "POST",
        data: newCat
      })
        .then(() => {
          location.reload(); // <-- refresh page
        })

      // $.ajax("/api/cats", {
      //   type: "POST",
      //   data: newCat
      // }).then(
      //   function() {
      //     console.log("created new cat");
      //     // Reload the page to get the updated list
      //     location.reload();
      //   }
      // );
    });
  });

  //===========================


  $("#input-title-ja").text("krokodil");

  $("#input-title-ja").keydown(function () {
    searchHints(event.key);

    $("#input-title-ja").css("background-color", "lightblue");
  });
  $("#input-title-ja").keyup(function () {
    $("#input-title-ja").css("background-color", "lavender");
  });

  // $("#input-title-ja").click    (function () {
  //   $("#input-title-ja").text()  = "";
  // });





  const songSearch1 = function (songString1) {

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://shazam.p.rapidapi.com/search?locale=en-US&offset=0&limit=5&term=" + songString1,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": "6f4c62189fmshacee60036d76b2cp101a45jsn8679c155c21e"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      let shazamSongId = response.tracks.hits[0].track.key
      checkSong2(shazamSongId);

    });

  };


  const checkSong2 = function (shazamSongId) {

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://shazam.p.rapidapi.com/songs/get-details?locale=en-US&key=" + shazamSongId,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": "6f4c62189fmshacee60036d76b2cp101a45jsn8679c155c21e"
      }
    }


    $.ajax(settings).done(function (response) {
      console.log("song details-final");
      console.log(response);
      // switch needed here

let rawLink =response.sections[response.sections.length - 3].youtubeurl.actions[0].uri
console.log(rawLink);
//  var string = 'GeeksForGeeks'; 

let re1= /youtu.be/;
console.log(re1);
let newre1="www.youtube.com/embed";
let re3=/\?autoplay=1/;
var fixedlink0 = rawLink.replace(re1, newre1);  
console.log(fixedlink0);
var fixedlink1 = fixedlink0.replace(re3, '');  

console.log(fixedlink1);
console.log("fixedlink1");



      let newSong = {
        artist: response.subtitle,
        title: response.title,
        genre: response.genres.primary,
        year: response.sections[0].metadata[2].text,
        coverArt: response.sections[0].metapages[response.sections[0].metapages.length - 1].image,
        youtubeVideo: response.sections[response.sections.length - 3].youtubeurl.actions[0].uri,
        username: username,
        userId: userId,
        playableLink:fixedlink1 

      }

      // create a card for the searched song with an option to add to the users playlist
      $("#search-music-area").html("");
      var row3 = $('<div id="show-search-div" class="search-results-card users">');
      var row3a = $('<div class="card-header"></div>');
      var row3b = $('<h4 class="result-box">searched title</h4>');
      var row3c = $('<div class="card-body" id="search-display1">');
      var row3d = $('<p> Artist: ' + newSong.artist + ' title:  ' + newSong.title + ' year:  ' + newSong.year + '</p>');
      var row3e = $('<p><img src=' + newSong.coverArt + ' alt= ' + newSong.title + ' width="120" height="120" /><iframe width="160" height="120" src='+ newSong.playableLink +' >g</iframe> </p>');
      var row3f = $('<a href=' + newSong.youtubeVideo + ' target="_blank" >youtube ' + newSong.title + '</a> ');
      var row3i = $('<button type="button" class="btn btn-shazamAdd" onkeyup="document.location.reload(true)">Add to playlist</button>');
//       <iframe width="420" height="315"
// src="https://www.youtube.com/embed/tgbNymZ7vqY">
// </iframe>
      // var row3e =$(newSong.title);
     // https://www.youtube.com/watch?v=AY9blLYMKnI
     //https://www.youtube.com/watch?v=AY9blLYMKnI
     //'+newSong.youtubeVideo +'

      var row3g = $('</div>');

      row3.append(row3a);
      row3.append(row3b);
      row3.append(row3c);
      row3c.append(row3d);
      row3.append(row3e);
      row3c.append(row3f);
      row3c.append(row3i);

      row3.append(row3g);


      $("#search-music-area").prepend(row3);



      $(".btn-shazamAdd").on("click", function (event) {
        event.preventDefault();
        console.log("newSong for the post call");
        console.log(newSong);

        $.ajax("/api/shazam-add", {
          type: "POST",
          data: newSong

        })
          .then(() => {
            // location.reload(); // <-- refresh page
            console.log("added successfully");
          });

      });





    });

  }

  var realConsoleLog = console.log;
  console.log = function () {
    // var message = [].join.call(arguments, " ");
    for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'object') {
      var newLine = $('<li class="replConsole">')
      $("#log").append(newLine);
      newLine.html(JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]+ '<br />');
      realConsoleLog.apply(console, arguments[i]);

      // logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
    } else {
      // logger.innerHTML += arguments  + '<br />';

      var newLine = $('<li class="replConsole">')
      $("#log").append(newLine);
      newLine.html(arguments[i] + '<br />');
      realConsoleLog.apply(console, arguments);
      return
     
    };
  }
    // console.log(username1);
  }
  });