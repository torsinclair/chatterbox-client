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

$.get('https://api.parse.com/1/classes/messages', function(response, status) {
  messages = response.results;
  console.log(status);
  _.each(messages, function(message) {
    // make a paragraph and add the text to the paragraph
    var content = $('<p></p>');
    content.text(message.text);
    // make a h4 and add the username to it
    var username = $('<h4></h4>');
    username.text(message.username);
    // make a div for the chat and add the above to it
    var chat = $('<div class="chat"></div>');
    chat.append(username);
    chat.append(content);
    // attach div to the dom
    chat.appendTo($('#chats'));
  });

});

// var sanitizeMessage = function(message) {
//   if (!message) return message;
//   var retMessage = '';
//   // var escapeCharacters = ['\&', '\<', '>', '\"', '\'', '`', '!', '@', '$', '%', 
//   //   '(', ')', '=', '+', '{', '}', '[', ']'];
//   var escapeCharacters = {
//     '&': '&#38;',
//     '<': '&#60;',
//     '>': '&#62;',
//     '"': '&#34;',
//     '\'': '&#39;',
//     '`': '&#96;',
//     '!': '&#33;',
//     '@': '&#64;',
//     '$': '&#36;',
//     '%': '&#37;',
//     '(': '&#40;',
//     ')': '&#41;',
//     '=': '&#61;',
//     '+': '&#43;',
//     '{': '&#123;',
//     '}': '&#125;',
//     '[': '&#91;',
//     ']': '&#93;'
//   };

//   for (var i = 0; i < message.length; i++) {
//     var currentChar = message.charAt(i);
//     var escapeSequence = escapeCharacters[currentChar]
//     if (escapeSequence !== undefined) {
//       retMessage += escapeSequence;
//     } else {
//       retMessage += currentChar;
//     }
//   }

//   return retMessage;
// };