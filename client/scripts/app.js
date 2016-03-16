//YOUR CODE HERE:

// var message = {
//   username: 'tor',
//   text: 'testing',
//   roomname: '4chan'
// };

var messages = [];
var lastId;
var room;
var appendedRooms = ['lobby'];
var friends = [];
var followed = [];
var followedMessages = [];

/* update current tab */
setInterval(function() {
  var url = 'https://api.parse.com/1/classes/messages';
  if (!(room === undefined || room === 'lobby')) {
    var formatting = '?where={"roomname":"' + room + '"}';
    url += encodeURI(formatting);
    // debugger;
  }

  refreshMessages(messages, url, $('#current'));

  refreshFriends();
}, 1000);

/* update followers tab */
setInterval(function() {
  var url = 'https://api.parse.com/1/classes/messages';
  // debugger;
  var formatting = '?where={"username": {"$in": ' + JSON.stringify(followed) + '}}&order=-createdAt';
  url += encodeURI(formatting);
  console.log(url);
  // debugger;
  refreshMessages(followedMessages, url, $('#followed'));

  refreshFriends();
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

  $('body').on('click', 'a.friend', function(e) {
    e.preventDefault();
    var friend = $(this).text();

    if (friends.indexOf(friend) === -1) {
      friends.push(friend);
      refreshFriends();
    }
  });

  $('body').on('click', 'a.follow', function(e){
    e.preventDefault();
    var user = $(this).parent().find('a.friend').text();
    followed.push(user);
    followedMessages = [];
    $('#followed div').remove();
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

  newTab.click(function() {
    newTab.find('span').text('');
  });

  setInterval(refreshMessages.bind(null, savedMessages, url, newDiv, newTab), 1000);
};

var addChat = function(message, location) {
  addRoom(message);

  // make a h4 and add the username to it
  var username = $('<a href="#" class="friend"></a>');
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
  var follow = $('<a href="#" class="follow">Follow Me</a>');

  // make a div for the chat and add the above to it
  var chat = $('<div class="chat"></div>');
  chat.append(username);
  chat.append(time);
  chat.append(content);
  chat.append(heart);
  chat.append(follow);
  // attach div to the dom
  chat.prependTo(location);   
};

var refreshMessages = function(savedMessages, url, parent, tab) {
  var isFirstCall = savedMessages.length === 0;

  $.get(url, function(response) {
    var receivedMessages = response.results;
    for (var i = receivedMessages.length - 1; i >= 0; i--) {
      var message = receivedMessages[i];
      var messageId = message.objectId;
      if (savedMessages.indexOf(messageId) === -1) {
        addChat(message, parent);

        if (tab !== undefined) {
          numMessages = tab.find('span').text();

          if (numMessages.length === 0) {
            numMessages = 1;
          } else {
            numMessages = parseInt(numMessages) + 1;
          }
          if (!isFirstCall) {
            tab.find('span').text((' ' + numMessages));
          }
        }
      }

      savedMessages.push(messageId);
    }
  });
};

var updateFollowed = function() {

};
