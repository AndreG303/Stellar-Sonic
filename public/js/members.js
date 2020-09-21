//these variables need to be global so they  can be populated in other functions

var apiKeyC = "";
var currentUserUsername = "";
var currentUserPic = "";
var currentUserId = "";

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
    window.scrollTo(0, document.body.scrollHeight);
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
    // var iconSpan0=$('<span class=iconSpan>')
    //  var memberIcon0 =$('<img class="member-icon" id="memberIconJa0">');
    // memberIcon0.attr("src", data.profilePicture);
    $(".member-icon").attr("src", data.profilePicture);
    $(".member-icon").attr("width", "120");
    // memberIcon0.attr("width", "80");
    // iconSpan0.append(memberIcon0);
    // $("#member-name0").prepend(iconSpan0);
    username = data.username;
    userId = data.id;
    userBtn.text(username + "'s list");
    // this piggybacks on the same call and refreshes the variables to place the current user in 
    //the three arrays in d3userDyna.js that determine which users are getting bubble charts
    currentUserId.length = 0;
    currentUserId = userId;
    currentUserUsername = username;
    currentUserPic = data.profilePicture;
    prepareArrays(currentUserId, currentUserPic, currentUserUsername);
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
            row.append("<p> <img src='" + data[i].profilePicture + "' alt='member-icon' class='member-icon-for-chat'></img> [" + moment(data[i].createdAt, "YYYY-MM-DDTHH:mm:ss.SSSSZ").format("h:mma") + "] <span id= 'chatboxUsername' style = 'font-weight: bold;'>" + data[i].author + ":</span> " + data[i].body + "</p>");
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
      body: $("#post-box").val().trim(),
      profilePicture: currentUserPic
    };
    // Send an AJAX POST-request with jQuery
    $.post("/api/posts", newPost)
      // On success, run the following code
      .then(function () {
        var row = $("<div>");
        row.addClass("post");
        row.append("<p> <img src='" + newPost.profilePicture + "' alt='member-icon' class='member-icon-for-chat'></img> [" + moment(newPost.created_at).format("h:mma") + "] <span id='chatboxUsername' style = 'font-weight: bold;'>" + newPost.author + ":</span> " + newPost.body + "</p>");
        $("#post-area").append(row);
        chatScrollToBottom();
      });
    // Empty each input box by replacing the value with an empty string

    $("#author").val("");
    $("#post-box").val("");
  });
  //==================shazam API call - get the hints 
  const searchHints = function (evKey) {
    searchString = $("#input-title-ja").val();
    if ((searchString === 0) || (searchString.length < 6)) {
      $.get("/api/user_data2").then(api_key => {
        apiKeyC = api_key.apiKey;
      });

    }
    else if ((searchString.length === 6) || (searchString.length === 10) || (searchString.length === 14) || (searchString.length === 20)) {
      availableTags.length = 0;
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://shazam.p.rapidapi.com/auto-complete?locale=en-US&term=" + searchString,
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "shazam.p.rapidapi.com",
          "x-rapidapi-key": apiKeyC
        }
      }
      $.ajax(settings).done(function (response) {
        for (var i = 0; i < response.hints.length; i++) {
          let hints = response.hints[i].term;
          availableTags.push(hints);
        }
      });
    }
    // function to use the autocomplete hints received from the shazam API
    $(function () {
      $("#input-title-ja").autocomplete({
        source: availableTags
      });
    });
  }



  //function to populate user  playlist
  $(".btn-userBtn").on("click", function (event) {
    event.preventDefault();
    loadPlaylist(currentUserId)
  });

  function loadPlaylist(id) {
    $.get("/api/PlaylistsUsers/" + id, function (data) {
      console.log(data);
      if (data.length !== 0) {
        $(".user-list-ja").html("");
        for (var i = 0; i < data.length; i++) {
          var row = $('<li class"playlists">');
          row.addClass("playlists");
          let linkText = data[i].artist + " : " + data[i].title;
          let inListPlayButton = '<button type="button" class="inListPlayButton" data-value=' + data[i].youtubeVideo + ' >play</button>';
          let inListDeleteButton = '<button type="button" class="inListDeleteButton fa fa-trash"  data-value=' + data[i].id + '>x </button>';
          row.html(linkText + ":" + inListPlayButton + " : " + inListDeleteButton);
          $(".user-list-ja").prepend(row);
        }
      }
    });
  };

  // event listeners for user playlist mangement
  $(document).on("click", "button.inListDeleteButton", deleteInList);
  $(document).on("click", "button.inListPlayButton", inListPlay);


  function deleteInList(event) {
    event.stopPropagation();
    var id = $(this).data("value");
    console.log(id);

    $.ajax("/api/PlaylistsUsers/delete/" + id, {
      type: "DELETE"
    }).then(
      function () {
        console.log("title deleted", id);
        // Reload the page to get the updated list
        loadPlaylist();

      });
  };


  // functions to handle opening and closing of the chatbox
  // theaudioDB free api trigger and function
  $(".btn-searchSong").on("click", function (event) {
    event.preventDefault();
    const titleInput = $("input#input-title-ja");
    let title = titleInput.val().trim();
    songSearch1(title);
  });
  $("#input-title-ja").text("krokodil");
  $("#input-title-ja").keydown(function () {
    searchHints(event.key);
    $("#input-title-ja").css("background-color", "lightblue");
  });
  $("#input-title-ja").keyup(function () {
    $("#input-title-ja").css("background-color", "lavender");
  });


  // function for the second call of the shazam's  api to search for a particular song and get that song ID to use in the next function

  const songSearch1 = function (songString1) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://shazam.p.rapidapi.com/search?locale=en-US&offset=0&limit=5&term=" + songString1,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": apiKeyC
      }
    }
    $.ajax(settings).done(function (response) {
      let shazamSongId = response.tracks.hits[0].track.key
      checkSong2(shazamSongId);
    });
  };
  //here with the shazam ID the user can access all info on a given song
  const checkSong2 = function (shazamSongId) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://shazam.p.rapidapi.com/songs/get-details?locale=en-US&key=" + shazamSongId,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": apiKeyC
      }
    }
    $.ajax(settings).done(function (response) {
      // a switch needed here fo cases when the object does not have LyRICS  action or other actions and the action array is shorter


      // fixing the youtube link to be possible to embed
      let rawLink = response.sections[response.sections.length - 3].youtubeurl.actions[0].uri
      let re1 = /youtu.be/;  
      let newre1 = "www.youtube.com/embed";
      let re3 = /\?autoplay=1/;
      var fixedlink0 = rawLink.replace(re1, newre1);
      var fixedlink1 = fixedlink0.replace(re3, '');
      let newSong = {
        artist: response.subtitle,
        title: response.title,
        genre: response.genres.primary,
        year: response.sections[0].metadata[2].text,
        coverArt: response.sections[0].metapages[response.sections[0].metapages.length - 1].image,
        youtubeVideo: response.sections[response.sections.length - 3].youtubeurl.actions[0].uri,
        username: username,
        userId: userId,
        playableLink: fixedlink1
      }
      // create a card for the searched song with an option to add to the users playlist
      $("#search-music-area").html("");
      var row3 = $('<div id="show-search-div" class="search-results-card users">');
      var row3a = $('<div class="card-header"></div>');
      var row3b = $('<h4 class="result-box">searched title</h4>');
      var row3c = $('<div class="card-body" id="search-display1">');
      var row3d = $('<p> Artist: ' + newSong.artist + ' title:  ' + newSong.title + ' year:  ' + newSong.year + '</p>');
      var row3e = $('<p class="albumart"><img src=' + newSong.coverArt + ' alt= ' + newSong.title + ' width="120" height="120" /><iframe class="jvideo" width="160" height="120" src=' + newSong.playableLink + ' >g</iframe> </p>');
      var row3f = $('<a href=' + newSong.youtubeVideo + ' target="_blank" >youtube ' + newSong.title + '</a> ');
      var row3i = $('<button type="button" class="btn btn-shazamAdd" onkeyup="document.location.reload(true)">Add to playlist</button>');
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
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#memberName").offset().top
      }, 2000);
      $(".btn-shazamAdd").on("click", function (event) {
        event.preventDefault();
        $.ajax("/api/shazam-add", {
          type: "POST",
          data: newSong
        })
          .then(() => {
            location.reload(); // <-- refresh page
            console.log("added successfully");
          });
      });
    });
  }
  var realConsoleLog = console.log;
  console.log = function () {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'object') {
        var newLine = $('<li class="replConsole">')
        $(".console-ja").append(newLine);
        newLine.html(JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i] + '<br />');
        realConsoleLog.apply(console, arguments[i]);
      } else {
        var newLine = $('<li class="replConsole">')
        $(".console-ja").append(newLine);
        newLine.html(arguments[i] + '<br />');
        realConsoleLog.apply(console, arguments);
        return
      };

    }
  }
  $("#toggleConsoleBtn").change(function () {
    $(".console-ja").toggle();
  });

  $("#toggleUserListBtn").change(function () {
    $(".user-list-ja").toggle();
    loadPlaylist(currentUserId)
  });
});




