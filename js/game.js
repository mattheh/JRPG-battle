// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 750;
canvas.height = 445;
document.body.appendChild(canvas);

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
  bgImage.src = "assets/images/battlefield.png";
  
  // Menu image
  menuImage = new Image();
  menuImage.onload = function () {
  	menuReady = true;
  };
  menuImage.src = "assets/images/battlefield.png";
  
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
	}
}

var updateGame = function (modifier) {
	if (38 in keysDown) { // Player holding up
	}
	if (40 in keysDown) { // Player holding down
	}
	if (37 in keysDown) { // Player holding left
	}
	if (39 in keysDown) { // Player holding right
	}

};

/*-----Render-----*/

function renderMenu () {
	if (bgReady) {
		ctx.drawImage(menuImage, 0, 0);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("JRPG BATTLE SIMULATOR", 170, 32);
	ctx.fillText("SPACE key to start", 144, 144);
}

function renderGame () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

        for (var i = 0; i < heroes.length; i++){
          heroes[i].render;
        }

};

//===================================
// GAME OBJECTS
//===================================

function baseObject () {
}

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
      44,
      44);
  };

  return this;
}

function heroObject () {
  // Create sprite sheet
  var heroImage = new Image();
  heroImage.src = "assets/images/herospritesheet.png"

  // Create Hero sprite object
  sprite.call(this, {
    ticksPerFrame: 0,
    numberOfFrames: 1,
    context: canvas.getContext("2d"),
    width: 44,
    height: 44,
    image: heroImage
  });
  // Add hero-like attributes
  this.health = 100;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  
  return this;
}

//===================================
// GAME FUNCTIONS
//===================================

var initialize = function () {
        resetGame();
        hero = new heroObject();
        heroes.push(hero);
};

var resetGame = function () {
        monsters.length = 0;
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
