//Define screen dimensions(Canvas).
var width = 300; // Must be fixed to avoid distortion.
var height = screen.height-200;
var firstX=0;
var firstY=0;
var request_animation;
var qs =window.location.href;
var arr=qs.split("?");
var sound_flag=getSound();
//initial length of snake
var snakeLength = 11;
var snakeCircles = [];
var graphics;
//var xrendercoin=0;
var AddObject=true;
var outOverlap=0;
//defining new canvas
var app = new PIXI.Application({
  width, 
  height,
  antialias:true,
  transparent:true
});
/*if(sound_flag=="false") setSound("false");
else setSound("true");*/
// get a reference to the canvas and its context
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.style.position = 'absolute';
canvas.width = 310;
canvas.height = 570;
document.getElementById("myDiv").appendChild(canvas);


document.getElementById("myDiv").appendChild(app.view);

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

//start position of snake at middle of the screen
var xStart = app.screen.width / 2;
var yStart = app.screen.height / 1.5; 

//the current values of snake at any time which will change with mouse movement 
var xCurrent = xStart;
var yCurrent = yStart;

//creating an object of snake body
var basicText;

// newly spawned objects start at Y=0
var spawnLineY = 0;
// spawn a new object every 1500ms
var spawnRate = 1500;
// set how fast the objects will fall
var spawnRateOfDescent = 1.0;
// when was the last object spawned
var lastSpawn = -1;
// when was the last 6 object spawned
var lastSpawn2 = -1;
//Rate of genert 6 element every 30000ms 
var Rate = 30000;
// this array holds all spawned object
var objects = [];
//flag for check overlap
var check = false;
//last 6 objects flage 
var lastObj=0;
var count=0;
var numCoins = 10;
var score = 0;
var coins = [];
var coinI=0;
var inCoin=false;
drawSnake();
animate();
///////////////////coins function////////////////
///////////////////coins function////////////////
function spawnCoin () {
    var coinImg;
    // Create sprite sheet
    coinImg = new Image();
    coinImg.src = "images/coin-sprite-animation.png";  
    //coinIndex = coins.length;
    // Create sprite
    return sprite({
      context: canvas.getContext("2d"),
      width: 300,
      height: 30,
      image: coinImg,
      numberOfFrames: 10,
      ticksPerFrame: 5
    });
    
  /*  coins[coinIndex].x = Math.random() * (canvas.width - coins[coinIndex].getFrameWidth() * coins[coinIndex].scaleRatio);*/
    //coins[coinIndex].y = 0;/*Math.random() * (canvas.height - coins[coinIndex].height * coins[coinIndex].scaleRatio);*/
    
   // coins[coinIndex].scaleRatio =0.8; /*Math.random() * 0.5 + 0.5;*/
    // Load sprite sheet
    
  }
 
  function sprite (options) {
  
    var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = options.ticksPerFrame || 0,
    numberOfFrames = options.numberOfFrames || 1;
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;    
    that.y = 0;
    that.type="coin";
    that.appear=1;
    that.image = options.image;
    that.scaleRatio = 0.8;
    that.heightCheck=that.height*that.scaleRatio;
    that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

        tickCount = 0;
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 1) {  
                    // Go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
            //alert("in update");
        };
    that.render = function () {

      // Draw the animation
      that.context.drawImage(
        that.image,
        frameIndex * that.width / numberOfFrames,
        0,
        that.width / numberOfFrames,
        that.height,
        that.x,
        that.y,
        that.width / numberOfFrames * that.scaleRatio,
        that.height * that.scaleRatio);
          //alert("in render");   
         };
    
    that.getFrameWidth = function () {
      return that.width / numberOfFrames;
    };
    that.x = Math.random() * (canvas.width - that.getFrameWidth() * that.scaleRatio);
    that.widthCheck=that.getFrameWidth()*that.scaleRatio;
    
    return that;
  }
