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
    if (this.loc == 1) {
    ctx.drawImage(
      cursorImage,
      0,
      0,
      35,
      35,
      heroes[this.index].x + 75,
      heroes[this.index].y + 25,
      35,
      35
      )};
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
      var centerX = this.x + (this.resize_x)/2;
      var hpTextWidth = 60;
      var hpBarWidth = hpTextWidth + 20;
      var hpBarHeight = 20;
      var currentHPBar = (this.health/this.totalHealth)*hpBarWidth;
      var missingHPBar = (1-(this.health/this.totalHealth))*hpBarWidth;
      this.context.fillStyle="#FFFFFF";
      this.context.strokeRect(centerX-hpBarWidth/2,this.y-hpBarHeight,hpBarWidth,hpBarHeight);
      this.context.fillStyle="#448F30";
      this.context.fillRect(centerX-hpBarWidth/2,this.y-hpBarHeight, currentHPBar,hpBarHeight);
      this.context.fillStyle="#801515";
      this.context.fillRect(centerX-hpBarWidth/2 + currentHPBar,this.y-hpBarHeight, missingHPBar,hpBarHeight);
      this.context.font="16px Courier";
      this.context.fillStyle="#FFFFFF";
      this.context.textAlign="center";
      this.context.fillText(this.health + "/" + this.totalHealth, centerX, this.y-hpBarHeight, hpTextWidth);
      
  };

  return this;
}

function heroObject(heroClass) {
  this.charType = "hero";
  // Create sprite sheet
  var heroImage = new Image();
  // Create Hero sprite object
  spriteObject.call(this, {
    ticksPerFrame: 32,
    numberOfFrames: 2,
    context: canvas.getContext("2d"),
    width: 59,
    height: 42,
    image: heroImage,
    resize_x: 75,
    resize_y: 75
  });
  // Add hero-like attributes
  if(heroClass.class == "warrior")
    this.health = Math.floor(heroClass.health/4);
  if(heroClass.class == "blackbelt")
    this.health = Math.floor(heroClass.health/2);
  if(heroClass.class == "thief")
    this.health = Math.floor(heroClass.health/3);
  if(heroClass.class == "blackmage")
    this.health = Math.floor(heroClass.health - 10);
  this.totalHealth = heroClass.health;
  this.attack = heroClass.attack;
  this.runChance = heroClass.run;
  this.x = 20;
  this.y = 100 + heroes.length * 100;
  this.heroClass = heroClass.class;
  this.state = "walking";
  this.action;
  this.actionItem;  // If this.action is spell or item, which spell/item is used
  this.target;

  heroImage.src = imgPath + "heroes/" + heroClass.class + "_" + this.state + imgExtension;
  
  return this;
}

function monsterObject(monsterClass) {
    this.charType = "monster";
  // Create sprite sheet
  var monsterImage = new Image();
  monsterImage.src = imgPath + "monsters/" + monsterClass.class + imgExtension;

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
