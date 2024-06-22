let size = 230;

let out = [];
let angle = 0;
let rotationSpeed = 0;
let acceleration = 0.07;
let a = 0;
let b = 0;
let c = 1;
let frameTime = 0;
let img;

function preload() {
    img = loadImage("logo.png");
}

function setup() {
	createCanvas(1280, 720);
	angleMode(DEGREES);
	rectMode(CENTER);
	shape = new Shape(size);
	out[b] = new Outside(size);
	stroke(255);
}

function draw() {
	//background(0);
	background('darkblue');

	push();
	
	translate(width / 2, height / 2);
  
// Rotate the entire canvas
	angle += rotationSpeed;
	rotationSpeed += sin(a)*acceleration;
	a += 4;

	if (frameTime >= 60*c) {
		if (b > 20) {b = 0}
		b += 1;
		out[b] = new Outside(size);
		console.log(b);
		c += 1;
	}

	frameTime += 1;

// Draw the triangle
	shape.triangleDraw();

// Draw the Outside
	for (let i = 0; i <= b; i++) {
		out[i].outDraw();
		out[i].outRotate();
	}
	pop();

	image(img, 0, 0, 100, 100);
}


class Shape {
	constructor(Size) {
		this.size = size;
		this.out = size/2;
		this.in = size/2;
		this.angle = 0;
		this.rotationSpeed = 0;
		this.a = 0;


		this.y = -200;
	}
	

	triangleDraw() {
		this.angle += this.rotationSpeed;
		this.rotationSpeed += sin(this.a) * acceleration;
		this.a += 4;

		push();
		rotate(this.angle);
		fill(255);
		triangle(-500, 1000 - this.y, 500, 1000 - this.y, 0, 0 - this.y);

		fill('darkblue');
		triangle(-500, -1500 + this.y, 500, -1500 + this.y, 0, -500 + this.y);
	
		fill(255);
		triangle(-500, 2000 - this.y, 500, 2000 - this.y, 0, 1000 - this.y);

		fill('darkblue');
		triangle(-500, -2500 + this.y, 500, -2500 + this.y, 0, -1500 + this.y);

		this.y += 5;

		if (this.y == 1850) {this.y = -200;}
		pop();

	}
}

class Outside {
	constructor(Size) {
	this.in = size/2;
	this.out = size/2;
	this.y = 0;

	this.angle = 0;
	this.rotationSpeed = 0;
	this.a = 0;
	}

	outDraw() {
		push();
		rotate(this.angle);

		fill('#4124FF');
		quad(this.in, this.in, -this.in, this.in, -this.out, this.out, this.out, this.out);
		quad(this.in, -this.in, -this.in, -this.in, -this.out, -this.out, this.out, -this.out);
	
		fill('#FF3486');
		quad(this.in, this.in, this.in, -this.in, this.out, -this.out, this.out, this.out);
		quad(-this.in, this.in, -this.in, -this.in, -this.out, -this.out, -this.out, this.out);
			
		this.out += 5;

		fill(255);
		pop();
	
	}

	outRotate() {
		this.angle += this.rotationSpeed;
		this.rotationSpeed += sin(this.a) * acceleration;
		this.a += 4;
	}
}
