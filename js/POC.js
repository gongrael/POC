var POC = function() {
  // Set the width and height of the scene.
  this._width = 1280;
  this._height = 720;

  // Setup the rendering surface.
  this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
  document.body.appendChild(this.renderer.view);

  // Create the main stage to draw on.
  this.stage = new PIXI.Stage();
  this.stage.setBackgroundColor(0xe2e2e2)

  // // setup our physics world simulation.

  this.world = new p2.World({
    gravity: [0, 0]
  });

  // // speed parameters for our photon
   this.turnSpeed = 2;

  //method for telling computer when something is pressed or not pressed.

  window.addEventListener('keydown', function(event) {
    this.handleKeys(event.keyCode, true);
  }.bind(this), false);

  window.addEventListener('keyup', function(event) {
    this.handleKeys(event.keyCode, false);
  }.bind(this), false);


  // Start running the game.
  this.build();
};

/** ----------------GLOBAL VARIABLES----------------*/
      var posX = 780;
      var posY = 520;
      var radius = 14;


/**----------------- POC methods -------------------*/

POC.prototype = {
  /**
   * Build the scene and begin animating.
   */
  build: function() {
    // Draw the star-field in the background.
    this.drawLines();

    // Setup the boundaries of the game's arena.
    this.setupBoundaries();

    //draw the photon on the scene.
    this.createPhoton();

    //draw the MO onto the scene
    this.createMO();

    //draw electrons onto the scene
    this.createElectrons();


    //setup howler.js audio
    // this.setupAudio();

    // Begin the first frame.
    requestAnimationFrame(this.tick.bind(this));
  },



  /**
   * Draw the field of lines behind all of the action.
   */
  drawLines: function() {
      // Draw the line.
      var lines  = new PIXI.Graphics();
      lines.moveTo(0,0);
      lines.lineStyle(2, 0x000000);
      lines.lineTo(this._width*0.5 - 100, this._height*2/5 -50);
      lines.moveTo(this._width,0);
      lines.lineTo(this._width*0.5 + 100, this._height*2/5 -50);
      lines.moveTo(0, this._height);
      lines.lineTo(this._width*0.5 - 100, this._height*3/5 -50);
      lines.moveTo(this._width, this._height);
      lines.lineTo(this._width*0.5 + 100, this._height*3/5 -50);
      lines.beginFill(0xbcbcbc);
      lines.drawRect(this._width*0.5 - 100, this._height*2/5 -50, 200, this._height/5);
      lines.endFill();
            
     // Attach the lines to the stage.
      this.stage.addChild(lines);
  },

  /**
   * Draw the boundaries of the space arena.
   */
  setupBoundaries: function() {
    var walls = new PIXI.Graphics();
    walls.beginFill(0x000000, 0.9);
    walls.drawRect(0, 0, this._width, 10);
    walls.drawRect(this._width - 10, 10, 10, this._height - 20);
    walls.drawRect(0, this._height - 10, this._width, 10);
    walls.drawRect(0, 10, 10, this._height - 20);
    
    // Attach the walls to the stage.
    this.stage.addChild(walls);    
  },

    /**
   * Creates a graphical representation of the photon
   */
  createPhoton: function() {
    var radius = 80;
    var posX = 300;
    var posY = 200;

    this.photon = new p2.Body({
      mass: 1,
      angularVelocity: 0, 
      damping: 0,
      angularDamping: 0,
      angle: Math.random()*Math.PI, 
      position: [posX, posY]
    }); 
    this.photonShape = new p2.Circle(radius); 

    this.photon.addShape(this.photonShape);
    this.world.addBody(this.photon)

    console.log(this.photon.angle)

    this.phoGraph = new PIXI.Graphics();

    //create circle for photon
    this.phoGraph.lineStyle(radius*.02, 0x00ff91);
    this.phoGraph.beginFill(0x00ff91);
    this.phoGraph.drawCircle(posX, posY, radius);
    this.phoGraph.endFill();

    //create line along axis
    this.phoGraph.lineStyle(radius*.12, 0x00b259, 0.2);
    this.phoGraph.moveTo(posX-radius,posY);
    this.phoGraph.lineTo(posX+radius, posY);

    //create bezier curve
    this.phoGraph.lineStyle(radius*.08,0x00b259)
    this.phoGraph.moveTo(posX-radius,posY);
    this.phoGraph.bezierCurveTo(posX-radius, posY, posX-radius*7/10, posY-(radius*Math.sin(Math.PI/3)), posX-(radius*Math.cos(Math.PI/3)), posY-(radius*Math.sin(Math.PI/3)));
    this.phoGraph.bezierCurveTo(posX,posY-(radius*Math.sin(Math.PI/3)), posX, posY+(radius*Math.sin(Math.PI/3)), posX+(radius*Math.cos(Math.PI/3)), posY+(radius*Math.sin(Math.PI/3)));
    this.phoGraph.bezierCurveTo(posX+radius*7/10,posY+(radius*Math.sin(Math.PI/3)), posX+radius, posY, posX+radius, posY);  
   
    //randomly rotate figure

    this.phoGraph.pivot = new PIXI.Point(posX,posY);
    this.phoGraph.x = posX;
    this.phoGraph.y = posY;
    // this.phoGraph.rotation = Math.random()*Math.PI;



   // this.phoGraph.interactive = true;


    this.stage.addChild(this.phoGraph)
  },


   /**
   * Creates a graphical representation of the molecular orbital
   */

    createMO: function() {

      var piColor = 0x3333cc;
      var piAlpha = 0.9;
      var piLineWidth = radius*0.3;
      var piLineColor = 0x3333cc;
      var piLineAlpha = 0.6;
      //create Molecular Orbital Depiction  
      this.MOGraphs = new PIXI.Graphics();
      //this.MOGraphs.lineStyle(piLineWidth, piLineColor,piLineAlpha);
      this.MOGraphs.beginFill(0x000000);
      this.MOGraphs.drawCircle(posX-radius*10, posY, radius/2);
      this.MOGraphs.endFill();
      this.MOGraphs.beginFill(0x000000);
      this.MOGraphs.drawCircle(posX+radius*10, posY, radius/2);
      this.MOGraphs.endFill();
      this.MOGraphs.beginFill(piColor, piAlpha);
      this.MOGraphs.drawEllipse(posX, posY+radius*6, radius*10, radius*4);
      this.MOGraphs.endFill();
      this.MOGraphs.beginFill(piColor, piAlpha);
      this.MOGraphs.drawEllipse(posX, posY-radius*6, radius*10, radius*4);
      this.MOGraphs.endFill();
     
      //Create transparent orbitals
      var eliX = radius*5;
      var eliY = radius*6;
      var colours = 0xcc3333;
      var lineColours = 0xcc9999;
      var alphas = 0.2;
      var alphasLine = 0.6;
      var eliLineWidth = radius*0.3;

      var eliPosX = posX+radius*18;
      var eliPosY = posY+radius*6;
      this.MOGraphStar1 = new PIXI.Graphics();
      this.MOGraphStar1.lineStyle(eliLineWidth, lineColours,alphasLine);
      this.MOGraphStar1.beginFill(colours, alphas);
      this.MOGraphStar1.drawEllipse(eliPosX, eliPosY, eliX, eliY);
      this.MOGraphStar1.endFill();
      //rotate figure
      this.MOGraphStar1.pivot = new PIXI.Point(eliPosX,eliPosY);
      this.MOGraphStar1.x = eliPosX;
      this.MOGraphStar1.y = eliPosY;
      this.MOGraphStar1.rotation = -Math.PI/3;

      var eliPosX = posX+radius*18;
      var eliPosY = posY-radius*6;
      this.MOGraphStar2 = new PIXI.Graphics();
      this.MOGraphStar2.lineStyle(eliLineWidth, lineColours,alphasLine);
      this.MOGraphStar2.beginFill(colours, alphas);
      this.MOGraphStar2.drawEllipse(eliPosX, eliPosY, eliX, eliY);
      this.MOGraphStar2.endFill();
      //rotate figure
      this.MOGraphStar2.pivot = new PIXI.Point(eliPosX,eliPosY);
      this.MOGraphStar2.x = eliPosX;
      this.MOGraphStar2.y = eliPosY;
      this.MOGraphStar2.rotation = Math.PI/3;

      var eliPosX = posX-radius*18;
      var eliPosY = posY-radius*6;
      this.MOGraphStar3 = new PIXI.Graphics();
      this.MOGraphStar3.lineStyle(eliLineWidth, lineColours,alphasLine);
      this.MOGraphStar3.beginFill(colours, alphas);
      this.MOGraphStar3.drawEllipse(eliPosX, eliPosY, eliX, eliY);
      this.MOGraphStar3.endFill();
      //rotate figure
      this.MOGraphStar3.pivot = new PIXI.Point(eliPosX,eliPosY);
      this.MOGraphStar3.x = eliPosX;
      this.MOGraphStar3.y = eliPosY;
      this.MOGraphStar3.rotation = -Math.PI/3;

      var eliPosX = posX-radius*18;
      var eliPosY = posY+radius*6;
      this.MOGraphStar4 = new PIXI.Graphics();
      this.MOGraphStar4.lineStyle(eliLineWidth, lineColours,alphasLine);
      this.MOGraphStar4.beginFill(colours, alphas);
      this.MOGraphStar4.drawEllipse(eliPosX, eliPosY, eliX, eliY);
      this.MOGraphStar4.endFill();
      //rotate figure
      this.MOGraphStar4.pivot = new PIXI.Point(eliPosX,eliPosY);
      this.MOGraphStar4.x = eliPosX;
      this.MOGraphStar4.y = eliPosY;
      this.MOGraphStar4.rotation = Math.PI/3;

      this.MOGraphs.addChild(this.MOGraphStar1)
      this.MOGraphs.addChild(this.MOGraphStar2)
      this.MOGraphs.addChild(this.MOGraphStar3)
      this.MOGraphs.addChild(this.MOGraphStar4)
      this.stage.addChild(this.MOGraphs)
     },


  /**
   * Draw the boundaries of the space arena.
   */
  createElectrons: function() {
    this.electron = new PIXI.Graphics();
    this.electron.lineStyle(1, 0x000000)
    this.electron.beginFill(0xFFFFFF, 0.3);
    this.electron.drawCircle(posX-radius*5, posY + radius*5, radius/2);
    this.electron.endFill();
    
    this.electron1 = new PIXI.Graphics();
    this.electron1.lineStyle(1, 0xFFFFFF)
    this.electron1.beginFill(0x0000000, .8);
    this.electron1.drawCircle(posX+radius*20, posY - radius*6, radius/2);
    this.electron1.endFill();

    this.electronConn = new PIXI.Graphics();
    this.electronConn.lineStyle(1, 0xFFFFFF)
    this.electronConn.moveTo( posX-radius*5, posY + radius*5)
    this.electronConn.lineTo( posX+radius*20, posY - radius*6)
   
    this.stage.addChild(this.electron);    
    this.stage.addChild(this.electron1);

    this.stage.addChild(this.electronConn);

    this.electron.angle = this.calcAngle(posX-radius*5, posX+radius*20, posY - radius*6, posY + radius*5) + Math.PI/2;
  },


  calcAngle : function (x1, x2, y1, y2)
  {
    var xlength = x2 - x1;
    var ylength = y2 - y1;
    var angle = Math.atan(xlength/ylength);
    return angle;
  },


/**
 * Handle key presses and filter them
 * @param  {Number} code Key code pressed
 * @param  {Boolean} state  true/false
 * 
 */
  handleKeys: function(code,state) {
    switch (code)
    {
      case 65: //A
      this.keyLeft = state;
      break;

       case 68: //D
      this.keyRight = state;
      break;

       case 87: //W
      this.submit = state;
      break;
    }
   },




  updatePhysics: function() {
    //update the photons angular velocities for rotation

    if (this.keyLeft) 
    {
      this.photon.angularVelocity = -1 * this.turnSpeed;
    } 
    else if (this.keyRight) 
    {
      this.photon.angularVelocity = this.turnSpeed;
    }
    else
    {
      this.photon.angularVelocity = 0;
    }
 

     //update the position of the graphics based on the physics simulation position
    this.phoGraph.rotation = this.photon.angle;


    if (this.submit)
    {
      var photonAngle = this.normalizeAngle(this.photon.angle);
      var electronAng = this.electron.angle;
      if(Math.abs(photonAngle - electronAng) <0.1)
      {
        this.correct = new PIXI.Graphics();
        //this.MOGraphs.lineStyle(piLineWidth, piLineColor,piLineAlpha);
        this.correct.beginFill(0x00ccff);
        this.correct.drawCircle(this._width/2, this._height/2, 300);
        this.correct.endFill();
        this.correctText = new PIXI.Text("You are correct! \n Refresh to reload");
        this.correctText.style.fill = 'white';
        this.correctText.style.font = 'bold 60px Arial';
        this.correctText.style.align = 'center';
        this.correctText.x = this._width*2/7;
        this.correctText.y = this._height/2;

        this.stage.addChild(this.correct)
        this.stage.addChild(this.correctText)

      }
      console.log(photonAngle)
      console.log(electronAng)
    }

    //step the physics simulation forwards
     this.world.step(1/60);
   },


// The angle property is not normalized to the interval 0 to 2*pi, it can be any value.
// If you need a value between 0 and 2*pi, use the following function to normalize it.

  normalizeAngle : function (angle) {
    angle = angle % (Math.PI);
    if(angle < 0){
      angle += (Math.PI);
    }
    return angle;
    },




/**
 * Fires at the end of the gameloop to reset and redraw the canvas.
 */
  tick: function() {

   this.updatePhysics();

    // Render the stage for the current frame.
    this.renderer.render(this.stage);

   // Begin the next frame.
   requestAnimationFrame(this.tick.bind(this));
    }
  };

