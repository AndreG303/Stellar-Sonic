// var express = require("express");
//let username; // globally keeps track of the current user that is logged in\
// songSearch = require("../../server");
// const axios = require("axios");



$(document).ready(() => {
  //global variables
  var userBtn = $(".btn-userBtn");
  let username; // globally keeps track of the current user that is logged in

  const openForm = function(event) {
    event.preventDefault();
    $("#popupChatBox").attr("style", "display:block");
    $("#chatBtn").attr("style", "display:none");
    chatScrollToBottom();
  }
  const closeForm = function(event) {
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

  // When the page loads, grab and display all of the current  posts
  $.get("/api/posts", function (data) {
    if (data.length !== 0) {
      $("#post-area").html('');
      for (var i = 0; i < data.length; i++) {
        var row = $("<div>");
        row.addClass("chirp");
        row.append("<p> [" + moment(data[i].created_at).format("h:mma") + "] <span id= 'chatboxUsername' style = 'font-weight: bold;'>" + data[i].author + ":</span> " + data[i].body + "</p>");
        $("#post-area").append(row);
      }
    }
    
  });

  // setInterval(function(moment, chatScrollToBottom){
  //   $.get("/api/posts", function (data) {
  //     if (data.length !== 0) {
  //       $("#post-area").html('');
  //       for (var i = 0; i < data.length; i++) {
  //         var row = $("<div>");
  //         row.addClass("chirp");
  //         row.append("<p>" + data[i].author + " posted: " + data[i].body + "  " + moment(data[i].created_at).format("h:mma on dddd") + "</p>");
  //         $("#post-area").append(row);
  //       }
  //     }
  //     chatScrollToBottom();
  //   });
  // }, 2000, moment, chatScrollToBottom);

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

  //==================shazam API call - will not be used
  // var searchString = "a kiss the driver era";
  // var settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "https://shazam.p.rapidapi.com/auto-complete?locale=en-US&term=" + searchString,
  //   "method": "GET",
  //   "headers": {
  //     "x-rapidapi-host": "shazam.p.rapidapi.com",
  //     "x-rapidapi-key": "847928476cmsheaaf2b6abd565d9p1758d2jsn129d9533941b"
  //   }
  // }

  // $.ajax(settings).done(function (response) {
  //   console.log(response);
  // });

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
    const titleInput = $("input#input-title");
    const singerInput = $("input#input-artist");

    let title = titleInput.val().trim();
    let singer = singerInput.val().trim();

    console.log(title);
    console.log(singer);

    songSearch(title, singer);


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

  const songSearch = function (title, singer) {

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://theaudiodb.p.rapidapi.com/searchtrack.php?t=" + title + "&s=" + singer + "",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": "847928476cmsheaaf2b6abd565d9p1758d2jsn129d9533941b"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      var row = $("<div>");
      row.addClass("search-results");
      row.append("<p>" + response.track[0].strDescriptionEN + "</p>");
      $("#search-music-area").prepend(row);

      var row = $("<div>");
      row.addClass("search-results");
      row.append("<a href=" + response.track[0].strMusicVid + ">" + response.track[0].strMusicVid + "</a>");
      $("#search-music-area").append(row);
    });
  };






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







});