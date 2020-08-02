var config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var game = new Phaser.Game(config);


var player;
var platforms;
var cursors;

var spacebar;

var PLAYER_HORIZONTAL_SPEED = 160;
var PLAYER_VERTICAL_SPEED = 480;
var MAP_SCROLL_SPEED = 80;

var gravityDown = true;

function preload () {
  this.load.image('ground', 'assets/platform.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create () {
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 800-32, 'ground').setScale(2).refreshBody();

  // platforms.create(600, 400, 'ground');
  // platforms.create(50, 250, 'ground');
  // platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 710, 'dude');

  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platforms);

  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update () {
  platforms.create(750, 220, 'ground');

  if (cursors.left.isDown) {
    player.setVelocityX(-PLAYER_HORIZONTAL_SPEED);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(PLAYER_HORIZONTAL_SPEED);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (Phaser.Input.Keyboard.JustDown(spacebar)) {
    if (gravityDown) {
      player.setVelocityY(-PLAYER_VERTICAL_SPEED);
      gravityDown = false;
    } else {
      player.setVelocityY(PLAYER_VERTICAL_SPEED);
      gravityDown = true;
    }
  }
}
