let roadImage;
let roadY = 0;
let speed = 5;
const maxSpeed = 10;
const minSpeed = 2;
const speedIncrement = 0.01;

let playerCar;
let opponentCar;
let obstacles = [];
let lanes;
let lastMoveTime = 0;
const moveInterval = 5000;

let obstacleImage;
let playerImage;
let opponentImage;
let logo;

let startTime;
const gameDuration = 4 * 60 * 1000;

let gameState = 'startScreen';
let startButton;
let restartButton;

let bgMusic1;

function preload() {
	roadImage = loadImage('Roadtest3.png');
	obstacleImage = loadImage('Obstacle.png');
	playerImage = loadImage('Player.png');
	opponentImage = loadImage('Opponent.png');
	bgMusic1 = loadSound('Deja Vu.mp3');
	logo = loadImage('logo.png');
}

function setup() {
	createCanvas(1280, 720);
	frameRate(60);
	playerCar = new PlayerCar(width / 2, height - 100);

	for (let i = 0; i < 3; i++) {
		obstacles.push(new Obstacle(random(lanes), random(-height, -50)));
	}

	opponentCar = new OpponentCar(width / 2, -50);

	startButton = createButton('Start Game');
	startButton.position(width / 2 - 100, height / 2);
	startButton.style('width', '200px');
	startButton.style('height', '50px');
	startButton.style('font-size', '20px');
	startButton.mousePressed(startGame);
	
	restartButton = createButton('Restart Game');
	restartButton.position(width / 2 - 50, height / 2 + 100);
	restartButton.style('width', '80px');
	restartButton.style('height', '40px');
	restartButton.style('font-size', '15px');
	restartButton.mousePressed(restartGame);
	restartButton.hide();
}

function draw() {
	if (gameState === 'startScreen') {
		displayStartScreen();
	} else if (gameState === 'playing') {
		playGame();
		displayCountdown();
	}
}

function keyPressed() {
	if (gameState = 'playing') {
		if (key === 'm' || key === 'M') {
			bgMusic1.pause();
		}
		if (key === 'n' || key === 'N') {
			bgMusic1.play();
		}
	}
}

function displayStartScreen() {
	background(0);
	image(logo, 0, 0, 100, 100);
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(42);
	text('Battle Out Run', width / 2, height / 2 - 50);
	textSize(25);
  	text('Gameplay: Control the Police Car Left and Right to chase the Red Car', width / 2, height / 2 + 250);
	text('Left Arrow = Left   Right Arrow = Right', width / 2, height / 2 + 300);

	startButton.show();
}

function startGame() {
	gameState = 'playing';
	startButton.hide();
	restartButton.hide();
	startTime = millis();
	bgMusic1.loop();
	loop();
}

function restartGame() {
	gameState = 'startScreen';
	restartButton.hide();
	speed = 5;
	playerCar = new PlayerCar(width / 2, height - 100);
	opponentCar = new OpponentCar(width / 2, -50);
	obstacles = [];
	for (let i = 0; i < 3; i++) {
		obstacles.push(new Obstacle(random(lanes), random(-height, -50)));
	}
	loop();
}


function playGame() {
	background(0);

	roadY += speed;
	if (roadY >= height) {
		roadY = 0;
	}

	image(roadImage, 0, roadY - height, width, height);
	image(roadImage, 0, roadY, width, height);

	image(logo, 20, 0, 100, 100);

	playerCar.update();
	playerCar.display();

	opponentCar.update();
	opponentCar.display();

	// Update and display obstacles
	for (let obstacle of obstacles) {
		obstacle.update();
		obstacle.display();
	}

	for (let obstacle of obstacles) {
		if (playerCar.hits(obstacle)) {
			// Handle collision: decrease speed and move opponent car up
			speed = max(minSpeed, speed - 2);
			opponentCar.moveUp();
		}
	}
	if (playerCar.hits(opponentCar)) {
			displayVictoryScreen();
			noLoop();
		}

		speed = min(maxSpeed, speed + speedIncrement);

		if (millis() - startTime > gameDuration) {
			displayGameOverScreen();
			noLoop();
		}
	// Move opponent car down every 5 seconds
	if (millis() - lastMoveTime > moveInterval) {
		opponentCar.moveDown();
		lastMoveTime = millis();
	}
}

function displayCountdown() {
	let remainingTime = gameDuration - (millis() - startTime);
	if (remainingTime <= 0) {remainingTime = 0}
	let minutes = floor(remainingTime / 60000);	
	let seconds = floor((remainingTime % 60000) / 1000);

	fill('red');
	textSize(32);
	textAlign(CENTER, CENTER);
	text(`${nf(minutes,2)}:${nf(seconds,2)}`, width / 2, 50);
}

function displayVictoryScreen() {
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(50);
	text('Victory!', width / 2, height / 2 - 50);
	bgMusic1.stop();
	restartButton.show();
}

function displayGameOverScreen() {
	fill('green');
	textAlign(CENTER, CENTER);
	textSize(72);
	//text("Game Over! Time's up!", width / 2, height / 2 - 50);
	text("Game Over!", width / 2, height / 2 - 50);
	textSize(50);
	text("Time's up!", width / 2, height / 2 + 50);
	bgMusic1.stop();
	restartButton.show();
}

class PlayerCar {
	constructor(x, y) {
		this.x = x;
		this.y = y - 80;
		this.width = 80;
		this.height = 150;
		this.speed = 5;
	}

	update() {
		//Control Left and Right
		if (keyIsDown(LEFT_ARROW) && this.x > this.width / 2) {
		this.x -= this.speed; // Move left
		}
		if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width / 2) {
			this.x += this.speed; // Move right
		}
	}

	display() {
		image(playerImage, this.x, this.y, this.width, this.height);
	}

	hits(obstacle) {
		let collision =
			this.x < obstacle.x + obstacle.width &&
			this.x + this.width > obstacle.x &&
			this.y < obstacle.y + obstacle.height &&
			this.y + this.height > obstacle.y;
		return collision;
	}
}

class OpponentCar {
	constructor(x, y) {
		this.x = x;
 		this.y = y;
		this.width = 75;
		this.height = 140;
		this.noiseOffset = random(1000);
	}

	moveDown() {
		if (this.y + this.height < height) {
			this.y += 50; // Move down by 50 pixels
		}
	}

	moveUp() {
		if (this.y > 0) {
			this.y -= 40;
		}
}

	update() {
		let noiseValue = noise(this.noiseOffset);
		this.x = map(noiseValue, 0, 1, this.width / 2, width - this.width / 2);
		this.noiseOffset += 0.01; 
	}

	display() {
		image(opponentImage, this.x, this.y, this.width, this.height);
	}
}

class Obstacle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 80;
		this.height = 150; 
		this.speed = speed; // Same with background
		this.noiseOffset = random(1000); 
	}

	update() {
		this.y += speed;

		let noiseValue = noise(this.noiseOffset);
		this.x = map(noiseValue, 0, 1, this.width / 2, width - this.width / 2);
		this.noiseOffset += 0.001;

		if (this.y > height) {
			this.y = random(-height, -50);
			this.x = random(lanes);

			for (let obstacle of obstacles) {
				if (obstacle !== this && this.hits(obstacle)) {
					this.y = random(-height, -50);
					this.x = random(lanes);
				}
			}
		}
	}

	display() {
		image(obstacleImage, this.x, this.y, this.width, this.height);
	}

	hits(other) {
		return (
			this.x < other.x + other.width &&
			this.x + this.width > other.x &&
			this.y < other.y + other.height &&
			this.y + this.height > other.y
		);
	}
}