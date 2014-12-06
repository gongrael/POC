
/******************************************** Variables *********************************************/

//generates a ranodm number in the range specified
var randNumb0to99 = randomNumber(0, 100);

//width of the field
var width = 30;
var height = 30;

//Good for square dimensions

var randomForStart = randomNumber(0, width);
var neg1To1 = randomNumber(-1, 3)

var bunny = new BunnyAndField("Blackie", 1000, "Meadow")

/******************************************** Functions *********************************************/

//Function: BunnyAndField is a constructor that allows you to quickly develop new bunnies and its field that it runs around in. The method position produces an object that holds the properties width and height. The object also has a method called movement, which will execute the movement of the bunny.
//Input/Arguments
//@nameOfBunny: string;
//@hp: number;
//@position: object that holds the starting position.
//Output/Returns:new Bunny object.

function BunnyAndField(nameOfBunny, hp, nameOfField)
{
	this.bunnyName = nameOfBunny; //using "this" assigns this values to the variable calling it.  
	this.health = 1000; 
	this.alive = true;
	this.position = startPosition(); //coordinate is where the bunnys current position is, this is intially set by the startPosition() function. The object has these properties width, heigth, indexnumber respectfully. 
	this.movement = movePosition; //this function initializes the bunny movements, then takes care of bunny encountering vegetation.
	this.motion = movements; // this function is called by moveposition to execute bunny movement.
	this.checkForVege = vegeCheck; //checks whether or not vegetation exists on the bunny's current position.
	this.fieldName = nameOfField;
	// this.dimensions = {"widthOfField": width, "heightOfField": height};
	this.vegetation = vegetation(); //creates an object with the properties of height, width and "vege". "vege" is either true or false, if true, there is a plant present, vege's default value is false. 
	this.growthChance = 12;  //this is a number between 1 and 100, ie. corresponds to the presentage of growth
	this.growthOfVege = vegeGrowth;
	this.growVege = growVege;
}

//Function: randomNumber is a function that constructs another function that will generate a number between a certain range and starting from a certain place. 
//Input/Arguments
//@startNumb: number
//@range: number
//Output/Returns: function.

function randomNumber(startNumb, range)
{
	return function () 
	{ 
		return Math.floor(Math.random()*range) + startNumb;
	}
}

//Field is a constructor that produces new fields for which bonus can hop around in. It holds the vegetation array that lists all the positions and whether or not vegetation exists there. It also holds the function that determines how quickly the vegetation generates
// function Field(nameOfField)
// {
// 	this.fieldName = nameOfField;
// 	this.dimensions = {"widthOfField": width, "heightOfField": height};
// 	this.vegetation = vegetation();
// 	this.growthRate = 5; //this number will correspond to a percentage, ie. if the number is 5, there is a 5 percent chance vegatation will grow somewhere on the map. 
// }

//Gives the index of the current position the bunny is in. And index is helpful because one can get quickly to the correct entry in the array holding the details about the meadow.

function fieldPositionIndex(bunnyWidth, bunnyHeight)
{
	var index = width*bunnyHeight + bunnyWidth;
	return index;
}


//Function: startPosition function was intended for use when cells were not given set starting positions.
function startPosition()
{
	var tempPosition = {"width":randomForStart(), "height":randomForStart()};
	tempPosition.positionIndex = fieldPositionIndex(tempPosition["width"], tempPosition["height"]);
	return tempPosition;
}


//Is a function that generates an array holding all the positions of the vegetation, and whether or not a vegetation exists at that position in the field.
function vegetation()
{
	var arrayOfVeg = [];
	for (var i=0; i<height; i++)
	{
		for (var j=0; j<width; j++)
		{
			var tempVegObject = {"width":j, "height":i, "vege":false}; 
			// tempVegObject.fieldPositionIndex = (width*i) + j;
			arrayOfVeg.push(tempVegObject);
		}
	}
	return arrayOfVeg;
}


