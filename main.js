var config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 600,
      height: 800
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
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

var isScrolling = false;
var canJump = true

var gameOver = false

function preload () {
  this.load.image('platform', 'assets/platform.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create () {
  // this.physics.world.setBounds(0, 0, 400, 300);
  // this.cameras.main.setViewport(config.x, config.y, 400, 300).setBackgroundColor('#000');

  // this.game.world.setBounds(0, 0, 300, 400)
  this.cameras.main.setBounds(0, 0, 600, 800);

  platforms = this.physics.add.group({immovable: true});

  platforms.create(400, 800-32, 'ground');

  platforms.create(400, 500, 'platform');
  platforms.create(150, 500, 'platform');
  platforms.create(275, 200, 'platform');

  platforms.create(300, 0, 'platform');
  platforms.create(100, -500, 'platform');
  platforms.create(500, -1000, 'platform');
  platforms.create(300, -1500, 'platform');
  platforms.create(200, -2000, 'platform');


  player = this.physics.add.sprite(100, 800-90, 'dude');
  // player.setCollideWorldBounds(true);

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

  this.physics.add.collider(player, platforms, () => canJump = true);

  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update (time, delta) {
  if (gameOver) {
    return;
  }

  console.log(player.body.y);

  if (player.body.y < -100 || player.body.y > 900) {
    gameOver = true
  }

  if (player.body.y < 300) {
    isScrolling = true
    platforms.setVelocityY(MAP_SCROLL_SPEED);
  }

  if (cursors.left.isDown && player.body.x > 0) {
    player.setVelocityX(-PLAYER_HORIZONTAL_SPEED);
    player.anims.play('left', true);
  } else if (cursors.right.isDown && player.body.x < 600 - 32) {
    player.setVelocityX(PLAYER_HORIZONTAL_SPEED);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (Phaser.Input.Keyboard.JustDown(spacebar) && canJump) {
    canJump = false;

    if (gravityDown) {
      player.setVelocityY(-PLAYER_VERTICAL_SPEED/2);
      player.body.gravity.y = -PLAYER_VERTICAL_SPEED/2;
      gravityDown = false;
    } else {
      player.setVelocityY(PLAYER_VERTICAL_SPEED/2);
      player.body.gravity.y = PLAYER_VERTICAL_SPEED/2;
      gravityDown = true;
    }
  }
}