//display the length of the snake above its head
function showSnakeLength() {
  //first creating the text style
  var style = new PIXI.TextStyle({
    fontFamily: 'Verdana',
    fontWeight: 'lighter',
    fontSize: 15,
    fill: '#ffffff',
    stroke: '#000000',
  });

  //second creating text
  basicText = new PIXI.Text(snakeCircles.length, style);
  basicText.x = firstX - 5;
  basicText.y = firstY - 10;

  if (snakeCircles.length > 9) {
    basicText.x = firstX - 9;
  }
  app.stage.addChild(basicText);
}


  //draw body of snake in graphics object
  function drawSnake() {

firstX=xCurrent;
firstY=yCurrent;
  for (var i = 0; i < snakeLength; i++) {
    graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawCircle(xCurrent, yCurrent+=16, 8);
    graphics.endFill();
    app.stage.addChild(graphics);
    snakeCircles.push(graphics);
  }

  //calling showSnakeLength() to display snake length
  showSnakeLength(snakeCircles.length);
}

function redrawSnake(myAdd) {
  let newLength = snakeCircles.length + myAdd;
  let localY, localX;
  for (var i = 0; i < snakeCircles.length; i++) {
    app.stage.removeChild(snakeCircles[i]);
  }

  snakeCircles = [];

  for (var i = 0; i < newLength; i++) {
    graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawCircle(firstX, firstY+=16, 8);
    graphics.endFill();
    app.stage.addChild(graphics);
    snakeCircles.push(graphics);
    if (i==0) {
      localY = firstY - 20;
      localX = firstX; 
    }
  }
  firstY = localY;
  firstX = localX;
}

function decreaseSnake() {
    app.stage.removeChild(snakeCircles[snakeCircles.length - 1]);
    snakeCircles.splice(snakeCircles.length-1, 1);
}

function gameLoop(direction){
  if(direction==='+'){
    if(firstX <= width-20){
        basicText.x+=25;
		    firstX+=25;
        for(let i = 0; i < snakeCircles.length; i++){
          snakeCircles[i].x += 25/(0.05*i+1);
        }
    }

  } else if(direction==='-'){
      if(firstX >0){
          basicText.x-=25;
		      firstX-=25;
          for(let i = 0; i < snakeCircles.length; i++){
            snakeCircles[i].x -= 25/(0.05*i+1);
        }
      }
  }
}

function onKeyDown(key) {

  for (var i = 1; i < snakeCircles.length; i++) {
    snakeCircles[i].x = snakeCircles[i-1].x;
  }

  // // A Key = 65
  // Left arrow= 37
  if (key.keyCode === 65 || key.keyCode === 37) {
    gameLoop('-');
  }

  // D Key i= 68
  // Right arrow = 39
  if (key.keyCode === 68 || key.keyCode === 39) {
    gameLoop('+');
  }
}

function onKeyUp() {
  for(let i = 0; i < snakeCircles.length; i++){
          if (i > 0) {
            snakeCircles[i].x = snakeCircles[i-1].x;
          }
        }
}

