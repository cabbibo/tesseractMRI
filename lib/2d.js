function Controller2D( params ){

  this.params = _.defaults( params || {}, {
   
    size:         2,
    color:        0xaaaaaa,
    color1:       0xAB0038,
    color2:       0xA17F00,
    linewidth:    5,

  });

  this.equations = [

    // X = 0 
    [ 1 , 0 , 0 ],

    // X = 1
    [ 1 , 0 , 1 ],

    // Y = 0
    [ 0 , 1 , 0 ],

    // Y = 1
    [ 0 , 1 , 1 ]

  ]

  // Holds the intersections and oIntersections
  this.intersections      = [];
  this.oIntersections     = [];

  // holds the flattened intersections
  this.flatIntersections  = [];

  this.math     = new Math2D( this );
  this.renderer = new Renderer2D( this );

  //this.renderer.scene.position.y =  -1.5;
  //this.renderer.scene.position.x = -2.5;

  //this.renderer.scene.scale.multiplyScalar( .3 );
  
  // TODO: place renderer.scene properly
  //scene.add( this.renderer.scene );


}

Controller2D.prototype = {

  loopThroughIntersections: function(){

    // Saves the intersections
    // than clears them
    this.oIntersections = this.intersections;
    
    var intersections = [];

    // Builds the proper line equation from our global plane
    var line = [ plane[0] , plane[1] , plane[4] ];

    for( var i = 0; i < this.equations.length; i ++){

      // Solution of intersection
      var p = this.math.intersect( line , this.equations[i] );

      if( 
        p[0] <= 1 && p[0] >= 0 &&
        p[1] <= 1 && p[1] >= 0 
      ){

        var intersection = this.convertToThree( p );
        intersections.push( intersection );

      }

    }

    this.intersections = intersections;



    this.flatIntersections = [];

    // Gets our flat points
    // TODO: This will be very different for 3D -> 2D
    if( this.intersections.length == 2 ){

      var d = intersections[0].distanceTo( intersections[1] );
     
      var p1 = this.convertToThree( [ -d/2 , 0 ] );
      var p2 = this.convertToThree( [  d/2 , 0 ] );
      
      this.flatIntersections.push( p1 , p2 );

    }
  
  },


  // Converts to a THREE vector, We are keeping it 3D
  // just so it is easier to draw it
  convertToThree: function( p ){

    var v = new THREE.Vector3( p[0] , p[1] , 0 );
    return v;

  },


  update:function(){

    this.loopThroughIntersections();
    this.renderer.update();

  }


}





// This needs to operate on the same 'PLANE' as everything else

function Math2D(controller){

  this.controller = controller;

}


Math2D.prototype = {

  intersect: function( line , edge ){
      
    /* Solving the set of linear equation:

      // equation for line
      x + y = offset 

      //equation for edge
      x + y = offset

      ( will be either x = 0 , x = 1 , y = 0 or y = 1)

      Solving via matrix multiplication:
       _       _    _         _      _       _
      | x  , y  |  | solutionX |  = | offset  |
      | x1 , y1 |  | solutionY |  = | offset1 |
      
      OR
       _         _                 _       _
      | solutionX |  =  Inverse   | offset  |
      | solutionY |  =  of Matrix | offset1 |

    */

    var matrix        = [
                          line[0] , line[1] ,
                          edge[0] , edge[1]
                        ]

    var rightHandSide = [ line[2] , edge[2] ];
    var transpose     = [];
    var inverse       = []; 
    var solution      = [];

    mat2.transpose( transpose , matrix );
    mat2.invert( inverse , transpose ); 

    vec2.transformMat2( solution, rightHandSide, inverse );

    return solution;

  }


}


/*
 *  RENDERER2D
 *
 *  This is what will actuall do the 'renderering'
 *  of the 2D -> 1D beauty. And by renderering I mean
 *  it updates the positions of everything that needs
 *  to be drawn. The positions, however, are determined
 *  by Math2D
 *
 */
function Renderer2D( controller ){

  this.controller           = controller;

  this.size                 = controller.params.size;
  this.color                = controller.params.color;
  this.color1               = controller.params.color1;
  this.color2               = controller.params.color2;
  this.linewidth            = controller.params.linewidth;

  this.cornerMeshes         = [];


  this.material             = new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0x8F7845,
    diffuse:      0x8F7845,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.FlatShading,
    //opacity:      .5,
    transparent:  true
        
    });

  this.wireframeMaterial    = new THREE.MeshPhongMaterial({

   
    color:        0xaaaaaa,
    emissive:     0xaaaaaa,
    specular:     0xaaaaaa,
    diffuse:      0xaaaaaa,
    shinines:     1000,
    ambient:      0xaaaaaa,
    shading:      THREE.FlatShading,
    opacity:      .5,
    //wireframe:    true,
    //wireframeLinewidth: 4,
    transparent:  true
        
  });

  this.wireframeMaterial = new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0x8F7845,
    diffuse:      0x8F7845,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.SmoothShading,
    opacity:      .5,
    transparent:  true
        
  });  

  this.connectorMaterial    = new THREE.LineBasicMaterial({
  
    color:      this.color,
    linewidth:  this.linewidth
  
  });
  this.geometry             = new THREE.CubeGeometry( .1 , .1 , .1 );

  this.scene                = new THREE.Object3D();

  this.title                = textCreator.createMesh({
   
    string:"1D slices of 2D",
    size: 100

  });

  this.title.scale.multiplyScalar( .002 );
  this.scene.add( this.title );

  this.title.position.y = 1;
  this.title.position.x = .5;
  this.title.position.z = -.5;

  var geo = new THREE.PlaneGeometry( 3.4 , 2.1 );
  var mat = new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0x8F7845,
    diffuse:      0x8F7845,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.FlatShading,
    opacity:      .5,
    transparent:  true
        
  });  
  
  this.border = new THREE.Mesh( geo , mat );

  this.border.position.z = -.6;
  this.border.position.x =  .5;
  this.border.position.y =  .25;
  this.scene.add( this.border );



  this.initFullScene();
  this.initFlatScene();


}

