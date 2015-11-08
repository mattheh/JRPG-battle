// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;//480

//===================================
// VARIABLES
//===================================
var state = "menu";
var keysDown = {};
var bgReady = false;
var menuReady = false;
var bgImage;
var menuImage;
var heroes = [];
var monsters = [];
var turnIndex = 0;
var canvasCursor;


//===================================
// GAME - SETUP/UPDATE/RENDER
//===================================

/*-----Setup-----*/

function loadAssets () {

  // Background image
  bgImage = new Image();
  bgImage.onload = function () {
  	bgReady = true;
  };
  bgImage.src = "assets/images/battlefield.png";//800x480
  
  // Menu image
  menuImage = new Image();
  menuImage.onload = function () {
  	menuReady = true;
  };
  menuImage.src = "assets/images/intro_menu.jpg";

  cursorImage = new Image();
  cursorImage.src = "assets/images/cursor.png"

  cursor2Image = new Image();
  cursor2Image.src = "assets/images/cursor2.png"
    
  addEventListener("keydown", function (e) {
        if (state == "game") {
        updateCursor(e.keyCode);
        };
  	keysDown[e.keyCode] = true;
  }, false);
  
  addEventListener("keyup", function (e) {
  	delete keysDown[e.keyCode];
  }, false);


}
function updateCursor (keyCode) {
        switch (canvasCursor.loc) {
          case 0: 
	    if (keyCode == 68) { // Player presses 'd'
              setCursor(2);
	    }
	    if (keyCode == 83) { // Player presses 's'
              setCursor(1);
	    }
	    if (keyCode == 188) { // Player presses ','
              heroes[turnIndex].action = "fight"
              setCursor(5);
	    }
            break;
          case 1:
	    if (keyCode == 87) { // Player presses 'w'
              setCursor(0);
	    }
	    if (keyCode == 68) { // Player presses 'd'
              setCursor(3);
	    }
            break;
          case 2:
	    if (keyCode == 65) { // Player presses 'a'
              setCursor(0);
	    }
	    if (keyCode == 83) { // Player presses 's'
              setCursor(3);
	    }
            break;
          case 3:
	    if (keyCode == 87) { // Player presses 'w'
              setCursor(2);
	    }
	    if (keyCode == 65) { // Player presses 'a'
              setCursor(1);
	    }
            break;
          case 4:               // Hero Area
            break;
          case 5:               //  Monster Area

            break;
        }
        
}
/*-----Update-----*/

function updateMenu () {
	if (32 in keysDown) { // Player presses space
		state = "game";
        initialize();
        canvas.height = 480;
        $('#battle-menu').show();
	}
}

var updateGame = function (modifier) {
	if (87 in keysDown) { // Player holding up
	}
	if (83 in keysDown) { // Player holding down
	}
	if (65 in keysDown) { // Player holding left
	}
	if (68 in keysDown) { // Player holding right
	}

};

/*-----Render-----*/

function renderMenu () {
	if (bgReady) {
		ctx.drawImage(menuImage, 500, 300,800,600,0, 0,800,600);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("JRPG BATTLE SIMULATOR", 170, 32);
	ctx.fillText("SPACE key to start", 280, 520);
}

function renderGame () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
        }
    
        for (var i = 0; i < heroes.length; i++){
          heroes[i].render();
        }
        for (var i = 0; i < monsters.length; i++){
          monsters[i].render();
        }

        //render cursor
        canvasCursor.render();


};

//===================================
// GAME OBJECTS
//===================================

function baseObject () {
}

function cursorObject() {
  baseObject.call(this);
  this.loc = 0;
  this.index = 0;

  this.render = function () {
    // Draw the animation
    if (this.loc == 5) {
    ctx.drawImage(
      cursor2Image,
      0,
      0,
      35,
      35,
      monsters[this.index].x - 35,
      monsters[this.index].y + 35,
      35,
      35
      );
    };
  };

  return this;

}

