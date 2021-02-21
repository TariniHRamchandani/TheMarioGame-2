var PLAY = 1;
var END = 0;
var gameState = PLAY;
var Yvel;
var Xvel;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var life=3;
var bellsound;
var gameOver, restart;
let cam;
localStorage["HighestScore"] = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  Yvel=0
  Xvel=0;
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bellsound=loadSound("bell.mp3");
  cam=createCamera();
  cam.pan(0.8);
}

function setup() {
  createCanvas(600, 200);
  mario = createSprite(50,180,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  life=3;
}

function draw() {
  createCanvas(displayWidth , displayHeight);
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
 text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
  // score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
    for(var i=0;i<coinGroup.length;i++){
     if( coinGroup.get(i).isTouching(mario)){
       score=score+1;
       coinGroup.get(i).destroy();
       bellsound.play();
     }
    }
    
    
  
    if(keyDown("space") && mario.y >= 139) {
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);
    
    spawnCoin();
    spawnObstacles();
    
  for(var i=0;i<obstaclesGroup.length;i++){
     if( obstaclesGroup.get(i).isTouching(mario)){
       life=life-1;
       obstaclesGroup.get(i).destroy();
     }
    }
    if(life==0){
      gameState= END;
    }
    
   //if(obstaclesGroup.isTouching(mario)){
     //life=life-1;
        //gameState = END;
   // } 
    
   
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  cam.pan(mario);
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
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

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  life=3;
  
}