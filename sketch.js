var dog,happyDog,database,foodS,foodStock
var dog_img,happyDog_img,lazydog_img;
var feed,addfood;
var fedTime,lastFed;
var foodObj;
var input,button,greeting,Name;
var nameref;
var database;
var gameState = 0;
var readState;
var bedroom, garden, livingroom, washroom;

function preload()
{
  //to load images
  dog_img=loadImage("images/dog.png");
  happyDog_img=loadImage("images/happyDog.png");
  //lazydog_img=loadImage("");

  washroom=loadImage("vp-images/Wash Room.png");
  garden=loadImage("vp-images/Garden.png");
  bedroom=loadImage("vp-images/Bed Room.png");
  livingroom=loadImage("vp-images/Living Room.png");
}

function setup()
{
  //connecting database to firebase
  database=firebase.database();
  //fetching stock from DB
  foodStock=database.ref("Food");
  foodStock.on("value",readStock);
  //console.log(foodStock)

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  //reading name from database
  nameref=database.ref("name");
  nameref.on("value",function(data)
  {
    name=data.val();
  })

  //To create Canvas
  createCanvas(1000,400);

  //to create dog sprite
  dog=createSprite(800,200);
  dog.addImage(dog_img);
  //scaling dog
  dog.scale=0.2;

  //Creating foodObj using food class
  foodObj=new food();

  //feed the dog button
  feed=createButton("Feed the Dog");
  feed.position(740,67);
  feed.mousePressed(feedDog);

  //add food button
  addFood=createButton("Add Food")
  addFood.position(840,67);
  addFood.mousePressed(addFoods);


  input=createInput("Change Pet Name");
  input.position(940,67);
  
  
  button=createButton("SUBMIT");
  button.position(1038,90);
  button.mousePressed(renamingDog)
  
}
 
function draw()
{
  //assigning RGB colour to background
  background(46, 139, 87);

  fill("white");
  textSize(15);
  push();
  stroke("black");
  strokeWeight(1.5);
  textSize(24);
  text("You love your pet "+name,660,320);
  //("- by developer Kushal Naik",);
  pop();

  //displaying foodObj of food class
  foodObj.display();  

  //fetching fedtime from database
  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data)
  {
    lastFed=data.val();
  })
  //console.log(lastFed);
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    //dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.add//Image(lazydog_img);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(lastFed>=12)
  {
    text("Last Feed : "+ lastFed%12 + " PM",150,30);
  }
  else if(lastFed===0)
  {
    text("Last Feed : 12 AM",350,30)
  }
  else
  {
    text("Last Feed : "+ lastFed + " AM",350,30);
  }

  if(Name!==undefined)
  {
  text("Your Pet Name: "+ Name,685,32);
  }

  //To draw the sprites on canvas
  drawSprites();

  
 
  
}

//function to read value from database
function readStock(data)
{ 
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to feed the dog
function feedDog()
{
  dog.addImage(happyDog_img);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  
}

//function to add the dog
function addFoods()
{
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function renamingDog()
{
  Name=input.value();
  button.hide();
  input.hide();
  database.ref("/").update({
    name:Name
  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}