// directionPicker is a function that chooses a direction for the bunny to travel, and since the bunny only travels a single unit, it is also the amplitude of movement.
function directionPicker()
{
	var northOrSouth = neg1To1(); //uses a function to produce a number from -1 to 1, -1 would be south, 1 would be north, 0 would stay where it is.
	var eastOrWest = neg1To1(); //uses a function to produce a number from -1 to 1, -1 would be west, 1 would be east, 0 would stay where it is.
	var tempDirection = {"height":northOrSouth, "width":eastOrWest};
	if (northOrSouth||eastOrWest) //since this can be -1, 0, or 1, if they are both zero, this will be equal to 0, which is the same as false.
		{
			return tempDirection; //returns this so a variable can be assigned to the object
		}
	else return directionPicker(); //called recursively so that a direction in at least one direction is picked
}

//Function: movements, takes the direction from the direction picker. It uses planeOfMovement, so that it can be use with both width and height. It tests where the cell is, and forbids the cell from moving out of the confines of the petri dish. If it is at a wall and told to move in either direction, it will move in the direction away from that wall (this means that it has a 2/3 chance of moving away from the wall). If it is heading in direction towards the wall, it will subsequently bounce off the wall. 
//Input/Arguments
//@planeOfMovement: string that tells you what direction it is
//@directionObject: object that specifies direction
//Output/Returns: modifies objects properties.

function movements(planeOfMovement, directionObject) //can use this function for both width and height because of planeOfMovement
{
	if (this.position[planeOfMovement] > 0 && this.position[planeOfMovement] < width-1)  //checks to make sure the cell is away from the walls, if it is, it uses what was generated from directionPicker
	{
		this.position[planeOfMovement] += directionObject[planeOfMovement]; //adds the value of the directionObject to the current position.
		this.position.positionIndex = fieldPositionIndex(this.position.width, this.position.height);

	}
	else if	(this.position[planeOfMovement] == 0 && directionObject[planeOfMovement] == -1) //If the cell is at the wall, and it is told to cross it, the cell will be sent in the opposite direction.
	{
		this.position[planeOfMovement] += 1;
		this.position.positionIndex = fieldPositionIndex(this.position.width, this.position.height);
	} 

	else if (this.position[planeOfMovement] == (width-1) && directionObject[planeOfMovement] == 1)//If the cell is at the wall, and it is told to cross it, the cell will be sent in the opposite direction.
	{
		this.position[planeOfMovement] -= 1;
		this.position.positionIndex = fieldPositionIndex(this.position.width, this.position.height);
	}
	else //if it is at the wall and told to move in the other direction, just keep on moving. 
	{
		this.position[planeOfMovement] += directionObject[planeOfMovement];
		this.position.positionIndex = fieldPositionIndex(this.position.width, this.position.height);
	}
}

//Function: movePosition, is a method for bunnies. It combines the directionPicker fuction and this.motion  method (which is the movements()) functios so that movement can happen.

function movePosition()
{	
	directObj = directionPicker();
	if (directObj["height"] !=0 && directObj["width"] !=0)  //if it is moving in both directions, movements function is called by this.motion for both directions
		{
			this.motion("height", directObj);   //because we use directObj, movements can modify directObj if the object is heading in the wrong direction. directObj is not provided a direction because this.motion provides the correct property.
			this.motion("width", directObj);
			this.checkForVege();
			this.health -= 1;
			return;
		}
	else if (directObj["width"] != 0)
		{
			this.motion("width", directObj);
			this.checkForVege();
			this.health -= 1;
			return;
		}
	else 
		{
			this.motion("height", directObj);
			this.checkForVege();
			this.health -= 1;
			return;
		}
}


function vegeCheck()
{
	if (this.vegetation[this.position.positionIndex].vege) //checks to see whether or not vegetation exists at that particular position.
	{
		this.health += 10;	//give the bunny some more health
		this.vegetation[this.position.positionIndex].vege = false;
		return;
	}
	else return;
}


function vegeGrowth()
{
	var growthRoll = randNumb0to99();
	if (growthRoll<this.growthChance)  //checks to see if anything actually grows, will only grow if the condition is met
	{
		this.growVege();
	}
	else return
}


function growVege()
{
	var randomPosition = randomNumber(0, this.vegetation.length)(); //generates a random number between the 0 and the number of positions available
	if (!this.vegetation[randomPosition].vege) //if there is no plant present
	{
		this.vegetation[randomPosition].vege = true;
		return;
	}
	else return this.growVege();
}
/****************************************** Program Excecution  *******************************************/


