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
  heroImage.src = imgPath + "heroes/" + heroClass.class + "_" + "idle" + imgExtension;

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
  this.runChance = heroClass.run;
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