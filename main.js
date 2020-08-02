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

var TOTAL_PLATFORMS = 97;

var gameOverText;

var score = 0;

var platformsCurrentVelocity = 0;

var win = false;

function preload () {
  this.load.image('platform', 'assets/platform.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function spawnPlatform(y) {
  const x = Math.random()*500 + 50

  platforms.create(x, y, 'platform');
}

function create () {


  platforms = this.physics.add.group({immovable: true});

  platforms.create(400, 800-32, 'ground');

  platforms.create(400, 500, 'platform');
  platforms.create(150, 500, 'platform');
  platforms.create(275, 200, 'platform');

  let y = -50;
  for (i = 0; i < TOTAL_PLATFORMS; i++) {
    spawnPlatform(y);
    y -= Math.random() * 200 + 100
  }

  player = this.physics.add.sprite(100, 800-90, 'dude');

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


  scoreText = this.add.text(0, 0, 'Floors: 0', { fontSize: '32px', fill: '#fff' });
  gameOverText = this.add.text(200, 350, '', { fontSize: '32px', fill: '#fff' });
  winText = this.add.text(200, 350, '', { fontSize: '32px', fill: '#fff' });
}


function update (time, delta) {
  if (win) {
    platforms.setVelocityY(0);
    platformsCurrentVelocity = 0;
    winText.setText('YOU WIN!')
    return;
  }

  if (gameOver) {
    platforms.setVelocityY(0);
    platformsCurrentVelocity = 0;
    gameOverText.setText('GAME OVER')
    return;
  }

  if (player.body.y < -100 || player.body.y > 900) {
    gameOver = true
  }

  if (player.body.y < 300) {
    isScrolling = true
    platforms.setVelocityY(MAP_SCROLL_SPEED);
    platformsCurrentVelocity = MAP_SCROLL_SPEED;
  }

  platforms.getChildren().forEach(function(platform){
    if (platform.body.y > 900) {
      platform.destroy();
      score += 1;
      scoreText.setText('Floors: ' + score);

      if (score % 5 == 0) {
        platformsCurrentVelocity += 10;
        platforms.setVelocityY(platformsCurrentVelocity);
      }

      if (score >= TOTAL_PLATFORMS + 3) {
        win = true;
      }
    }
  }, this)

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
