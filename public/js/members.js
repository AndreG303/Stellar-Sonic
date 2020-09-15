// var express = require("express");
//let username; // globally keeps track of the current user that is logged in\
// songSearch = require("../../server");
// const axios = require("axios");



$(document).ready(() => {
  var availableTags = [];
  //global variables
  var userBtn = $(".btn-userBtn");
  let username; // globally keeps track of the current user that is logged in
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
    console.log("1st get at members.js");
    username = data.username;
    userBtn.text(username + "'s list");

  });



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
            row.addClass("chirp");
            // moment('01/12/2016', 'DD/MM/YYYY', true).format()
            console.log(data[i].createdAt);
            row.append("<p> [" + moment(data[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSSZ").format("h:mma") + "] <span id= 'chatboxUsername' style = 'font-weight: bold;'>" + data[i].author + ":</span> " + data[i].body + "</p>");
            $("#post-area").append(row);
          }
        }


        chatScrollToBottom();
      }
      window.__lastChatLength = data.length;
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


    // $.get("/api/mainlists", function (data) {
    //   if (data.length !== 0) {
    //     for (var i = 0; i < data.length; i++) {
    //       var row = $("<div>");
    //       row.addClass("mainlists");
    //       row.append("<p>" + data[i].artist + " release: " + data[i].release + "genre: " + data[i].genre + "title:" + data[i].title + " year" + data[i].year + "</p>");
    //       $("#main-music-area").prepend(row);
    //     }
    //   }
    // });
  });

  // const songSearch = function (title, singer) {

  // var settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "https://theaudiodb.p.rapidapi.com/searchtrack.php?t=" + title + "&s=" + singer + "",
  //   "method": "GET",
  //   "headers": {
  //     "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
  //     "x-rapidapi-key": "6f4c62189fmshacee60036d76b2cp101a45jsn8679c155c21e"
  //   }
  // }

  //   $.ajax(settings).done(function (response) {
  //     console.log(response);
  //     var row = $("<div>");
  //     row.addClass("search-results");
  //     row.append("<p>" + response.track[0].strDescriptionEN + "</p>");
  //     $("#search-music-area").prepend(row);

  //     var row = $("<div>");
  //     row.addClass("search-results");
  //     row.append("<a href=" + response.track[0].strMusicVid + ">" + response.track[0].strMusicVid + "</a>");
  //     $("#search-music-area").append(row);
  //   });
  // };






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
      // let newSong = {
      //   artist: response.artists.hits[0].artist.name,
      //   song:response.tracks.hits[0].track.title,
      //   genre:response.artists.hits[0].artist.name,
      //   year:response.artists.hits[0].artist.name,
      //   userID: username,
      //   coverArt:
      //   youtubeVideo:



      // }
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

      let newSong = {
        artist: response.subtitle,
        title: response.title,
        genre: response.genres.primary,
        year: response.sections[0].metadata[2].text,
        // userID: username,
        coverArt: response.sections[0].metapages[1].image,
        youtubeVideo: response.sections[2].youtubeurl.actions[0].uri

      }
      console.log(newSong);
      // creating a box for the newfound song
      var row3 = $("<div class='search-results-card users'>");
      var row3a =$('<div class="card-header"></div>');
      var row3b =$('<h2 class="result-box">searched title</h2></div>');
      var row3c =$('<div class="card-body" id="search-display1">');
      var row3d =$("<p> Artist: " + newSong.artist+" title:  " +newSong.title +" year:  "+ newSong.year+"</p>");
      var row3e =$("<a href=" + newSong.coverArt+ ">" +newSong.coverArt+ "</a>");
      var row3f =$("<a href=" + newSong.youtubeVideo+ ">" +newSong.youtubeVideo+ "</a>");
      // var row3e =$(newSong.title);

      var row3g =$('</div></div>');
    
      row3.append(row3a);
      row3a.append(row3b);
      row3b.append(row3c);
      row3c.append(row3d);
      row3d.append(row3e);
      row3e.append(row3f);
      row3f.append(row3g);
      
      
      $("#search-music-area").prepend(row3);

      // var row2 = $("<div>");
      // row2.addClass("search-results card users");
      // row2.append("<a href=" + response.track[0].strMusicVid + ">" + response.track[0].strMusicVid + "</a>");
      // $("#search-music-area").append(row);


      //      <div class="card search-result-card users"> xxxxx
      // <div class="card-header">xxxxxx
      // <h2 class="member-name1">Chris123 Playlist</h2>xxxxxxxxxxxxxx
      // </div>
      // <div class="card-body" id="musicdata2"></div>
      // </div>




      // create a card for the searched song with an option to add to the users playlist

    });

  };

});