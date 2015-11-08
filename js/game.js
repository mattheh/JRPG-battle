// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;//480

//===================================
// VARIABLES
//===================================
var state = "Menu";
var keysDown = {};
var bgReady = false;
var menuReady = false;
var bgImage;
var menuImage;
var heroes = [];
var monsters = [];
var cursorLoc = 0;
var cursor;
var hero;
var monster;


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
    
  addEventListener("keydown", function (e) {
  	keysDown[e.keyCode] = true;
  }, false);
  
  addEventListener("keyup", function (e) {
  	delete keysDown[e.keyCode];
  }, false);


}

/*-----Update-----*/

function updateMenu () {
	if (32 in keysDown) { // Player presses space
		state = "Game";
        initialize();
        canvas.height = 480;
        $('#battle-menu').show();
	}
}

var updateGame = function (modifier) {
        switch (cursorLoc) {
          case 0: 
	    if (68 in keysDown) { // Player holding right
              setCursor(2);
	    }
	    if (83 in keysDown) { // Player holding down
              setCursor(1);
	    }
            break;
          case 1:
	    if (87 in keysDown) { // Player holding up
              setCursor(0);
	    }
	    if (68 in keysDown) { // Player holding right
              setCursor(3);
	    }
            break;
          case 2:
	    if (65 in keysDown) { // Player holding left
              setCursor(0);
	    }
	    if (83 in keysDown) { // Player holding down
              setCursor(3);
	    }
            break;
          case 3:
	    if (87 in keysDown) { // Player holding up
              setCursor(2);
	    }
	    if (65 in keysDown) { // Player holding left
              setCursor(1);
	    }
            break;
        }
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


};

//===================================
// GAME OBJECTS
//===================================

function baseObject () {
}
count = 0;
function sprite (options) {
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
      this.x,
      this.y,
      this.resize_x,
      this.resize_y
      );
      /** health bar */
      var centerX = this.x + (this.resize_x)/2;
      this.context.fillStyle="#FFFFFF";
      this.context.strokeRect(centerX-35,this.y-21,72,22);
      this.context.fillStyle="#448F30";
      this.context.fillRect(centerX-34,this.y-20, 70, 20);
      this.context.font="16px Courier";
      this.context.fillStyle="#FFFFFF";
      this.context.fillText(this.health + "/" + this.totalHealth, centerX-30, this.y-18, 60);
      
  };

  return this;
}

function heroObject(heroClass) {
  this.charType = "hero";
  // Create sprite sheet
  var heroImage = new Image();
  heroImage.src = heroClass.img;

  // Create Hero sprite object
  sprite.call(this, {
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
  this.y = 100 + heroes.length * 100;
  this.heroClass = heroClass.class;
  this.state = "idle";
  
  return this;
}

function monsterObject(monsterClass) {
    this.charType = "monster";
  // Create sprite sheet
  var monsterImage = new Image();
  monsterImage.src = monsterClass.img;

  // Create Monster sprite object
  sprite.call(this, {
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
    for(var i=0;i<heroClasses.length;i++){  
        hero = new heroObject(heroClasses[i]);
        heroes.push(hero);
    }
    for(var i=0;i<6;i++){  
        monster = new monsterObject(monsterClasses[i%2]);
        monsters.push(monster);
    }
};

var resetGame = function () {
        monsters.length = 0;
}

var setCursor = function (loc) {
        var cursor = $('#cursor').detach();
              $('#item-action').append(cursor);
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
          }
        cursorLoc = loc;

}

// The menu loop
var menuLoop = function () {
        updateMenu();
        renderMenu();
        switch (state) {
          case "Menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "Game":
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

	then = now;

        switch (state) {
          case "Menu":
	    // Switch to menu state
      	    requestAnimationFrame(menuLoop);
            break;

          case "Game":
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
