// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;//480

//===================================
// CONSTANTS
//===================================

var UP_KEY = 87;//   W
var LEFT_KEY = 65;// A
var DOWN_KEY = 83;// S
var RIGHT_KEY = 68;//D
var A_KEY = 188; //  ,
var B_KEY = 76;//    l
var SPACE_KEY = 32;// space bar
var battleMenu = ["fight", "item", "spell", "run"];
var subMenu = ["subaction-1", "subaction-2", "subaction-3", "subaction-4"];

var imgPath = "assets/images/";
var imgExtension = ".png";
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
var fightExecutor;
var turnIndex = 0;
var canvasCursor;
var menuCursor;
var menuContent = [];


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
          case 0: //menu
	    if (keyCode == UP_KEY) { // Player presses 'w'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + battleMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == LEFT_KEY) { // Player presses 'a'
              canvasCursor.index -= 2;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + battleMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == DOWN_KEY) { // Player presses 's'
              canvasCursor.index = (canvasCursor.index + 1) % battleMenu.length;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == RIGHT_KEY) { // Player presses 'd'
              canvasCursor.index = (canvasCursor.index + 2) % battleMenu.length;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == A_KEY) { // Player presses ','
              var selectedAction = battleMenu[canvasCursor.index];
              heroes[turnIndex].action = selectedAction;
              canvasCursor.index = 0;
              updateSubmenu(selectedAction,heroes[turnIndex]);
	    }
            break;
          case 1:               // Hero Area
	    if (keyCode == UP_KEY) { // Player presses 'w'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + heroes.length;
              }
	    }
	    if (keyCode == DOWN_KEY) { // Player presses 's'
              canvasCursor.index = (canvasCursor.index + 1) % heroes.length;
	    }
	    if (keyCode == B_KEY) { // Player presses 'l'
              $('#fight-action').append(menuCursor);
              resetSubmenu();
              canvasCursor.index = 0;
              canvasCursor.loc = 0;
	    }
	    if (keyCode == A_KEY) { // Player presses ','
              heroes[turnIndex].target = heroes[canvasCursor.index];
              nextHero();
              resetSubmenu();
	    }
            break;
          case 2:               //  Monster Area
	    if (keyCode == UP_KEY) { // Player presses 'w'
              canvasCursor.index -= 2;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + monsters.length;
              }
	    }
	    if (keyCode == DOWN_KEY) { // Player presses 's'
              canvasCursor.index = (canvasCursor.index + 2) % monsters.length;
	    }
	    if (keyCode == LEFT_KEY) { // Player presses 'a'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 0) {
                canvasCursor.index = canvasCursor.index + monsters.length;
              }
	    }
	    if (keyCode == RIGHT_KEY) { // Player presses 'd'
              canvasCursor.index = (canvasCursor.index + 1) % monsters.length;
	    }
	    if (keyCode == B_KEY) { // Player presses 'l'
              $('#fight-action').append(menuCursor);
              resetSubmenu();
              canvasCursor.index = 0;
              canvasCursor.loc = 0;
	    }
	    if (keyCode == A_KEY) { // Player presses ','
              heroes[turnIndex].target = monsters[canvasCursor.index];
              nextHero();
              resetSubmenu();
	    }

            break;
          case 3:               // Submenu
	    if (keyCode == UP_KEY) { // Player presses 'w'
              canvasCursor.index -= 1;
              if (canvasCursor.index < 4) {
                canvasCursor.index = canvasCursor.index + subMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == LEFT_KEY) { // Player presses 'a'
              canvasCursor.index -= 2;
              if (canvasCursor.index < 4) {
                canvasCursor.index = canvasCursor.index + battleMenu.length;
              }
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == DOWN_KEY) { // Player presses 's'
              canvasCursor.index = ((canvasCursor.index + 1) % battleMenu.length) + 4;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == RIGHT_KEY) { // Player presses 'd'
              canvasCursor.index = ((canvasCursor.index + 2) % battleMenu.length) + 4;
              setCursor(canvasCursor.index);
	    }
	    if (keyCode == B_KEY) { // Player presses 'l'
              $('#fight-action').append(menuCursor);
              resetSubmenu();
              canvasCursor.index = 0;
              canvasCursor.loc = 0;
	    }
	    if (keyCode == A_KEY) { // Player presses ','
              var selectedItem = menuContent[canvasCursor.index % 4];
              heroes[turnIndex].actionItem = selectedItem;
              menuCursor = $('#cursor').detach();
              canvasCursor.index = 0;
              if (selectedItem.affects == "hero") {
                canvasCursor.loc = 1;
              } else {
                canvasCursor.loc = 2
              }
              resetSubmenu();
	    }
            break;

        }
        
}

function nextHero () {
        $('#fight-action').append(menuCursor);
        //heroes[turnIndex].x = heroes[turnIndex].x - 75;
        updateGame();
        turnIndex += 1;
        if(turnIndex >= heroes.length){
            return;
        }
        //heroes[turnIndex].x = heroes[turnIndex].x + 75;
        canvasCursor.index = 0;
        canvasCursor.loc = 0;

}

//===================================
// FIGHT LOGIC
//===================================