//====================== Non-Snake functions ========
//function to create new random object and append it to objects array 
function spawnRandomObject() {
    // property of random object
    var object;
    var color;
    var type;
    var x = Math.random() * (canvas.width - 70) + 15;
    var y = spawnLineY;
	var objWidth;
	var objHeight;
    //if appear=0 disapear it from screen (canvas)
    var appear = 1;
    // make random object point (taken by snake to increase it’s length)
    if (Math.random() < 0.20) {
        type = "circle";
        color = "white";
		    objWidth=16;
		    objHeight=16;
    }
///////////coin Random/////////////
    else if(Math.random() >= 0.20 && Math.random() <=0.40)
    {
    	  object=spawnCoin();
          x=object.x;
          y=object.y;
          objWidth=object.widthCheck;
          objHeight=object.heightCheck;
          inCoin=true;  
    }
    else if(Math.random() > 0.40 && Math.random() <= 0.70)
    {
         type = "slider";
        color = "white";
        objWidth=8;
        objHeight=80;

    }
    //make random object square (crash by snake decrease from it’s length)
    else {
        type = "square";
        color = "#00ccff";
		    objWidth=45;
		    objHeight=45;
    }
	while(!check)
	{
		if(checkOverlap(x,y,objWidth,objHeight)||outOverlap>7)
		{
			if(outOverlap>7)
			{
            AddObject=false;
            }
			break;
		}
		else
		{
			if(inCoin)
			{
			   x=Math.random() * (canvas.width -object.getFrameWidth() * object.scaleRatio);
			   object.x=x;
			}
			else
			{
		      x = Math.random() * (canvas.width - 70) + 15;
		    }
		    outOverlap++;	
		}
	}
	  if(!inCoin)
	  {
	  	object = new RandomObject(color, type, x, y,objWidth,objHeight,appear);
	  }
	    if(AddObject)
	    {
          objects.push(object);
	    }
	    else
	    {
	       AddObject=true;
	    }
	    outOverlap=0;
	    inCoin=false;
}
// constructor of random object
function RandomObject(color, type, x, y,objWidth,objHeight,appear)
{
    //color of obstical
    this.color = color;
    // type of obstical such square or circle
    this.type = type;
    // set x randomly but at least 15px off the canvas edges
    this.x = x;
    // set y to start on the line where objects are spawned
    this.y = y;
	//width of object
	this.widthCheck=objWidth;
	//height of object
	this.height=objHeight;
    // random number on square or for point
    if(type=="circle")
    {
    this.num = Math.floor(Math.random() * 5) + 1;
    }
    else
    {
    this.num = Math.floor(Math.random() * 10) + 1;
    }
    // to appear make value=1(by default) or make=0 for disaprear
    this.appear = appear;
}
// function for create 6 object random 
function repeate_6_Random(count)
{
    var object;
    var color = "#00ccff";
    var type = "square";
    var x = 5;
    var y = spawnLineY;
    var appear = 1;
    var objWidth=45;
    var objHeight=45;
    if(count==0)
    {
    objects.pop();
    }
    for (i = 0; i < 6; i++)
    {
        object = new RandomObject(color, type, x, y,objWidth,objHeight,appear);
        objects.push(object);
        x += 50;
    }
}
//function to prevent overlap
function checkOverlap(x,y,Width,Height)
{
     if(objects.length>0)
     {
       for (var i = 0; i < objects.length; i++) 
       {
           if(!(x+45<objects[i].x)&&!(objects[i].x+45<x)&&!(y+110<objects[i].y)&&!(objects[i].y+110<y))
           {
               return false;

           }
       }
     }
     return true;
}
// function to delete object out of canvas 
function destroyobject (object) {
    var i;
    for (i = 0; i < objects.length; i += 1) {
       if (objects[i] === object) {
          objects[i] = null;
          objects.splice(i, 1);
          break;
      }
    }
  }
