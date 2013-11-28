// Declarations

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasBear = document.getElementById('canvasBear');
var ctxBear = canvasBear.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');

var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasBg.getContext('2d');

var bear1 = new Bear();
var btnPlay = new Button(308, 535, 114, 169);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0 ;
var mouseY = 0 ;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.msRequestAnimationFrame ||
					   window.oRequestAnimationFrame;
var totalEnemies = 0;
var enemies = [];
var score = 0;
var spawnAmount = 5;

var soundEfx; // Sound Efx
var soundLoad = "Music/laser.wav"; //Game Over sound efx


var imgSprite = new Image();
imgSprite.src = 'Art/sprite.png';
imgSprite.addEventListener('load',init,false);

// End of declarations


// main functions

function init() {
	spawnEnemy(spawnAmount);
	drawMenu();
	document.addEventListener('click', mouseClicked, false);
}


function playGame() {
	drawBg();
    soundEfx = document.getElementById("soundEfx");
    soundEfx.play();
    soundEfx = document.getElementById("music");
    soundEfx.play();
    startLoop();
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);
}
function spawnEnemy(number) {
	for(var i = 0; i < number; i++) {
		enemies[enemies.length] = new Enemy();
		
	}
}

function drawAllEnemies() {
	clearCtxEnemy();


    if(score >=10 && enemies.length < 10) {

    spawnAmount = 1;
    bear1.speed = 3;
    }
    if(score >=20 && enemies.length < 20) {
        spawnAmount = 1;
        spawnEnemy(spawnAmount);
        bear1.level++;
        bear1.speed = 6;
    for(var i=0; i < enemies.length; i++) {
            enemies[i].speed = 5;
        }

    }
    if(score >=30) {
        bear1.level++;
    spawnAmount = 20;

    }
    if(score >=40) {
        bear1.level++;
    spawnAmount = 25;
    }
	for(var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
	}
}

function loop() {
		if(isPlaying) {
			bear1.draw();
			drawAllEnemies();
			requestAnimFrame(loop)
		}	
	}


function startLoop() {
	isPlaying = true;
	loop();
}

function stopLoop() {
	isPlaying = false;
}

function drawMenu() {
	ctxBg.drawImage(imgSprite,0,696,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}
function drawBg() {
	ctxBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}

function clearCtxBg() {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
}



// Bear functions
function Bear() {

    // stats
    this.health = 100;
    this.name = "Player";
    this.level = 1;
    this.xp = 0;

    //object
    this.srcX = 0;
    this.srcY = 510;
    this.width = 100;
    this.height = 70;
    this.drawX = 20;
    this.drawY = 400;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 38;

    // speed
    this.speed = 2;

    // controls
    this.isUpKey = false;
    this.isRightKey = false;
    this.isLeftKey = false;
    this.isDownKey = false;
    this.isSpacebar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for(var i = 0; i < 25; i++) {
        this.bullets[this.bullets.length] = new Bullet();
    }




}

Bear.prototype.draw = function () {
	clearCtxBear();
    this.checkCollision();
	this.checkDirection();
    drawHUD();
    this.noseX = this.drawX + 100;
	this.noseY = this.drawY + 38;
	this.checkShooting();
	this.drawAllBullets();
	ctxBear.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);

};

Bear.prototype.checkDirection = function () {
	if(this.isUpKey) {
		this.drawY -= this.speed;bear1
	}
	if(this.isRightKey) {
		clearCtxBear();
		this.srcx = 0;
		this.srcY = 510;
			ctxBear.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);


	this.drawX += this.speed;
}
	if(this.isDownKey) {
	this.drawY += this.speed;
}
	if(this.isLeftKey) {
		clearCtxBear();	
		this.srcx = 0;
		this.srcY = 580;		
		ctxBear.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);

	this.drawX -= this.speed;
}

};

Bear.prototype.drawAllBullets = function() {
    soundEfx = document.getElementById("soundExplode");

    for(var i = 0; i < this.bullets.length; i++) {
		if(this.bullets[i].drawX >= 0) this.bullets[i].draw();
		if(this.bullets[i].explosion.hasHit) {
            this.bullets[i].explosion.draw();
            soundEfx.play();
        }

	}
}

