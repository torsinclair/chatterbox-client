//YOUR CODE HERE:

// var message = {
//   username: 'tor',
//   text: 'testing',
//   roomname: '4chan'
// };

// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'https://api.parse.com/1/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });

var messages;
var lastId;
var room;
var appendedRooms = ['lobby'];
var friends = [];

setInterval(function() {
  var isLogging = lastId ? false : true;

  var url = 'https://api.parse.com/1/classes/messages';
  if (!(room === undefined || room === 'lobby')) {
    var formatting = '?where={"roomname":"' + room + '"}';
    url += encodeURI(formatting);
  }

  $.get(url, function(response, status) {
    messages = response.results;
    console.log(status);

    for (var i = messages.length - 1; i >= 0; i--) {
      var message = messages[i];
      if (!isLogging) {
        if (message.objectId === lastId) {
          isLogging = true;
        }
        continue;
      } 

      if (!(room === undefined || room === 'lobby') && (message.roomname !== room)) continue;

      addChat(message, $('#current'));   
    }

    refreshFriends();
    lastId = messages[0].objectId;
  });
}, 1000);

$(document).ready(function() {
  $('#new-message').submit(function(e) {
    e.preventDefault();

    var userName = $('#username').val();
    var text = $('#text').val();

    var message = {
      username: userName,
      text: text,
      roomname: $('#room').val()
    };

    $.post('https://api.parse.com/1/classes/messages', JSON.stringify(message), function() {
      console.log('Send succeeded');
    });

    // $.ajax({
    //   // This is the url you should use to communicate with the parse API server.
    //   url: 'https://api.parse.com/1/classes/messages',
    //   type: 'POST',
    //   data: JSON.stringify(message),
    //   contentType: 'application/json',
    //   success: function (data) {
    //     console.log('chatterbox: Message sent');
    //   },
    //   error: function (data) {
    //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //     console.error('chatterbox: Failed to send message', data);
    //   }
    // });
    
  });

  $('#room').change(function() {
    lastId = undefined;
    room = $(this).val();
    $('#current .chat').remove();
  });

  $('body').on('click', 'a', function(e) {
    e.preventDefault();
    var friend = $(this).text();

    if (friends.indexOf(friend) === -1) {
      friends.push(friend);
      refreshFriends();
    }
  });

  $('.make-tab').click(makeTab);
});

var addRoom = function(message) {
  var roomName = message.roomname;


  if (appendedRooms.indexOf(roomName) === -1) {
    appendedRooms.push(roomName);

    var roomNode = $('<option value="' + roomName + '"></option>');
    roomNode.text(roomName);
    $('#room').append(roomNode);
  }

};

var refreshFriends = function(){
  $('.chat').each(function(){
    var friend = $(this).find('a').text();

    if (friends.indexOf(friend) > -1) {
      $(this).find('a').addClass('friend');
      $(this).find('p').addClass('friend');
    }
  });
};

var makeTab = function() {
  if (room === undefined || room === 'lobby') return;

  var tabName = room;
  var newDiv = $('<div class="tab-pane" id="' + tabName + '"></div>');
  var newTab = $('<li><a href="#' + tabName + '" data-toggle="tab">' + tabName + '</a></li>');

  $('.tab-content').append(newDiv);
  $('.nav').append(newTab);

  var savedMessages = [];

  var url = 'https://api.parse.com/1/classes/messages';
  if (!(tabName === undefined || tabName === 'lobby')) {
    var formatting = '?where={"roomname":"' + tabName + '"}';
    url += encodeURI(formatting);
  }

  var refreshMessages = function() {
    $.get(url, function(response) {
      var receivedMessages = response.results;
      _.each(receivedMessages, function(message) {
        var messageId = message.objectId;
        if (savedMessages.indexOf(messageId) === -1) {
          addChat(message, newDiv);
          savedMessages.push(messageId);
        }
      });
    });
  };

  setInterval(refreshMessages, 1000);
};

var addChat = function(message, location) {
  addRoom(message);
  var content = $('<p></p>');
  content.text(message.text);
  // make a h4 and add the username to it
  var username = $('<a href="#"></a>');
  username.text(message.username);
  // make a div for the chat and add the above to it
  var chat = $('<div class="chat"></div>');
  chat.append(username);
  chat.append(content);
  // attach div to the dom
  chat.prependTo(location);   
};

// var message = {
//   username: 'tor',
//   text: 'testing',
//   roomname: '4chan'
// };
// var test;
// $.get('https://api.parse.com/1/classes/messages', function(response, status) {
//   test = response;
// }