// function for draw on canvas 
function Draw()
{
      //console.log("length:"+objects.length);
    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        if(score>=10)
        {
          object.y +=2*spawnRateOfDescent;	
        }
        else if(score>=20)
        {
          object.y +=3*spawnRateOfDescent;
        }
        else
        {
        object.y +=spawnRateOfDescent;
        } 
        //if object out of canvas disapear from canvas delete from array
        if(object.y>canvas.height+20)
        {
         //console.log("i= "+i);
         destroyobject(object);  	
        }
        else
        {
			        if (object.appear == 1)
			        {
			            if (object.type === "circle")
			            {
			                ctx.beginPath();
			                ctx.arc(object.x, object.y, 8, 0, Math.PI * 2);
			                ctx.closePath();
			                ctx.fillStyle = object.color;
			                ctx.fill();
			                ctx.font = "20px Comic Sans MS";
			                ctx.fillStyle = "white";
			                var numx = object.x - (10 / 2);
			                var numy = object.y - (20 / 2);
			                ctx.fillText(object.num, numx, numy);
			            }
			            else if(object.type ==="slider")
			            {
			                ctx.beginPath();
			                ctx.rect(object.x, object.y, 8, 80);
			                ctx.fillStyle = object.color;
			                ctx.fill();
			                ctx.stroke();   
			            }
			            else if(object.type ==="coin")
			            {
			               object.update();
			               object.render();	
			            }
			            else
			            {
							ctx.beginPath();
							ctx.fillStyle = object.color;
			                ctx.rect(object.x, object.y, 45, 45);
			                /*ctx.moveTo(object.x,object.y);
			                var xD=object.x;
			                var yD=object.y;
							ctx.lineTo(xD+45,yD);
							ctx.quadraticCurveTo(xD+55,yD,xD+55,yD+10);
							ctx.lineTo(xD+55,xD+45);
							ctx.quadraticCurveTo(xD+55,xD+55,xD+45,xD+55);
							ctx.lineTo(xD,xD+55);
							ctx.quadraticCurveTo(yD,xD+55,yD,xD+45);
							ctx.lineTo(yD,xD);
							ctx.quadraticCurveTo(yD,yD,xD,yD);*/
			                ctx.fill();
							ctx.stroke();
			                ctx.font = "30px Comic Sans MS";
			                ctx.fillStyle = "white";
			                var numx = object.x + 13;
			                var numy = object.y + 32;
			                ctx.fillText(object.num, numx, numy);
			                ctx.stroke();
			            }
			        }
			    }
        }
}
// function of animation 
function animate() {
    // get the time now
    var time = Date.now();
    // see if its time to spawn a new object
    if (time > (lastSpawn + spawnRate)) {
        lastSpawn = time;

        if(lastObj)
        {
           spawnRandomObject();
        }
        else
        {

           lastObj=true;
        }
    }
    // see if its time to spawn a 6 random object again
    if (time > (lastSpawn2 + Rate)) {
        lastSpawn2 = time;
        //objects.pop();
        repeate_6_Random(count);
        lastObj=false;
        count++;
    }
    // request another animation frame
    request_animation=requestAnimationFrame(animate);
    // clear the canvas so all objects can be 
    // redrawn in new positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the line where new objects are spawned
/*    ctx.beginPath();
    ctx.moveTo(0, spawnLineY);
    ctx.lineTo(canvas.width, spawnLineY);
    ctx.stroke();*/
    // move each object down the canvas
    Draw();
}
 
 
var audio_ball=document.getElementById('ball_audio');
var audio_coin=document.getElementById('coin_audio');
var audio_crash=document.getElementById('crash_audio');
var audio=document.getElementById('audio');
var result_div=document.getElementById('main_div');

if(sound_flag=="true"){
	audio.play();
}else{
	audio.pause();
}
//alert(snake);
setInterval(onhit,100);
var coinVal=0;

function onhit(){
	cancelAnimationFrame(request_animation);
	request_animation=requestAnimationFrame(animate);

	
	for(i=0;i<objects.length;i++){
		if(collision(snakeCircles[0],objects[i])){
	
		var objectType=objects[i].type;
		var objectVal=0;
		//if snake hit square object
		if(objectType=="square"&&objects[i].appear==1){
		//splash(firstX+475,firstY+140);
		objectVal=objects[i].num;
		var downgrade=objectVal;
		cancelAnimationFrame(request_animation);
		splash(firstX+480,firstY+90);
		audio_ball.play();
		if(objectVal==1){
			//splash(firstX+475,firstY+140);
			audio_crash.play();
			//request_animation=requestAnimationFrame(animate);
			objects[i].appear=0;
			 decreaseSnake();
			app.stage.removeChild(basicText);
		showSnakeLength();
			objects[i].num--;
			
			// call mark function here  splash
			}
			
		else{

		
		decreaseSnake();
		app.stage.removeChild(basicText);
		showSnakeLength();
		objects[i].num--;

			request_animation=requestAnimationFrame(animate);
			// call mark function here  splash
			//call mokhtar function here to decrease snake length	and pass -1 as parameter to it :))
			
			
			}
			
			 if (snakeCircles.length <1) {
		  //alert(coinVal);
		 
			var playerName=arr[1];
			addScoresToLocalStorage(playerName,coinVal);
			cancelAnimationFrame(request_animation);
			addPlayer(playerName,coinVal);
			window.open("index.html#loser-model",'_top');
			
			
      }
	
		}
		else if(objectType=="circle"&&objects[i].appear==1){
	//if snake hit life ball object to increase snake lenght
				redrawSnake(objects[i].num);
				app.stage.removeChild(basicText);
				showSnakeLength();
				objectVal=objects[i].num;
				snakeLength+=objectVal;
				objects[i].appear=0;
				
		
	// call mokhtar function here to increase snake length	and pass objectVal as parameter to it :))
		}
		else if(objectType=="coin"&&objects[i].appear==1){
			//objectVal=parseInt(object.text());
			objectVal=objects[i].num;
			audio_coin.play();
			objects[i].appear=0;
			score++;
			coinVal++;
			
			}
			else if(objectType=="slider"&&objects[i].appear==1){
				//do nothing 
				cancelAnimationFrame(request_animation);
				}
				

	}
	
	
}
}
/*
	this function take two objects(snake,object) as a parameters
	and return if there's any crash 
	m7dsh y2rb mnha >_<

*/
 function collision(object1,object2) {
	 //alert(object1.position.x);
       if (firstX< object2.x+5 + object2.widthCheck  && firstX + object1.width  > object2.x+5 &&
		firstY < object2.y + object2.height && firstY + object1.height > object2.y) {
			return true;
}
	return false;
    }

