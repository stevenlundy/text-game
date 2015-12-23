function Room(name){
  this.name = name;
  this.articles = [];
  this.actions = ["look","describe", "pick", "grab", "take"];
  this.directions = {};
  this.look = function(articleName){
    
    if(articleName == undefined){
      this.setPicture(this.picture);
    	print(this.name);
    	print(this.description);
    } else {
      var article = this.getArticle(articleName);
      if(article !== -1){
      	print(article.description);
      } else{
        print("I don't see a "+articleName);
      }
    }
  };
  this.describe = this.look;
  
  this.take = function(articleName){
    if (articleName === "" || articleName === undefined){
      print("What do you want to pick up?");
    } else if(this.hasArticle(articleName)){
      for(var i = 0; i<this.articles.length	; i++){
        if(this.articles[i].name === articleName){
          if(this.articles[i].canPickUp === true){
            player.inventory.push(this.articles[i]);
            this.deleteArticle(articleName);
            break;
          } else {
            print("I can't pick that up!");
          }
        }
      }
    } 
  }
  this.pick = this.take;
  this.grab = this.take;
  
  this.hasArticle = function (article){
    for(var i = 0; i <this.articles.length; i++){
      if(this.articles[i].name === article){
        return true;
      }
    }
    return false;
  }
  this.getArticle = function (article){
    for(var i = 0; i <this.articles.length; i++){
      if(this.articles[i].name === article){
        return this.articles[i];
      }
    }
    return -1;
  }
  this.deleteArticle = function (article){
    for(var i = 0; i<this.articles.length; i++){
      if(this.articles[i].name === article){
        this.articles.splice(i,1);
      }
    }
  }
  this.hasAction = function (action){
    if(this.actions.indexOf(action) !== -1){
    	return true;
    }
    return false;
  }
  this.setPicture= function(image){
    var el = document.getElementById("picture");
    el.style.backgroundImage="url("+image+")";
  }
}

function Article(name){
  this.name = name;
  this.canPickUp = true;
}

//Rooms
var rooms = {};
rooms["Living Room"] = new Room("Living Room");
rooms["Living Room"].description = "You are in the living room of a large house. There is a tree in a stand and a roaring fire in the hearth. You can smell food cooking in a room to your right."
rooms["Living Room"].picture = "/img/living-room.jpg";
var tree = new Article("tree");
tree.description = "It's a lovely scotch pine. What did you expect? A palm tree?";
tree.canPickUp = false;
var fire = new Article("fire");
fire.description = "A roasty toasty fire. All that's missing is Lil Bub."
fire.canPickUp = false;
rooms["Living Room"].articles.push(tree);
rooms["Living Room"].articles.push(fire);

rooms["Kitchen"] = new Room("Kitchen");
rooms["Kitchen"].description = "You are in the kitchen of a large house. It is very clean considering that it smells like Christmas dinner is cooking. Through the door to the left is the living room. There is a pantry to the right off of the kitchen."
rooms["Kitchen"].picture = "/img/kitchen.jpg";

rooms["Pantry"] = new Room("Pantry");
rooms["Pantry"].description = "You are in a pantry filled with canned goods."

rooms["Living Room"].directions.right = rooms["Kitchen"];
rooms["Kitchen"].directions.left = rooms["Living Room"];
rooms["Kitchen"].directions.right = rooms["Pantry"];
rooms["Pantry"].directions.back = rooms["Kitchen"];
rooms["Pantry"].directions.back = rooms["Kitchen"];