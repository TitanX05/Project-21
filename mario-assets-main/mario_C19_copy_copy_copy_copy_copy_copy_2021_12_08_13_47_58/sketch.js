var mario, mario_running, mario_collided, backgroundr, backgroundr_image, ground2, coin, coin_image
, o, o1, o2, o3, r, score = 0, PLAY = 1, END = 0, gameState = PLAY;
var oGroup, coinGroup;
var gameOver, restart, gameOverImage, restartImage;
var coinS;
var score = 0;

function preload() {
  mario_running = loadAnimation("Capture1.png", "Capture3.png", "Capture4.png");
  backgroundr_image = loadImage("backg.jpg");
  coin_image = loadImage("coin.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  mario_collided = loadAnimation('mariodead.png');
  coinS = loadSound("coin.wav");
}

function setup() {
  createCanvas(600, 200);


  mario = createSprite(50, 180, 10, 40);
  mario.addAnimation("run", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.visible = true;
  mario.scale = 0.5;
 
  backgroundr = createSprite(300, 100, 600, 20);
  backgroundr.addImage("g", backgroundr_image);
  backgroundr.scale = 0.4;
 
  ground2 = createSprite(50, 207, 200, 20);
  ground2.visible = false;

  gameOver = createSprite(300, 80, 10, 10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(300, 120, 10, 10);
  restart.addImage(restartImage);
  restart.scale = 0.5;

  oGroup = new Group();
  coinGroup = new Group();

  mario.debug = false;

  score = 0
}

function draw() {
  background("white");
  
  mario.visible = true;

  text("Score = " + score, 500, 50);
  text(mouseX + "," + mouseY, mouseX, mouseY);

  if (gameState === PLAY) {
    
    mario.changeAnimation("run", mario_running); 

    gameOver.visible = false;
    restart.visible = false;

    score = score + Math.round(getFrameRate() / 60);

    if (keyDown("SPACE") && mario.y > 160) {
      mario.velocityY = -13;
      coinS.play();
    }


    mario.velocityY += 0.8;


    o_spawn();
    spawnCoins();

    if (oGroup.isTouching(mario)) {
      gameState = END;
    }

  } else {
    if (gameState === END) {
      mario.changeAnimation("collided", mario_collided);
      mario.velocityY = 0;
      mario.scale = 0.35
      oGroup.setVelocityXEach(0);
      coinGroup.setVelocityXEach(0);
      gameOver.visible = true;
      restart.visible = true;
      coinGroup.setLifetimeEach(-1);
      oGroup.setLifetimeEach(-1);
      if (mousePressedOver(restart)){
        reset();
      }
    }
  }

  mario.collide(ground2);

  drawSprites();
}

function spawnCoins() {
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coin_image);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
}

function o_spawn() {
  if(frameCount % 60 === 0) {
    var o = createSprite(600,165,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: o.addImage(o2);
              break;
      case 2: o.addImage(o1);
              break;
      case 3: o.addImage(o3);
              break;
    }
        
    o.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    o.scale = 0.2;
    o.lifetime = 300;
    //add each obstacle to the group
    oGroup.add(o);
  }
}

function reset() {
  mario.changeAnimation("run", mario_running); 
  gameState = PLAY;
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  oGroup.destroyEach();
  coinGroup.destroyEach();
  mario.visible = true;
}