// now we will setup our basic variables for the demo
//
window.requestAnimFrame = ( function() {
  return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
          window.setTimeout( callback, 1000 / 60 );
        };
})();

// now we will setup our basic variables for the demo
var canvas2 = document.getElementById( 'canvas2' ),
    ctx2 = canvas2.getContext( '2d' )
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    // firework collection
    fireworks = [],
    // particle collection
    particles = [],
    // starting hue
    hue = 120,
    // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
    limiterTotal = 5,
    limiterTick = 0,
    // this will time the auto launches of fireworks, one launch per 80 loop ticks
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    // mouse x coordinate,
    mx=100,
    // mouse y coordinate
    my=100;
    
// set canvas dimensions
canvas2.width = cw;
canvas2.height = ch;

// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random( min, max ) {
  return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
  var xDistance = p1x - p2x,
      yDistance = p1y - p2y;
  return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// create firework
function Firework( sx, sy, tx, ty ) {
  // actual coordinates
  this.x = sx;
  this.y = sy;
  // starting coordinates
  this.sx = sx;
  this.sy = sy;
  // target coordinates
  this.tx = tx;
  this.ty = ty;
  // distance from starting point to target
  this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
  this.distanceTraveled = 0;
  // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 3;
  // populate initial coordinate collection with the current coordinates
  while( this.coordinateCount-- ) {
    this.coordinates.push( [ this.x, this.y ] );
  }
  this.angle = Math.atan2( ty - sy, tx - sx );
  this.speed = 2;
  this.acceleration = 100.05;
  this.brightness = random( 50, 70 );
  // circle target indicator radius
  this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function( index ) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift( [ this.x, this.y ] );
  
  // cycle the circle target indicator radius
  if( this.targetRadius < 8 ) {
    this.targetRadius += 0.3;
  } else {
    this.targetRadius = 1;
  }
  
  // speed up the firework
  this.speed *= this.acceleration;
  
  // get the current velocities based on angle and speed
  var vx = Math.cos( this.angle ) * this.speed,
      vy = Math.sin( this.angle ) * this.speed;
  // how far will the firework have traveled with velocities applied?
  this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
  
  // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
  if( this.distanceTraveled >= this.distanceToTarget ) {
    createParticles( this.tx, this.ty );
    // remove the firework, use the index passed into the update function to determine which to remove
    fireworks.splice( index, 1 );
  } else {
    // target not reached, keep traveling
    this.x += vx;
    this.y += vy;
  }
}

// draw firework
Firework.prototype.draw = function() {
  ctx2.beginPath();
  // move to the last tracked coordinate in the set, then draw a line to the current x and y
  ctx2.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
  //ctx.lineTo( this.x, this.y );
  ctx2.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
  ctx2.stroke();
  
  ctx2.beginPath();
  // draw the target for this firework with a pulsing circle
  ctx2.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
  //ctx.stroke();
}

