class Game{
    constructor(){

        if(keyIsDown(38) && mario.y >= 139) {
            Yvel+=0.9;
            if(keyIsDown(37)){
                xVel -= 0.2;
            }
            if(keyIsDown(39)){
                xVel += 0.2;
            }else if(keyIsDown(38)){
                yVel -= 0.1;
                xVel *= 0.9;
            }else{
                yVel *= 0.985;
                xVel *= 0.985;
            }
          }
    }
    drawSprites();
}