function currentRoundFight(){
    for(var i=0;i<fightExecutor.combatants.length;i++){
        var combatant = fightExecutor.combatants[i];
        var target = combatant.target;
        if(combatant.charType == "hero"){
            if(combatant.action == "fight"){
             target.currentHealth -= randomAttack(combatant.attack);
            }
            else if(combatant.action == "spell"){
                var spell = combatant.actionItem;
                if(target.charType == "monster"){
                    if(spell.name == "Fira"){
                        for(var i=0;i<monsters.length;i++)
                            monsters[i].currentHealth -= spell.value;
                    }
                    else{//single target spell
                        target.currentHealth -= combatant.actionItem.value;
                    }
                }
                else if(combatant.target.charType =="hero"){
                    if(spell.name == "Temper"){
                        target.attack += combatant.actionItem.value;   
                    }
                }
            }
            else if(combatant.action == "item"){
             var item = combatant.actionItem;
                if(item.name.toLowerCase().indexOf("potion") != -1){
                  target.currentHealth += item.value;   
                }
            }
        }
        else{//monster
            var rand = Math.random();
            var randHeroIndex = Math.floor(rand * heroes.length);
            var heroToAttack = heroes[randHeroIndex];
            heroToAttack.currentHealth = heroToAttack.currentHealth - randomAttack(combatant.attack);
        }
    }
    resetRound();
}

//attack + 20% margin
function randomAttack(attack){
    var plusOrMinus = Math.random() > 0.5 ? -1 : 1;
    var margin = Math.random() * (attack*0.2);
    attack = attack + Math.floor(margin* plusOrMinus);
    return attack;
}

function resetRound(){
    turnIndex = 0;
    //heroes[turnIndex].x = heroes[turnIndex].x + 75;
    for(var i=0;i<heroClasses.length;i++){  
      delete heroes[i].target;
    }
    
    canvasCursor.index = 0;
    canvasCursor.loc = 0;
}
/**************END FIGHT LOGIC **************/

function updateSubmenu (selectedAction, currentHero) {
    if(selectedAction == "fight"){
        canvasCursor.loc = 2;
        menuCursor = $('#cursor').detach();
        $('#subaction-1').text("Attack: " + currentHero.attack);
        return;
      }
    else if(selectedAction == "run"){
        nextHero();
        return;
    }
    else if (selectedAction == "item") {
        $('#subaction-1').text(consumables[0].name);
        menuContent[0] = consumables[0];
        $('#subaction-2').text(consumables[1].name);
        menuContent[1] = consumables[1];
        $('#subaction-3').text(consumables[2].name);
        menuContent[2] = consumables[2];
        $('#subaction-4').text(consumables[3].name);
        menuContent[3] = consumables[3];
    }else if(selectedAction == "spell" && currentHero.spell != undefined){
        $('#subaction-1').text(currentHero.spell[0].name);
        menuContent[0] = currentHero.spell[0];
        $('#subaction-2').text(currentHero.spell[1].name);
        menuContent[1] = currentHero.spell[1];
        $('#subaction-3').text(currentHero.spell[2].name);
        menuContent[2] = currentHero.spell[2];
        $('#subaction-4').text(currentHero.spell[3].name);
        menuContent[3] = currentHero.spell[3];
    }else{
        canvasCursor.index = 2;//stay on spell, don't do anything
        return;   
    }
  menuCursor = $('#cursor').detach();
  canvasCursor.index = 4;
  $('#subaction-1').append(menuCursor);
  canvasCursor.loc = 3;
}

function resetSubmenu(){
    $('#menu-subaction-table td').text("");
}

/*-----Update-----*/

function updateMenu () {
	if (SPACE_KEY in keysDown) { // Player presses space
		state = "game";
        initialize();
        canvas.height = 480;
        $('#battle-menu').show();
	}
}

var updateGame = function (modifier) {
        if (turnIndex == heroes.length && heroes[3].x == 20) {
            currentRoundFight();
        };
        
        if (turnIndex < heroes.length){

          if (typeof heroes[turnIndex].target === 'undefined') {
            heroes[turnIndex].state = "walking"
          } else {
            heroes[turnIndex].state = "idle"
          };
        };
        for (var i = 0; i < heroes.length; i++){
          heroes[i].updateState();
        }
        for (var i = 0; i < monsters.length; i++){
          monsters[i].update();
          if (monsters[i].currentHealth <= 0) {
            monsters.splice(i, 1)
          }
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
          heroes[i].animate();
        }
        heroes[2].animate();
        for (var i = 0; i < monsters.length; i++){
          monsters[i].renderHealth();
        }

        //render cursor
        canvasCursor.render();


};


//===================================
// GAME FUNCTIONS
//===================================

var initialize = function () {
        resetGame();
        canvasCursor = new cursorObject();
        fightExecutor = new fightExecutor();
        for(var i=0;i<heroClasses.length;i++){  
          var hero = new heroObject(heroClasses[i]);
          heroes.push(hero);
        }
        //heroes[turnIndex].x = heroes[turnIndex].x + 75
        for(var i=0;i<6;i++){  
          monster = new monsterObject(monsterClasses[i%2]);
          monsters.push(monster);
        }
        fightExecutor.combatants = heroes.concat(monsters);
};

var resetGame = function () {
        heroes.length = 0;
        monsters.length = 0;
}

var setCursor = function (menuIndex) {
        menuCursor = $('#cursor').detach();
        if (menuIndex < 4) {
            var string = '#' + battleMenu[menuIndex] + '-action'
        } else {
            var string = '#' + subMenu[menuIndex % 4]
        }
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
