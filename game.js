
let gameScene = new Phaser.Scene('Game');


gameScene.init = function() {
  this.playerSpeed = 3.4;
  this.enemyMaxY = 600;
  this.enemyMinY = 320;
}

gameScene.preload = function() {

  this.load.image('background', 'assets/backgrounds.png');
  this.load.image('player', 'assets/playerr.gif');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('text','assets/text.png')

 };

gameScene.create = function() {

  let bg = this.add.sprite(0, 0, 'background');

  bg.setOrigin(0, 0);


  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

  this.player.setScale(.07);


  this.star = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'star');
  this.star.setScale(0.1);

// Add counter to increase speed or position after a certain amount of time //


  this.enemies = this.add.group({
    key: 'bomb',
    repeat: 10,
    setXY: {
      x: 230,
      y: 205,
      stepX: 120,
      stepY: 120
    }
  });


  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.7, -0.7);

  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = 4.5;
  }, this);

  this.isPlayerAlive = true;
};


gameScene.update = function() {


  if (!this.isPlayerAlive) {
    return;
  }

  if (this.input.activePointer.isDown) {


    this.player.x += this.playerSpeed;
  }


  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.star.getBounds())) {
    this.youWin();

  }


  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {


    enemies[i].y += enemies[i].speed;


    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }


    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
};

gameScene.gameOver = function() {

  this.isPlayerAlive = false;


  this.cameras.main.shake(300);

  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);

  this.time.delayedCall(400, function() {
    this.scene.manager.bootScene(this);
  }, [], this);


  this.time.delayedCall(600, function() {
    this.cameras.main.resetFX();
  }, [], this);
};

gameScene.youWin = function(){

this.isPlayerAlive = true;



 this.text = this.add.sprite (350,80,'text');



  this.time.delayedCall(300, function() {
    this.scene.manager.bootScene(this);
  }, [], this);


  this.time.delayedCall(450, function() {
    this.cameras.main.resetFX();
  }, [], this);
};







let config = {
  type: Phaser.AUTO,
    width: 1640,
  height: 1060,
  scene: gameScene
};


let game = new Phaser.Game(config);