function spriteObject (options) {
  baseObject.call(this);         
  this.frameIndex = 0;
  this.tickCount = 0;
  this.ticksPerFrame = options.ticksPerFrame || 0;
  this.numberOfFrames = options.numberOfFrames || 1;
                
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.context = options.context;
  this.width = options.width;
  this.height = options.height;
  this.image = options.image;
  this.resize_x = options.resize_x;
  this.resize_y = options.resize_y;

  
  this.update = function () {
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 1) {
        // Go to next frame
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }
  }
  
  this.render = function () {
    // Draw the animation
    this.context.drawImage(
      this.image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      this.x,
      this.y,
      this.resize_x,
      this.resize_y
      );
      /** health bar */
      this.context.fillStyle="#FFFFFF";
      this.context.strokeRect(this.x-11,this.y-21,72,22);
      this.context.fillStyle="#448F30";
      this.context.fillRect(this.x-10,this.y-20, 70, 20);
      this.context.font="16px Courier";
      this.context.fillStyle="#FFFFFF";
      this.context.fillText(this.health + "/" + this.totalHealth, this.x-6, this.y-20, 60);
      
  };

  return this;
}

function heroObject(heroClass) {
  // Create sprite sheet
  var heroImage = new Image();
  heroImage.src = heroClass.img;

  // Create Hero sprite object
  spriteObject.call(this, {
    ticksPerFrame: 0,
    numberOfFrames: 1,
    context: canvas.getContext("2d"),
    width: 44,
    height: 44,
    image: heroImage,
    resize_x: 75,
    resize_y: 75
  });
  // Add hero-like attributes
  
  this.health = heroClass.health;
  this.totalHealth = heroClass.health;
  this.attack = heroClass.attack;
  this.x = 20;
  this.y = 100 + heroes.length * 80;
  this.heroClass = heroClass.class;
  this.state = "idle";
  this.action;
  this.target;

  
  return this;
}

function monsterObject(monsterClass) {
  // Create sprite sheet
  var monsterImage = new Image();
  monsterImage.src = monsterClass.img;

  // Create Monster sprite object
  spriteObject.call(this, {
    ticksPerFrame: 0,
    numberOfFrames: 1,
    context: canvas.getContext("2d"),
    width: 44,
    height: 44,
    image: monsterImage,
    resize_x: 125,
    resize_y: 125
  });
  // Add monster-like attributes
  
  this.health = monsterClass.health;
  this.totalHealth = monsterClass.health;
  this.attack = monsterClass.attack;
  this.x = 500 + (150 * (monsters.length % 2));
  this.y = 100 + ((Math.floor(monsters.length / 2)) * 125);
  this.monsterClass = monsterClass.class;
  
  return this;
}
//===================================
// GAME FUNCTIONS
//===================================

var initialize = function () {
        resetGame();
        canvasCursor = new cursorObject();
    for(var i=0;i<heroClasses.length;i++){  
        var hero = new heroObject(heroClasses[i]);
        heroes.push(hero);
    }
    for(var i=0;i<monsterClasses.length;i++){  
        var monster = new monsterObject(monsterClasses[i]);
        monsters.push(monster);
    }
    for(var i=0;i<monsterClasses.length;i++){  
        var monster = new monsterObject(monsterClasses[i]);
        monsters.push(monster);
    }
    for(var i=0;i<monsterClasses.length;i++){  
        var monster = new monsterObject(monsterClasses[i]);
        monsters.push(monster);
    }
};

var resetGame = function () {
        heroes.length = 0;
        monsters.length = 0;
}

var setCursor = function (loc) {
        var cursor = $('#cursor').detach();

        switch (loc) {
          case 0:
            $('#fight-action').append(cursor);
            break;
          case 1:
            $('#item-action').append(cursor);
            break;
          case 2:
            $('#spell-action').append(cursor);
            break;
          case 3:
            $('#run-action').append(cursor);
            break;
          case 4:
            break;
          case 5:
            break;
          }
        canvasCursor.loc = loc;

}

// The menu loop
var menuLoop = function () {
        updateMenu();
        renderMenu();
        switch (state) {
          case "menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "game":
	    // Request to do this again ASAP
      	    requestAnimationFrame(gameLoop);
            break;
        }
}

// The main game loop
var gameLoop = function () {
	var now = Date.now();
	
	var delta = now - then;
	updateGame(delta / 1000);
	renderGame();

        for (var i = 0; i < heroes.length; i++){
          heroes[i].render();
        }

	then = now;

        switch (state) {
          case "menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "game":
	    // Request to do this again ASAP
      	    requestAnimationFrame(gameLoop);
            break;
        }
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
loadAssets();
menuLoop();
