/***
 * Scaffolded by Jingjie (Vincent) Zheng on June 24, 2015.
 */

'use strict';

/**
 * A function that creates and returns the spaceship model.
 */

function createViewModule() {
  var SpaceshipView = function(model, canvas) {
    /**
     * Obtain the SpaceshipView itself.
     */
    var self = this;

    /**
     * Maintain the model.
     */
    this.model = model;

    /**
     * Maintain the canvas and its context.
     */
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    /**
     * Update the canvas. 
     * You should be able to do this trivially by first clearing the canvas, then call the rootNode's 
     * renderAll() with the context.
     */
    this.update = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.model.rootNode.renderAll(this.context);

    };

    /**
     * You should add the view as a listener to each node in the scene graph, so that the view can get 
     * updated when the model is changed.
     */
    this.model.rootNode.addListener(this);
    this.model.headNode.addListener(this);
    this.model.spaceshipNode.addListener(this);
    this.model.bodyNode.addListener(this);
    this.model.handleNode.addListener(this);
    this.model.tailNode.addListener(this);
    this.model.fireNode.addListener(this);
    this.model.spaceshipNode.scale(0.7, 0.7);

    
    //this.model.bodyNode.isInteractableWithMouse = true;
    //console.log( self.model.tailNode.isInteractableWithMouse);

    
    //TODO

    /**
     * Handle mousedown events.
     * You should perform a hit detection here by calling the model's performHitDetection().
     */ 
    canvas.addEventListener('mousedown', function(e) {
      //TODO
      var x = e.x;
      var y = e.y;
      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;

      var point = [];
      point[0] = x;
      point[1] = y;
      

      var hit =  self.model.performHitDetection(point);

      if(hit == null){
        return;
      }else{

        previousPoint[0] = x;
        previousPoint[1] = y;

        if(hit == self.model.handleNode && megaSpaceship == false) {

          //console.log("handle");
          document.body.style.cursor = "pointer";
          mouseMode = "handle";

        }else if(hit == self.model.bodyNode){

          //console.log("body");
          document.body.style.cursor = "move";
          mouseMode = "body";
        }

      }

    });

    /**
     * Handle mousemove events.
     */ 
    canvas.addEventListener('mousemove', function(e) {
      

      var x = e.x;
      var y = e.y;
      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;

      var point = [];
      point[0] = x;
      point[1] = y;

      if(mouseMode == "body"){

        var temp = self.model.spaceshipNode.globalTransformation.createInverse();
        var curP = [];
        var preP = [];
        temp.transform(point, 0, curP, 0, 1);
        temp.transform(previousPoint, 0, preP, 0, 1);

        self.model.spaceshipNode.translate(curP[0]-preP[0], curP[1]-preP[1]);

        previousPoint[0] = point[0];
        previousPoint[1] = point[1];

      }
      else if(mouseMode == "handle"){

        var temp = self.model.bodyNode.globalTransformation.createInverse();
        var curP = [];
        var preP = [];
        temp.transform(point, 0, curP, 0, 1);
        temp.transform(previousPoint, 0, preP, 0, 1);

        var diff = preP[1] - curP[1];
        var testing = self.model.bodyNode.localBoundingBox.h+diff;

          if( testing > 40 && testing < 400){

          self.model.bodyNode.localBoundingBox.h = testing;

          self.model.bodyNode.localBoundingBox.y =  -self.model.bodyNode.localBoundingBox.h;
          
          self.model.headNode.translate(0,-diff);
          self.model.handleNode.translate(0,-diff);

          previousPoint[0] = point[0];
          previousPoint[1] = point[1];
          //console.log(testing);

        }

      }

    });




    /**
     * Handle mouseup events.
     */ 
    canvas.addEventListener('mouseup', function(e) {
      document.body.style.cursor = "";
      mouseMode = "";
      //self.update();
    });

    /**
     * Handle keydown events.
     */ 

    var mouseMode;
    var diffSum = 0;
    var facingDegree = 0;
    var totalDegree = 0;
    var turnningL = false;
    var turnningR = false;
    var turninglimit = 0;
    var normalSpeed = 10;
    var megaSpaceship = false;
    var previousPoint = [];
    var previousPointScale = [];

    document.addEventListener('keydown', function(e) {

        var tempSpeed;

        if(megaSpaceship == true){
            tempSpeed = 2*normalSpeed;
        }else{
            tempSpeed = normalSpeed;
        }

        if (e.keyCode == "38") {
            
            var x = self.model.tailNode.localBoundingBox['x'] + 
                    0.5 * self.model.tailNode.localBoundingBox['w'];
            var y = self.model.tailNode.localBoundingBox['y'];

            self.model.fireNode.forward = true;

            if(turnningR == true && turnningL == false){
              //console.log("correct");

                if(turninglimit != -5){
                    self.model.tailNode.rotate(-9*Math.PI/180, x, y);
                    turninglimit --;
                    facingDegree = facingDegree -9*Math.PI/180;
                    // totalDegree += -9*Math.PI/180;
                }

            }

            if(turnningL == true && turnningR == false){

                if(turninglimit != 5){
                    self.model.tailNode.rotate(9*Math.PI/180, x, y);
                    turninglimit++;
                    facingDegree = facingDegree + 9*Math.PI/180;
                    // totalDegree += 9*Math.PI/180;
                }
            }



            self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  
            totalDegree += (0.3 * (-facingDegree)) ;//haha
            self.model.spaceshipNode.translate(0, -tempSpeed);


            var xLeft = self.model.rootNode.localBoundingBox.x;

            var xRight = self.model.rootNode.localBoundingBox.x
                        +self.model.rootNode.localBoundingBox.w;
                       // console.log(xRight);
            var yTop = self.model.rootNode.localBoundingBox.y;

            var yBot = self.model.rootNode.localBoundingBox.y 
                      +self.model.rootNode.localBoundingBox.h;




            // console.log(self.model.spaceshipNode.localTransformation.getTranslateX());
            // console.log(self.model.spaceshipNode.localTransformation.getTranslateY());
            //console.log(totalDegree);
            if(self.model.spaceshipNode.localTransformation.getTranslateX() < xLeft){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(xRight,0);
                }

                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();

            }
            else if(self.model.spaceshipNode.localTransformation.getTranslateX() > xRight){
                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(-xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(-xRight,0);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y);
                self.update(); 
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() < yTop){
              self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                
                if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() > yBot){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
               if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, -yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, -yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }





            self.update();
        }else

        if(e.keyCode == "39" && turnningL == false){//right
            turnningR = true;
 
                var x = self.model.tailNode.localBoundingBox['x'] + 
                        0.5 * self.model.tailNode.localBoundingBox['w'];
                var y = self.model.tailNode.localBoundingBox['y'] ;

                if(turninglimit != -5){
                    self.model.tailNode.rotate(-9*Math.PI/180, x, y);
                    turninglimit --;
                    facingDegree = facingDegree -9*Math.PI/180;
                }
                if(self.model.fireNode.forward == true){
                    self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);
                    totalDegree += (0.3 * (-facingDegree)) ;  
                    self.model.spaceshipNode.translate(0, -tempSpeed);

         
                    self.update();
                }
            

        }else

        if(e.keyCode == "37" && turnningR == false ){//left
            turnningL = true;
   
                var x = self.model.tailNode.localBoundingBox['x'] + 
                        0.5 * self.model.tailNode.localBoundingBox['w'];
                var y = self.model.tailNode.localBoundingBox['y'] ;
                if(turninglimit != 5){
                    self.model.tailNode.rotate(9*Math.PI/180, x, y);
                    turninglimit++;
                    facingDegree = facingDegree + 9*Math.PI/180;
                }
                if(self.model.fireNode.forward == true){
                    self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  
                    totalDegree += (0.3 * (-facingDegree)) ;
                    self.model.spaceshipNode.translate(0, -tempSpeed);


                    self.update();
                }
        }
      

    });

    /**
     * Handle keyup events.
     */ 

      var testyolo;
      var once = true;
      var yolotest;
      var powerOnce = true;

    document.addEventListener('keyup', function(e) {

        var x = self.model.tailNode.localBoundingBox['x'] + 
                 0.5 * self.model.tailNode.localBoundingBox['w'];
                var y = self.model.tailNode.localBoundingBox['y'] ;

        if (e.keyCode == '38') {
            self.model.fireNode.forward = false;
             window .clearInterval(testyolo);
             //window .clearInterval(yolotest);

            // console.log("UP finish");
            once = true;
            self.update();
        }
        if(e.keyCode == '39'){//right
            turnningR = false;
            
            if (self.model.fireNode.forward == true &&  once ){
                            testyolo = setInterval(function(){ 
                            self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  
                            totalDegree += (0.3 * (-facingDegree)) ;
                            if(megaSpaceship == false){
                              self.model.spaceshipNode.translate(0, -normalSpeed); 
                            }else{
                              self.model.spaceshipNode.translate(0, -normalSpeed*2); 
                            }
                            
    /////////////////////////////////////////////////////////////////////////////////////  
            var xLeft = self.model.rootNode.localBoundingBox.x;

            var xRight = self.model.rootNode.localBoundingBox.x
                        +self.model.rootNode.localBoundingBox.w;
                       // console.log(xRight);
            var yTop = self.model.rootNode.localBoundingBox.y;

            var yBot = self.model.rootNode.localBoundingBox.y 
                      +self.model.rootNode.localBoundingBox.h;




            // console.log(self.model.spaceshipNode.localTransformation.getTranslateX());
            // console.log(self.model.spaceshipNode.localTransformation.getTranslateY());
            //console.log(totalDegree);
            if(self.model.spaceshipNode.localTransformation.getTranslateX() < xLeft){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(xRight,0);
                }

                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();

            }
            else if(self.model.spaceshipNode.localTransformation.getTranslateX() > xRight){
                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(-xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(-xRight,0);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y);
                self.update(); 
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() < yTop){
              self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                
                if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() > yBot){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
               if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, -yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, -yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }
            self.update(); 
    ///////////////////////////////////////////////////////////////////////////////////// 
                  } , 120 );

              once = false;

            }else if(self.model.fireNode.forward == true){
              self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  

            totalDegree += (0.3 * (-facingDegree));
                  self.model.spaceshipNode.translate(0, -normalSpeed); 
                  
            }


            

        }
        if(e.keyCode == "37"){//left
            turnningL = false;

            if (self.model.fireNode.forward == true &&  once ){
              testyolo = setInterval(function(){ 
                            self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  

                            totalDegree += (0.3 * (-facingDegree)) ;
                            if(megaSpaceship == false){
                              self.model.spaceshipNode.translate(0, -normalSpeed); 
                            }else{
                              self.model.spaceshipNode.translate(0, -normalSpeed*2); 
                            }
                            
    /////////////////////////////////////////////////////////////////////////////////////  
            var xLeft = self.model.rootNode.localBoundingBox.x;

            var xRight = self.model.rootNode.localBoundingBox.x
                        +self.model.rootNode.localBoundingBox.w;
                       // console.log(xRight);
            var yTop = self.model.rootNode.localBoundingBox.y;

            var yBot = self.model.rootNode.localBoundingBox.y 
                      +self.model.rootNode.localBoundingBox.h;




            // console.log(self.model.spaceshipNode.localTransformation.getTranslateX());
            // console.log(self.model.spaceshipNode.localTransformation.getTranslateY());
            // console.log(totalDegree);
            if(self.model.spaceshipNode.localTransformation.getTranslateX() < xLeft){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(xRight,0);
                }

                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();

            }
            else if(self.model.spaceshipNode.localTransformation.getTranslateX() > xRight){
                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                if(megaSpaceship == false){
                  self.model.spaceshipNode.translate(-xRight/0.7,0);
                }else{
                  self.model.spaceshipNode.translate(-xRight,0);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y);
                self.update(); 
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() < yTop){
              self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                
                if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }else
            if(self.model.spaceshipNode.localTransformation.getTranslateY() > yBot){

                self.model.spaceshipNode.rotate(-totalDegree , x, y); 
               if(megaSpaceship == false){
                  //console.log("yup");
                  self.model.spaceshipNode.translate(0, -yBot/0.7);
                }else{
                  self.model.spaceshipNode.translate(0, -yBot);
                }
                self.model.spaceshipNode.rotate(totalDegree, x, y); 
                self.update();
            }
            self.update(); 
    ///////////////////////////////////////////////////////////////////////////////////// 
                  } , 120 );

              once = false;

            }else if(self.model.fireNode.forward == true){
              self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  

              totalDegree += (0.3 * (-facingDegree));
              self.model.spaceshipNode.translate(0, -normalSpeed); 
                  
            }
        }



        if (e.keyCode == '32') {// power space

            if(true ){

              if(megaSpaceship == false){
                megaSpaceship = true;
                self.model.spaceshipNode.scale(1.4,1.4); 
                setTimeout(function(){ 
                        self.model.spaceshipNode.scale(0.7, 0.7);  
                        megaSpaceship = false ;
                        self.update(); } , 5000 );
              }


/////////////////////////////////////////////////////////////////////////////////////
                if(self.model.fireNode.forward == true ){//&& powerOnce){
                  
                  if(!yolotest){
                    console.log("1");
                  yolotest = setInterval(function(){ 


                      if(self.model.fireNode.forward == false){
                          console.log("2");
                      }
                      
                      else
                       if(megaSpaceship == false ){
                      self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  

                      totalDegree += (0.3 * (-facingDegree)) ;
                        self.model.spaceshipNode.translate(0, -normalSpeed); 
                        console.log("3");
                      }

                      else
                      if(megaSpaceship == true ) {
                      self.model.spaceshipNode.rotate(0.3 * -facingDegree, x, y);  

                      totalDegree += (0.3 * (-facingDegree)) ;
                        self.model.spaceshipNode.translate(0, -normalSpeed*2); 
                        console.log("4");
                      }
                      
                            

                      var xLeft = self.model.rootNode.localBoundingBox.x;

                      var xRight = self.model.rootNode.localBoundingBox.x
                                  +self.model.rootNode.localBoundingBox.w;
                                 // console.log(xRight);
                      var yTop = self.model.rootNode.localBoundingBox.y;

                      var yBot = self.model.rootNode.localBoundingBox.y 
                                +self.model.rootNode.localBoundingBox.h;


                      if(self.model.spaceshipNode.localTransformation.getTranslateX() < xLeft){

                          self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                          if(megaSpaceship == false){
                            self.model.spaceshipNode.translate(xRight/0.7,0);
                          }else{
                            self.model.spaceshipNode.translate(xRight,0);
                          }

                          self.model.spaceshipNode.rotate(totalDegree, x, y); 
                          self.update();

                      }
                      else if(self.model.spaceshipNode.localTransformation.getTranslateX() > xRight){
                          self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                          if(megaSpaceship == false){
                            self.model.spaceshipNode.translate(-xRight/0.7,0);
                          }else{
                            self.model.spaceshipNode.translate(-xRight,0);
                          }
                          self.model.spaceshipNode.rotate(totalDegree, x, y);
                          self.update(); 
                      }else
                      if(self.model.spaceshipNode.localTransformation.getTranslateY() < yTop){
                        self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                          
                          if(megaSpaceship == false){
                            //console.log("yup");
                            self.model.spaceshipNode.translate(0, yBot/0.7);
                          }else{
                            self.model.spaceshipNode.translate(0, yBot);
                          }
                          self.model.spaceshipNode.rotate(totalDegree, x, y); 
                          self.update();
                      }else
                      if(self.model.spaceshipNode.localTransformation.getTranslateY() > yBot){

                          self.model.spaceshipNode.rotate(-totalDegree , x, y); 
                         if(megaSpaceship == false){
                            //console.log("yup");
                            self.model.spaceshipNode.translate(0, -yBot/0.7);
                          }else{
                            self.model.spaceshipNode.translate(0, -yBot);
                          }
                          self.model.spaceshipNode.rotate(totalDegree, x, y); 
                          self.update();
                      }
                      self.update();

                      
                      
                  } , 120 );
                    //powerOnce = false;

                }
              }

/////////////////////////////////////////////////////////////////////////////////////

                
            }
        }

    });

    /**
     * Update the view when first created.
     */

    this.update();
    
  };

  return {
    SpaceshipView: SpaceshipView
  };
}