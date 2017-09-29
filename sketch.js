
var batImg;

var canvasW = screen.width;
var canvasH = screen.height-200;

//audio variables
var mic;
var meterLeft;
var meterRight;
var maxLeft = -120;
var maxRight = -120;
var context;
var splitter;
var ballSpeed = 7;
var score = {
  left: 0,
  right: 0
}
var gotHitAt = 0;

var countdown = 120;

var playerLeftY = 0, playerRightY = 0;
var play = false;
//delete this one
var micLevel = 0;

function preload() {
  bat1Img = loadImage("bat1.png");
  bat2Img = loadImage("bat2.png");
  grassImg = loadImage("grass.jpg");
}

function setup() {

  //console.log(navigator.mediaDevices.enumerateDevices());

  createCanvas(canvasW, canvasH);
  bat1 = new Bat(50,100,2, bat1Img)
  bat2 = new Bat(canvasW -190,100,2,bat2Img)
  ball = new Ball(canvasW/2,canvasH/2,ballSpeed, ballSpeed);

  background("#9fdc63");
  bat1.draw();
  bat2.draw();
  ball.draw();


  //uncomment this in order to see the available audio devices on console
  // Tone.UserMedia.enumerateDevices().then(function(devices){
  // 	console.log(devices)
  // });

  mic = new Tone.UserMedia();
  mic.open(2);
  mic.toMaster();

  meterLeft = new Tone.Meter(0.8);
  meterRight = new Tone.Meter(0.8);

  //connect left mic to left meter
  //mic.connect(meterLeft, 0);
  //connect right mic to right meter
  //mic.connect(meterRight, 1);

  //retrieve audio context
  context = Tone.context;

  //splitter for separating left and right
  splitter = context.createChannelSplitter();

  //connect the mics to the interface
  mic.connect(splitter);

  //connect each output of the splitter to a different meter
  //to measure the audio from each mic in decibels
  splitter.connect(meterLeft, 0);
  splitter.connect(meterRight, 1);

}

function draw() {
  if(play) {
    if (meterLeft.getLevel() > maxLeft) {
      // maxLeft = meterLeft.getLevel();
      // console.log("left: " + meterLeft.getLevel());
      playerLeftY = map(meterLeft.getLevel(),-40,-18,canvasH,0);
      playerLeftY = constrain(playerLeftY,0, canvasH);
    }

    if (meterRight.getLevel() > maxRight) {
      // maxRight = meterRight.getLevel();
      // console.log("right: " + meterRight.getLevel());
      playerRightY = map(meterRight.getLevel(),-40,-18,canvasH,0);
      playerRightY = constrain(playerRightY,0, canvasH);
    }

    //now maxLeft and maxRight are the audio levels yay
    //they are in decibels, so they go from -infinite (no volume)
    //to maximum volume (0), you can map them if you want


  	background("#9fdc63");
    // image(grassImg,0,0,canvasW,canvasH);

    checkCollision(ball,bat1);
    checkCollision(ball,bat2);

    bat1.moveUpTo(playerLeftY);
    bat1.draw();

    bat2.moveUpTo(playerRightY);
    bat2.draw();

    ball.move();
    ball.draw();

    playerScore();
    countDown();
    endGame();
  }
}

function Bat(x,y, speed,img) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.width = 150;
  this.height =140;
  this.draw = function() {
    image(img,this.x,this.y, this.width,this.height);
  };
  this.move = function() {
    this.y = this.y + this.speed;
    if(this.y<0 ||this.y>canvasH) {
      this.speed = 0 - this.speed;
    }
  };
  this.moveUpTo = function(yPos) {
    tempy = parseInt(yPos*0.3 +this.y*0.7);
    this.y = tempy ;
    // this.y=mouseY;
  };
}

function Ball(x,y,speedX, speedY) {
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.draw = function() {
    noStroke();
    fill("#32353b");
    ellipse(this.x, this.y, 30,30);
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
    if(frameCount-gotHitAt > 10) {
      ball.hit();
      gotHitAt = frameCount;
    }

    return true;
  }

}


function playerScore() {
  if(ball.x < 0) {
    score.right++;
    document.getElementById("score-right").innerHTML = score.right;
  }
  if(ball.x > canvasW) {
    score.left++;
    document.getElementById("score-left").innerHTML = score.left;

  }

}

function resetGame() {
  $(".endgame").hide();
  play = false;
  countdown = 120;
  background
  score.left = 0;
  score.right = 0;
  document.getElementById("score-left").innerHTML = score.left;
  document.getElementById("score-right").innerHTML = score.right;
  ball.x = canvasW/2;
  ball.y = canvasH/2;

  bat1.y = 100;
  bat2.y = canvasW - 190;
  background("#9fdc63");
  bat1.draw();
  bat2.draw();
  ball.draw();
}

function startGame() {
  play = true;
}

function countDown() {
  if(frameCount%60 == 0){
    countdown= countdown - 1;
    timedisp = parseInt(countdown/60) + ":" + (countdown%60);
    document.getElementById("time").innerHTML = timedisp;
  }
}

function endGame() {
  if(countdown == 0) {
    $(".endgame").show();
    play = false;
    if(score.left>score.right) {
      document.getElementById("result").innerHTML = "Player 1 Wins";
    }
    else if(score.left<score.right) {
      document.getElementById("result").innerHTML = "Player 2 Wins";
    }
    else if(score.left==score.right) {
      document.getElementById("result").innerHTML = "It's a tie";
    }
  }

}
