function Room(name){
  this.name = name;
  this.articles = [];
  this.actions = ['look','describe', 'pick', 'grab', 'take'];
  this.directions = {};
}

Room.prototype.look = function(params){
  if(params.articles.length > 0) {
    var articleName = params.articles[0];
    var article = this.getArticle(articleName);
   	article.describe();
  } else if (params.directions.length > 0) {
    for (var i = 0; i < params.directions.length; i++) {
      print('Going ' + params.directions[i] + ' leads to the ' + this.directions[params.directions[i]].name + '.');
    }
  } else if (params.other.length > 0) {
    print('I don\'t see ' + addIndefiniteArticle(params.other[0]));

  } else {
    this.setPicture(this.picture);
    print(this.name);
    print(this.description);
  }
};
Room.prototype.describe = Room.prototype.look;

Room.prototype.take = function(params){
  var articleName = params.articles[0];
  if (articleName === '' || articleName === undefined){
    print('What do you want to pick up?');
  } else if(this.hasArticle(articleName)){
    for(var i = 0; i<this.articles.length	; i++){
      if(this.articles[i].name === articleName){
        if(this.articles[i].canPickUp === true){
          player.inventory.push(this.articles[i]);
          this.deleteArticle(articleName);
          break;
        } else {
          print('I can\'t pick that up!');
        }
      }
    }
  }
}
Room.prototype.pick = Room.prototype.take;
Room.prototype.grab = Room.prototype.take;

Room.prototype.hasArticle = function (articleName){
  return this.articles.some(function(article) {
    return article.name === articleName;
  });
}
Room.prototype.getArticle = function (articleName){
  for(var i = 0; i < this.articles.length; i++){
    if(this.articles[i].name === articleName){
      return this.articles[i];
    }
  }
  return -1;
}
Room.prototype.deleteArticle = function (articleName) {
  for(var i = 0; i < this.articles.length; i++){
    if(this.articles[i].name === articleName){
      this.articles.splice(i,1);
      break;
    }
  }
}
Room.prototype.hasAction = function (action) {
  return this.actions.indexOf(action) !== -1;
}
Room.prototype.setPicture = function(image) {
  var el = document.getElementById("picture");
  el.style.backgroundImage="url("+image+")";
}

function Article(name){
  this.name = name;
  this.canPickUp = true;
  this.descriptions = [];
}

Article.prototype.describe = function() {
  if(this.descriptions.length) {
    print(this.descriptions[0]);
    this.descriptions.push(this.descriptions.shift()); // rotate array
  } else {
    print('How does one describe ' + this.name + '?');
  }
}


//Rooms
var rooms = {};
rooms["Living Room"] = new Room("Living Room");
rooms["Living Room"].description = "You are in the living room of a large house. There is a tree in a stand and a roaring fire in the hearth. You can smell food cooking in a room to your right."
rooms["Living Room"].picture = "img/living-room.jpg";
var tree = new Article("tree");
tree.descriptions.push("It's a lovely scotch pine. What did you expect? A palm tree?");
tree.canPickUp = false;
var fire = new Article("fire");
fire.descriptions.push("A roasty toasty fire. All that's missing is Lil Bub.");
fire.canPickUp = false;
rooms["Living Room"].articles.push(tree);
rooms["Living Room"].articles.push(fire);

rooms["Kitchen"] = new Room("Kitchen");
rooms["Kitchen"].description = "You are in the kitchen of a large house. It is very clean considering that it smells like Christmas dinner is cooking. Through the door to the left is the living room. There is a pantry to the right off of the kitchen."
rooms["Kitchen"].picture = "img/kitchen.jpg";

rooms["Pantry"] = new Room("Pantry");
rooms["Pantry"].description = "You are in a pantry filled with canned goods."

rooms["Living Room"].directions.right = rooms["Kitchen"];
rooms["Kitchen"].directions.left = rooms["Living Room"];
rooms["Kitchen"].directions.right = rooms["Pantry"];
rooms["Pantry"].directions.back = rooms["Kitchen"];
rooms["Pantry"].directions.back = rooms["Kitchen"];
