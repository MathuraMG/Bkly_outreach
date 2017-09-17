var mic;
var batImg;
var canvasH = 600;
var canvasW = 1000;
var batLeft = {
  x: 10,
  y:100,
  w:10,
  h:20
}

function Bat(x,y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.width = 30;
  this.height = 60;
  this.draw = function() {
    image(batImg,this.x,this.y, this.width,this.height);
  };
  this.move = function() {
    this.y = this.y + this.speed;
    if(this.y<0 ||this.y>canvasH) {
      this.speed = 0 - this.speed;
    }
  };
  this.moveUpTo = function(yPos) {
    this.y = yPos;
  };
}

function Ball(x,y,speedX, speedY) {
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.draw = function() {
    ellipse(this.x, this.y, 10,10);
  }
  this.move = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.y<0 ||this.y>canvasH) {
      this.speedY = 0 - this.speedY;
    }
    if(this.x<0 ||this.x>canvasW) {
      this.speedX = 0 - this.speedX;
    }
  }
  this.hit = function() {
    this.speedY = 0 - this.speedY;
    this.speedX = 0 - this.speedX;
  }
}

function checkCollision(ball,bat) {
  if(ball.x>bat.x &&ball.x<bat.x+bat.width && ball.y>bat.y &&ball.y<bat.y+bat.height) {
    // console.log("kaboom");
    ball.hit();
    return true;
  }
}

function preload() {
  batImg = loadImage("bat.png");
  grassImg = loadImage("grass.jpg");
}

function setup() {

  console.log(navigator.mediaDevices.enumerateDevices());

  createCanvas(canvasW, canvasH);
  bat1 = new Bat(50,100,2)
  bat2 = new Bat(canvasW -80,100,2)
  ball = new Ball(20,20,7,7);

  mic = new p5.AudioIn()
  mic.start();
}

function draw() {
	background(220);
  image(grassImg,0,0,canvasW,canvasH);
  // mic.setSource(1);
  micLevel = mic.getLevel();

  checkCollision(ball,bat1);
  checkCollision(ball,bat2);

  bat1.moveUpTo(constrain(canvasH-micLevel*canvasH*5, 0, canvasH));
  bat1.draw();

  bat2.move();
  bat2.draw();

  ball.move();
  ball.draw();



}
