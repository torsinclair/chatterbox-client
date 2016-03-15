//YOUR CODE HERE:

// var message = {
//   username: 'tor',
//   text: 'testing',
//   roomname: '4chan'
// };

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

  $('body').on('click', '.glyphicon', function(e) {
    $(this).toggleClass('like');
  });



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
  var tabName = room.replace(/ /g, '-');
  var newDiv = $('<div class="tab-pane" id="' + tabName + '"></div>');
  var newTab = $('<li><a href="#' + tabName + '" data-toggle="tab">' + room + '<span></span></a></li>');

  $('.tab-content').append(newDiv);
  $('.nav').append(newTab);

  var savedMessages = [];

  var url = 'https://api.parse.com/1/classes/messages';
  if (!(tabName === undefined || tabName === 'lobby')) {
    var formatting = '?where={"roomname":"' + room + '"}';
    url += encodeURI(formatting);
  }

  var refreshMessages = function() {
    var isFirstCall = savedMessages.length === 0;
    // debugger;

    $.get(url, function(response) {
      var receivedMessages = response.results;
      for (var i = receivedMessages.length - 1; i >= 0; i--) {
        var message = receivedMessages[i];
        var messageId = message.objectId;
        if (savedMessages.indexOf(messageId) === -1) {
          addChat(message, newDiv);

          numMessages = newTab.find('span').text();
          if (numMessages.length === 0) {
            numMessages = 1;
          } else {
            numMessages = parseInt(numMessages) + 1;
          }
          if (!isFirstCall){
            newTab.find('span').text((' ' + numMessages));
          }

          savedMessages.push(messageId);
        }
      };
    });

    // debugger;
    // if (isFirstCall) newTab.find('span').text('');
  };

  newTab.click(function() {
    newTab.find('span').text('');
  });

  setInterval(refreshMessages, 1000);
};

var addChat = function(message, location) {
  addRoom(message);

  // make a h4 and add the username to it
  var username = $('<a href="#"></a>');
  username.text(message.username);

  // add content
  var content = $('<p></p>');  
  content.text(message.text);

  // find time of message
  var time = $('<time></time>');
  var newMoment = new moment(message.createdAt);
  time.text(newMoment.fromNow());

  // add an icon to message
  var heart = $('<span class="glyphicon glyphicon-heart"></span>');

  // make a div for the chat and add the above to it
  var chat = $('<div class="chat"></div>');
  chat.append(username);
  chat.append(time);
  chat.append(content);
  chat.append(heart);
  // attach div to the dom
  chat.prependTo(location);   
};
