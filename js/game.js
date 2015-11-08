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

    //render cursor


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
      75,
      75
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
  sprite.call(this, {
    ticksPerFrame: 0,
    numberOfFrames: 1,
    context: canvas.getContext("2d"),
    width: 44,
    height: 44,
    image: heroImage
  });
  // Add hero-like attributes
  
  this.health = heroClass.health;
  this.totalHealth = heroClass.health;
  this.attack = heroClass.attack;
  this.x = 20;
  this.y = 100 + heroes.length * 80;
  this.heroClass = heroClass.class;
  this.state = "idle";
  
  return this;
}

//===================================
// GAME FUNCTIONS
//===================================

var initialize = function () {
        resetGame();
        var hero;
    for(var i=0;i<heroClasses.length;i++){  
        hero = new heroObject(heroClasses[i]);
        heroes.push(hero);
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

        for (var i = 0; i < heroes.length; i++){
          heroes[i].render();
        }

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