// create a play card for a song to be  played from the users play list
function inListPlay(event) {
  event.stopPropagation();
  var youtube1 = $(this).data("value");
  console.log(  "youtube1: "+ youtube1);

let rawLink = youtube1
let re1 = /youtu.be/;  
let newre1 = "www.youtube.com/embed";
let re3 = /\?autoplay=1/;
var fixedlink0 = rawLink.replace(re1, newre1);
var fixedlink1 = fixedlink0.replace(re3, '');

// create a card for the searched song with an option to add to the users playlist
$("#search-music-area").html("");
var row3 = $('<div id="play-box-div" class="search-results-card users">');
var row3a = $('<div class="card-header"></div>');
var row3b = $('<h4 class="play-box">play-box</h4>');
var row3c = $('<div class="card-body" id="search-display1">');

var row3e = $('<p><iframe class="jvideo" width="580" height="360" src=' + fixedlink1+ '>g</iframe> </p>');

var row3k = $('<button type="button" class="btn btn-close-play-box" onkeyup="document.location.reload(true)">close</button>');
var row3g = $('</div>');
row3.append(row3a);
row3.append(row3b);
row3.append(row3c);
row3.append(row3e);
row3.append(row3e);

row3.append(row3g);
$("#search-music-area").prepend(row3);
$([document.documentElement, document.body]).animate({
  scrollTop: $("#memberName").offset().top
}, 2000);
}