// create particle
function Particle( x, y ) {
  this.x = x;
  this.y = y;
  // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
  this.coordinates = [];
  this.coordinateCount = 5;
  while( this.coordinateCount-- ) {
    this.coordinates.push( [ this.x, this.y ] );
  }
  // set a random angle in all possible directions, in radians
  this.angle = random( 0, Math.PI * 2 );
  this.speed = random( 1, 10 );
  // friction will slow the particle down
  this.friction = 0.95;
  // gravity will be applied and pull the particle down
  this.gravity = 1;
  // set the hue to a random number +-20 of the overall hue variable
  this.hue = random( hue - 20, hue + 20 );
  this.brightness = random( 50, 80 );
  this.alpha = 1;
  // set how fast the particle fades out
  this.decay = random( 0.015, 0.03 );
}

// update particle
Particle.prototype.update = function( index ) {
  // remove last item in coordinates array
  this.coordinates.pop();
  // add current coordinates to the start of the array
  this.coordinates.unshift( [ this.x, this.y ] );
  // slow down the particle
  this.speed *= this.friction;
  // apply velocity
  this.x += Math.cos( this.angle ) * this.speed;
  this.y += Math.sin( this.angle ) * this.speed + this.gravity;
  // fade out the particle
  this.alpha -= this.decay;
  
  // remove the particle once the alpha is low enough, based on the passed in index
  if( this.alpha <= this.decay ) {
    particles.splice( index, 1 );
  }
}

// draw particle
Particle.prototype.draw = function() {
  ctx2. beginPath();
  // move to the last tracked coordinates in the set, then draw a line to the current x and y
  ctx2.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
  ctx2.lineTo( this.x, this.y );
  ctx2.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
  ctx2.stroke();
}

// create particle group/explosion
function createParticles( x, y ) {
  // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
  var particleCount = 30;
  while( particleCount-- ) {
    particles.push( new Particle( x, y ) );
  }
}

// main demo loop
function loop() {
  // this function will run endlessly with requestAnimationFrame
  requestAnimFrame( loop );
  
  // increase the hue to get different colored fireworks over time
  hue += 0.5;
  
  // normally, clearRect() would be used to clear the canvas
  // we want to create a trailing effect though
  // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
  ctx2.globalCompositeOperation = 'destination-out';
  // decrease the alpha property to create more prominent trails
  ctx2.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx2.fillRect( 0, 0, cw, ch );
  // change the composite operation back to our main mode
  // lighter creates bright highlight points as the fireworks and particles overlap each other
  ctx2.globalCompositeOperation = 'lighter';
  
  // loop over each firework, draw it, update it
  var i = fireworks.length;
  while( i-- ) {
    fireworks[ i ].draw();
    fireworks[ i ].update( i );
  }
  
  // loop over each particle, draw it, update it
  var i = particles.length;
  while( i-- ) {
    particles[ i ].draw();
    particles[ i ].update( i );
  }
  
  // launch fireworks automatically to random coordinates, when the mouse isn't down
/*  if( timerTick >= timerTotal ) {
    if( !mousedown ) {
      // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
      fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
      timerTick = 0;
    }
  } else {
    timerTick++;
  }*/
    if (mousedown)
        {
            timerTick++;
        }
  
  // limit the rate at which fireworks get launched when mouse is down
  if( limiterTick >= limiterTotal ) {
    if( mousedown ) {
      // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
      fireworks.push( new Firework( cw / 2, ch, mx, my ) );
      limiterTick = 0;
            mousedown=false;
    }
  } else {
    limiterTick++;
  }
}

// mouse event bindings
// update the mouse coordinates on mousemove
/*canvas.addEventListener( 'mousemove', function( e ) {
  mx = e.pageX - canvas.offsetLeft;
  my = e.pageY - canvas.offsetTop;
  
});

// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener( 'mousedown', function( e ) {
  e.preventDefault();
  mousedown = true;
     
});

canvas.addEventListener( 'mouseup', function( e ) {
  e.preventDefault();
  mousedown = false;
});*/


// once the window loads, we are ready for some fireworks!
window.onload = loop;


//call el function de ya ma3rouf
    function splash (x ,y)
    {
        mousedown=true;
        mx = x;
        my = y;
    }
