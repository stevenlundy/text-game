$( document ).ready(function() {
  var consoleHistory = [];
  var tempCmd = "";
  var currentCmd = 0;

  currentRoom.look({articles: [], directions: [], other: []});

  $('#scroller').click(function() {
    $('#console-input').focus();
  });
  $('#console-input').bind("enterKey",function(e) {
    var value = $('#console-input').val();
    print(value);
    evaluate(value);
    consoleHistory.push(value);
    $('#console-input').val("");
    currentCmd = consoleHistory.length;
    tempCmd = "";
  });
  $('#console-input').bind("prevCmd",function(e) {
    if(currentCmd === 0){
    }
    if(currentCmd >= consoleHistory.length){
      tempCmd = $('#console-input').val();
      currentCmd = consoleHistory.length - 1;
    } else if(currentCmd >0){
      currentCmd--;
    }
    $('#console-input').val(consoleHistory[currentCmd]);
  });
  $('#console-input').bind("nextCmd",function(e) {
    currentCmd++;
    if(currentCmd > consoleHistory.length){
      currentCmd = consoleHistory.length;
    } else if(currentCmd === consoleHistory.length) {
      $('#console-input').val(tempCmd);
    } else if(currentCmd >=0) {
      $('#console-input').val(consoleHistory[currentCmd]);
    }
  });
  $('#console-input').keyup(function(e) {
    if(e.keyCode == 13) { // enter
      $(this).trigger("enterKey");
    }
    if(e.keyCode == 38) { // up
      $(this).trigger("prevCmd");
    }
    if(e.keyCode == 40) { // down
      $(this).trigger("nextCmd");
    }
  });
});

function print (output) {
  var promptString = '>> '
  output = setParagraphWidth(output, 60, repeatChar(' ', promptString.length));
  $('#console').append(promptString + output + '\n');
  var box = document.getElementById('scroller');
  box.scrollTop = box.scrollHeight;
}

function repeatChar (char, repetitions) {
  var output = '';
  for (var i = 0; i < repetitions; i++) {
    output += char;
  }
  return output;
}

function setParagraphWidth(text, width, indent) {
  if(text.length <= width){
    return text;
  }
  var newText = "";
  var lineStart = 0;
  for(var i = width; i<text.length; i--){
    if(text.charAt(i) === " "){
      newText += text.substring(lineStart, i) + "\n" + indent;
      lineStart = i+1;
      i = i+width+1;
    }
  }
  newText += text.substring(lineStart, i);

  return newText;
}

function addIndefiniteArticle (word) {
  if(isPlural(word)){
    return word;
  } else if (isVowel(word[0])) {
    return 'an ' + word;
  } else {
    return 'a ' + word;
  }
}

function isVowel (char) {
  var vowels = ['a','e','i','o','u'];
  return vowels.indexOf(char) > -1;
}

function isPlural (word) {
  word = word.toLowerCase();
  //exceptions
  var pluralWords = [/^mice$/, /^women$/, /^children$/, /^men$/, /^people$/, /^feet$/, /^data&/, /^dice$/, /ia$/];
  var singularWords = [/sis$/, /us$/];

  if(pluralWords.some(function(pattern) {
    return !!(word.match(pattern));
  })) {
    return true;
  } else if(singularWords.some(function(pattern) {
    return !!(word.match(pattern));
  })) {
    return false;
  } else {
    return !!(word.match(/s$/));
  }
}

function evaluate(input) {
  if(input === ""){
    return;
  }
  var articles = [];
  var actions = [];
  var directions = [];
  var other = []

  // Pull out actions and articles from input
  input = input.split(" ");
  for(var i = 0; i<input.length; i++){
    if(currentRoom.hasArticle(input[i])){
      articles.push(input[i]);
    } else if(currentRoom.hasAction(input[i])){
      actions.push(input[i]);
    } else if(currentRoom.directions.hasOwnProperty(input[i])){
      directions.push(input[i]);
    } else if(player.hasArticle(input[i])){
      actions.push(input[i]);
    } else {
      other.push(input[i]);
    }
  }

  if(actions.length === 0){ // No Action provided
    if(input.length === articles.length ){ // Each input is an article
      if (input.length === 1){ // One article
      	print("What do you want to do with the " + articles[0] + "?");
      } else { // Multiple Articles
        print("These are in the room. Now what?");
      }
    } else if(input.length === directions.length){
      if(directions.length === 1){
        console.log(directions);
        console.log(currentRoom);
        currentRoom = currentRoom.directions[directions[0]];
        console.log(currentRoom);
        currentRoom.look({articles: [], directions: [], other: []});
      } else {
        print("Let's go to one place at a time.")
      }
    } else {
      print("I don't think I can "+input.join(" "))+".";
    }
  }
  else if(actions.length === 1){ // One action provided
    var action = currentRoom[actions[0]];
    action.call(currentRoom, {
      articles: articles,
      directions: directions,
      other: other
    });
  }
  else { // Multiple actions provided
    print("I don't understand what you mean.");
  }
}

// Start Game
var player = {};
player.inventory = [];
player.hasArticle = function (articleName){
  return this.inventory.some(function(article) {
    return article.name === articleName;
  });
}
var currentRoom = rooms["Living Room"];