Renderer2D.prototype = {


  /*
   *  FULL SCENE
   */ 
  initFullScene:function(){

    // Create the scene
    this.fullScene  = new THREE.Object3D();

    // Lets get a light in here
   /* this.fullScene.light = new THREE.PointLight( this.color , 5 , 10 );
    this.fullScene.light.position.z = .25;
    this.fullScene.light.position.x = .5;
    this.fullScene.light.position.y = .5;
    this.fullScene.add( this.fullScene.light );*/
    
    // First off draw a plane
    var geo = new THREE.PlaneGeometry( 1 , 1 );
    this.fullScene.wireframe = new THREE.Mesh( geo , this.wireframeMaterial );

    this.fullScene.wireframe.scale.multiplyScalar( .8 );

   
    // Need to make sure to center it
    // So the math is on the edges
    // Pretty Hack-y , but keeps the math more simple
    // TODO: Clean up
    this.fullScene.wireframe.position.x =   .5;
    this.fullScene.wireframe.position.y =   .5;
    this.fullScene.wireframe.position.z = -.01;

    this.fullScene.add( this.fullScene.wireframe );


    // Next create our connector
    var geo = new THREE.Geometry();
    geo.vertices.push( new THREE.Vector3() );
    geo.vertices.push( new THREE.Vector3() );

    this.fullScene.connector = new THREE.Line( geo , this.connectorMaterial );
    this.fullScene.add( this.fullScene.connector );

    
    // Holds all the objects for the full intersections
    this.fullScene.intersections = [];

    // Second set up the intersections.
    // There are only 2 possible for 2D
    // So its easy enough
    for( var i = 0; i < 2; i++ ){
      
      var mesh = new THREE.Mesh( this.geometry , this.material );
      var light = new THREE.PointLight( this.color , 3 , .3 );
     // mesh.add( light );


      this.fullScene.intersections.push( mesh );
      this.fullScene.add( mesh );

    }
     
    // Placing the scene
    // So that the box which we moved up is centered
    this.fullScene.position.x = 1;
    this.fullScene.position.y = -.5;

    //Finally adding it to the scene
    this.scene.add( this.fullScene  );
  
  },



  /*
   *  HYPER SCENE
   */
  initFlatScene:function(){

    // Create the scene
    this.flatScene  = new THREE.Object3D();

    // Lets get a light in here
    this.flatScene.light = new THREE.PointLight( this.color , 1 , 1 );
    this.flatScene.light.position.z = .25;
    //this.flatScene.add( this.flatScene.light );

    
    // Creating our connector
    var geo = new THREE.Geometry();
    geo.vertices.push( new THREE.Vector3() );
    geo.vertices.push( new THREE.Vector3() );

    this.flatScene.connector = new THREE.Line( geo , this.connectorMaterial );
    this.flatScene.add( this.flatScene.connector );

    // Holds all the objects for the full intersections
    this.flatScene.intersections = [];

    // Second set up the intersections.
    // There are only 2 possible for 2D
    // So its easy enough
    for( var i = 0; i < 2; i++ ){
      
      var mesh = new THREE.Mesh( this.geometry , this.material );
      this.flatScene.intersections.push( mesh );
      this.flatScene.add( mesh );

    }
     
    // Placing the scene
    this.flatScene.position.y = 0;

    //Finally adding it to the scene
    this.scene.add( this.flatScene  );
  
  },


  updateFullScene:function(){

    var intersections = this.controller.intersections;
    
    for( var i = 0; i < this.fullScene.intersections.length; i ++ ){
      if( intersections[i] ){
        this.fullScene.intersections[i].position = intersections[i];
      }else{
        this.fullScene.intersections[i].position.x = 1000000;
      }
    }

    // Resets our connector
    var geo = this.fullScene.connector.geometry
    geo.vertices[0] = this.fullScene.intersections[0].position;
    geo.vertices[1] = this.fullScene.intersections[1].position;

    geo.verticesNeedUpdate = true;

  },

  
  updateFlatScene: function(){

    var intersections = this.controller.flatIntersections;

    // If there is an intersection, 
    // than position our intersection point properly,
    // otherwise move that shit offscreen
    for( var i = 0; i < this.flatScene.intersections.length; i ++ ){
      if( intersections[i] ){
        this.flatScene.intersections[i].position = intersections[i];
      }else{
        this.flatScene.intersections[i].position.x = 1000000;
      }
    }

    // Resets our connector
    var geo = this.flatScene.connector.geometry;
    geo.vertices[0] = this.flatScene.intersections[0].position;
    geo.vertices[1] = this.flatScene.intersections[1].position;

    geo.verticesNeedUpdate = true;


  },



  update:function(){

    this.updateFullScene();
    this.updateFlatScene();

  }

}