Bear.prototype.checkShooting = function() {
    soundEfx = document.getElementById("soundLaser");

    if(this.isSpacebar && !this.isShooting) {
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
		this.currentBullet++;
        soundEfx.load("Music/laser.wav");
        soundEfx.play();
		if(this.currentBullet >= this.bullets.length) this.currentBullet = 0;
	} else if(!this.isSpacebar){
		this.isShooting = false;	
	}
}

Bear.prototype.checkCollision = function() {
        clearCtxHUD();
        drawBg();
        var damage = 1;
        var loop = 10;

    if(this.health <= 0){
            clearCtxBg();
            clearCtxEnemy()
            clearCtxHUD();
            soundEfx = document.getElementById("soundBearDead");

            var ending = Math.floor(Math.random() * 10);
            if(ending < 5) {
                window.location.href = "http://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }
            if(ending >=5 && ending <=7) {
                ctxBg.fillText("You let the Space bear die! If I were to have hands, I would be face palming right now. Jerk.", 100,250);
                soundEfx = document.getElementById("soundBearDead2");
            }if(ending >7 && ending <=10) {
                ctxBg.fillText("What the fuck?! He had laz0rs and you still died.", 100,250);
                soundEfx = document.getElementById("soundBearDead");
            }

            ctxBg.fillStyle = "red";
            ctxBg.font = "bold 56px Arial";
            ctxBg.fillText("Spacebear is DEAD!! ", 100, 200);
            ctxBg.font = "bold 23px Arial";

            soundEfx.play();
            stopLoop();
            music.pause();
        }
        for(var i = 0; i < enemies.length; i++) {
            if(this.drawX + this.width/2 >= enemies[i].drawX &&
                this.drawY + this.height/2 >= enemies[i].drawY &&
                this.drawX <= enemies[i].drawX + enemies[i].width &&
                this.drawY <= enemies[i].drawY + enemies[i].height

                ) {

                for(var j=0; j < loop; j++ ) {
                    bear1.health = bear1.health - damage;

                }
                enemies[i].explosion.drawX = enemies[i].drawX - (enemies[i].explosion.width/2);
                enemies[i].explosion.drawY = enemies[i].drawY;
                enemies[i].explosion.draw();
                soundEfx = document.getElementById("soundBearHit");
                soundEfx.play();

                enemies[i].recycleEnemy();

        }
    }

}

function drawHUD() {
    ctxHUD.fillStyle = "red";
    ctxHUD.font = "bold 16px Arial";
    ctxHUD.fillText("Score: " + score, 10, 30);
    ctxHUD.fillText("Health: " + bear1.health, 10, 50);
    ctxHUD.fillText("Bear X: " + bear1.drawX, 10, 70);
    ctxHUD.fillText("Bear Y: " + bear1.drawY , 10, 90);
    ctxHUD.fillText("Bear W: " + bear1.width, 10, 110);
    ctxHUD.fillText("Bear H: " + bear1.height, 10, 130);



}
function clearCtxHUD() {
    ctxHUD.clearRect(0,0,gameWidth,gameHeight);
}
function clearCtxBear() {
	ctxBear.clearRect(0,0,gameWidth,gameHeight);
}

//End of bear functions


// Bullet Functions

function Bullet() {
	this.srcX = 100;
	this.srcY = 510;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 5;
	this.height = 5;
	this.explosion = new Explosion();
}


Bullet.prototype.draw = function () {
	this.drawX += 3;
	ctxBear.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitEnemy();
	if(this.drawX > gameWidth) this.recycle();

};

Bullet.prototype.fire = function (startX, startY) {
	this.drawX = startX;
	this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function() {
	for(var i = 0; i < enemies.length; i++) {
		if(this.drawX >= enemies[i].drawX && 
			this.drawX <= enemies[i].drawX + enemies[i].width &&
			this.drawY >= enemies[i].drawY &&
			this.drawY <= enemies[i].drawY + enemies[i].height) {
				this.explosion.drawX = enemies[i].drawX - (this.explosion.width/2);
				this.explosion.drawY = enemies[i].drawY;
				this.explosion.hasHit = true;
				this.recycle();
				enemies[i].recycleEnemy();
                score++;
		}
	}
}

Bullet.prototype.recycle = function() {
	this.drawX = -20;
}


// End of bullet functions

// Explosion functions

function Explosion() {
	this.srcX = 715;
	this.srcY = 510;
	this.drawX = 0;
	this.drawY = 0;
	this.width = 84;
	this.height = 70;
	this.hasHit = false;
	this.currentFrame = 0;
	this.totalFrames = 10;
}

Explosion.prototype.draw = function () {
	if (this.currentFrame <= this.totalFrames) {
		ctxBear.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.currentFrame++;
	} else {
		this.hasHit = false;
		this.currentFrame = 0;
	}

};
// end explosion functions


// Enemy Functions
function Enemy() {
	this.srcX = 0;
	this.srcY = 650;
	this.width = 59;
	this.height = 46;
	this.speed = 3;
	this.drawX = Math.floor(Math.random() * 1000)+ gameWidth;
	this.drawY = Math.floor(Math.random() * 500);
    this.explosion = new Explosion();

}

Enemy.prototype.draw = function () {
	this.drawX -= this.speed;
	ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
};

Enemy.prototype.checkEscaped = function () {
	if(this.drawX + this.width <= 0) {
		this.recycleEnemy();
	}

};

Enemy.prototype.recycleEnemy = function () {
	this.drawX = Math.floor(Math.random() * 1000)+ gameWidth;
	this.drawY = Math.floor(Math.random() * 430);
};
function clearCtxEnemy() {
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

// End of Enemy functions

// button object

function Button(xL, xR, yT, yB) {
	this.xLeft =  xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
}

Button.prototype.checkClicked = function () {
	if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};
// end of button objects
// event functions

function mouseClicked(e) {
	mouseX = e.pageX - canvasBg.offsetLeft;
	mouseY = e.pageY - canvasBg.offsetTop;
	if(btnPlay.checkClicked() && isPlaying=== false){
		playGame();
		isPlaying==true;
	}
}

function checkKeyDown(e) {
	//Gets key from all browsers to be fully compliant.
	var keyID = e.keyCode || e.which;
	if(keyID === 38 || keyID === 87) { // UP ARROW = 38 | W = 87
		bear1.isUpKey = true;
		e.preventDefault();
	}
	if(keyID === 39 || keyID === 68) { // RIGHT ARROW = 39 | D = 68
		bear1.isRightKey = true;
		e.preventDefault();
	}
	if(keyID === 40 || keyID === 83) { // DOWN ARROW = 40 | S = 83
		bear1.isDownKey = true;
		e.preventDefault();
	}
	if(keyID === 47 || keyID === 65) { // LEFT ARROW = 47 | A = 65
		bear1.isLeftKey = true;
		e.preventDefault();
	}
	if(keyID === 32) { // Spacebar
		bear1.isSpacebar = true;
		e.preventDefault();
	}
}

function checkKeyUp(e) {
	//Gets key from all browsers to be fully compliant.
	var keyID = e.keyCode || e.which;
	if(keyID === 38 || keyID === 87) { // UP ARROW = 38 | W = 87
		bear1.isUpKey = false;
		e.preventDefault();
	}
	if(keyID === 39 || keyID === 68) { // RIGHT ARROW = 39 | D = 68
		bear1.isRightKey = false;
		e.preventDefault();
	}
	if(keyID === 40 || keyID === 83) { // DOWN ARROW = 40 | S = 83
		bear1.isDownKey = false;
		e.preventDefault();
	}
	if(keyID === 47 || keyID === 65) { // LEFT ARROW = 47 | A = 65
		bear1.isLeftKey = false;
		e.preventDefault();
	}
	if(keyID === 32) { // Spacebar
		bear1.isSpacebar = false;
		e.preventDefault();
	}
}