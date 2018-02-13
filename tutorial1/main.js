var game= new Phaser.Game(800,600, Phaser.CANVAS,'gameDiv');

var spacefield;
var backgroundv;
var player;
var cursors;

var bullets;
var bulletTime = 0; //space between bullets
var fireButton;

var enemies;

var score = 0;
var scoreText;

var winText;

var mainState = {
	preload: function(){
    	game.load.image('starfield', 'assets/starfield.png');
		// game.load.spritesheet('player', '../assets/dude.png', 32, 48);
		game.load.image('player', 'assets/xenon2_ship.png')
		game.load.image('bullet', 'assets/bullet130.png');
		game.load.image('enemy', 'assets/baddie2.png');

	},

	create: function(){
		spacefield = game.add.tileSprite(0,0,800,600,'starfield');
		backgroundv = 5;
		player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
		game.physics.arcade.enable(player);

		// player.animations.add('left', [0,1,2,3], 10, true);
		// player.animations.add('right',[5,6,7,8],10,true);
		// player.animations.add('still',[4], true);
		scoreText = game.add.text(0, 0, 'Score:', {font: '32px Arial', fill : '#fff'});
		winText = game.add.text(game.world.centerX, game.world.centerY, 'YOU WIN!', {font: '50px Arial', fill: '#fff'});
		winText.visible = false;
		winText.anchor.setTo(0.5);
		cursors = game.input.keyboard.createCursorKeys();

		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x',0.5);
		bullets.setAll('anchor.y',0.5);
		bullets.setAll('outOfBoundsKill',true);
		bullets.setAll('checkWorldBounds',true);

		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		createEnemy();

	},

	update: function(){

		game.physics.arcade.overlap(bullets,enemies,collisionHandler,null)
		spacefield.tilePosition.y += backgroundv;
		player.body.velocity.x = 0;
		
		if(fireButton.isDown){
			fireBullet();
		}
		if(cursors.left.isDown){
			player.body.velocity.x = -300;
			// player.animations.play('left');
		}else if(cursors.right.isDown){
			player.body.velocity.x = 300;
			// player.animations.play('right');
		}else{
			// player.animations.stop();
			
			// player.frame = 4;
		}
		if(score ==4000){
			scoreText.visible = false;
			winText.visible = true;
		}

	}

}

function createEnemy(){
	for(let y=0; y<4; y++){
		for(let x=0; x<10; x++){
			enemy = enemies.create(x*48, y*60, 'enemy');
			enemy.anchor.setTo(0.5);
		}
	}
	enemies.x=100;
	enemies.y= 50;
	var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None,true,0,100,true);

	tween.onRepeat.add(descend,this);

}
function descend(){
	enemies.y += 10;
}
function fireBullet(){

	if(game.time.now>bulletTime){
		bullet = bullets.getFirstExists(false);

		if(bullet){
			bullet.reset(player.x + 14,player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200; // ~ 20 ms
		}
	}
}
function collisionHandler(bullet,enemy){
	bullet.kill();
	enemy.kill();
	score += 100;
	scoreText.text = 'Score: '+ score;
}


game.state.add('mainState', mainState); // took an instance of our running game, and to its states we added our mainstate

game.state.start('mainState'); // 