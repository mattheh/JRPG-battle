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
var battleMenu = ["fight", "item", "spell", "run"]
var turnIndex = 0;
var canvasCursor;
var menuCursor;


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
	    if (keyCode == 87) { // Player presses 'w'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + battleMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == 65) { // Player presses 'a'
              canvasCursor.index -= 2;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + battleMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == 83) { // Player presses 's'
              canvasCursor.index = (canvasCursor.index + 1) % battleMenu.length;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == 68) { // Player presses 'd'
              canvasCursor.index = (canvasCursor.index + 2) % battleMenu.length;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == 188) { // Player presses ','
              heroes[turnIndex].action = battleMenu[canvasCursor.index]
              menuCursor = $('#cursor').detach();
              canvasCursor.index = 0;
              canvasCursor.loc = 2;
	    }
            break;
          case 1:               // Hero Area
            break;
          case 2:               //  Monster Area
	    if (keyCode == 87) { // Player presses 'w'
              canvasCursor.index -= 2;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + monsters.length;
              }
	    }
	    if (keyCode == 83) { // Player presses 's'
              canvasCursor.index = (canvasCursor.index + 2) % monsters.length;
	    }
	    if (keyCode == 65) { // Player presses 'a'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + monsters.length;
              }
	    }
	    if (keyCode == 68) { // Player presses 'd'
              canvasCursor.index = (canvasCursor.index + 1) % monsters.length;
	    }
	    if (keyCode == 76) { // Player presses 'l'
              $('#fight-action').append(menuCursor);
              canvasCursor.index = 0;
              canvasCursor.loc = 0;
	    }
	    if (keyCode == 188) { // Player presses ','
              heroes[turnIndex].target = monsters[canvasCursor.index];
              heroes[turnIndex].x = heroes[turnIndex].x - 75;
              $('#fight-action').append(menuCursor);
              turnIndex += 1;
              if (turnIndex == heroes.length) {
                //BEGIN BATTLE SEQUENCE
                break;
              }
              heroes[turnIndex].x = heroes[turnIndex].x + 75;
              canvasCursor.index = 0;
              canvasCursor.loc = 0;
	    }

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
    if (this.loc == 2) {
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
  this.y = 100 + heroes.length * 100;
  this.heroClass = heroClass.class;
  this.state = "idle";
  this.action;
  this.target;

  
  return this;
}

function monsterObject(monsterClass) {
    this.charType = "monster";
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
        heroes[turnIndex].x = heroes[turnIndex].x + 75
        for(var i=0;i<6;i++){  
          monster = new monsterObject(monsterClasses[i%2]);
          monsters.push(monster);
        }
};

var resetGame = function () {
        heroes.length = 0;
        monsters.length = 0;
}

var setCursor = function (action) {
        menuCursor = $('#cursor').detach();
        var string = '#' + battleMenu[action] + '-action'
        $(string).append(menuCursor);

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
