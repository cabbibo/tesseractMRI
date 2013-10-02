function Controller3D( params ){

  this.params = _.defaults( params || {}, {
   
    size:         2,
    color:        0xaaaaaa,
    color1:       0xAB0038,
    color2:       0xA17F00,
    linewidth:    5,

  });

  this.equations = [

    // X = 0 
    [ 1 , 0 , 0 , 0 ],

    // X = 1
    [ 1 , 0 , 0 , 1 ],

    // Y = 0
    [ 0 , 1 , 0 , 0 ],

    // Y = 1
    [ 0 , 1 , 0 , 1 ],

    // Z = 0
    [ 0 , 0 , 1 , 0 ],

    // Z = 1
    [ 0 , 0 , 1 , 1 ],

  ];

  // Holds the intersections and oIntersections
  this.intersections      = [];
  this.oIntersections     = [];

  // holds the flattened intersections
  this.flatIntersections  = [];

  this.math     = new Math3D( this );
  this.renderer = new Renderer3D( this );

  this.renderer.scene.position.z =  0;
  this.renderer.scene.position.x = 3;

  // TODO: place renderer.scene properly
  scene.add( this.renderer.scene );


}

Controller3D.prototype = {

  loopThroughIntersections: function(){

    // Saves the intersections
    // than clears them
    this.oIntersections = this.intersections;
    
    this.intersections = [];

    this.flatIntersections = [];

    // Builds the proper line equation from our global plane
    var slice = [ plane[0] , plane[1] , plane[2] , plane[4] ];

    for( var i = 0; i < this.equations.length; i ++ ){
      for( var j = i; j < this.equations.length; j++ ){

        var face1 = this.equations[i];
        var face2 = this.equations[j];

        // Solution of intersection
        var p = this.math.intersect( slice , face1 , face2 );

        if( 
          p[0] <= 1 && p[0] >= 0 &&
          p[1] <= 1 && p[1] >= 0 &&
          p[2] <= 1 && p[2] >= 0
        ){

          // Regular
          var intersection        = this.convertToThree( p );
              intersection.edges  = [ i , j ];

          this.intersections.push( intersection );

          //Flattened
          var flat = this.math.transform( p , this.iRotationMatrix );
          // may need to add this in
          flat.z = 0;
          
          var flatIntersection        = this.convertToThree( flat );
              flatIntersection.edges  = [ i , j ];

          this.flatIntersections.push( flatIntersection );
        

        }

      }

    }


  },

  // Converts to a THREE vector, We are keeping it 3D
  // just so it is easier to draw it
  convertToThree: function( p ){

    var v = new THREE.Vector3( p[0] , p[1] , p[2] );
    return v;

  },


  update:function(){

    this.iRotationMatrix = this.math.getInvertedRotationMatrix( plane );

    this.loopThroughIntersections();
    this.renderer.update();

  }


}





// This needs to operate on the same 'PLANE' as everything else

function Math3D(controller){

  this.controller = controller;

}


Math3D.prototype = {

  intersect: function( plane , face1 , face2 ){

    var matrix = [
      plane[0] , plane[1] , plane[2],
      face1[0] , face1[1] , face1[2],
      face2[0] , face2[1] , face2[2]
    ]

    var transpose  = [];

    mat3.transpose( transpose , matrix );

    var inverse = [];

    mat3.invert( inverse , transpose );

    // Our plane has 4 
    var rightHandSide = [ plane[3], face1[3] , face2[3] ];

    var solution = [];

    vec3.transformMat3( solution , rightHandSide , inverse );

    return solution;
    
  },

  /*
   *    Returns a Inverted Rotation matrix for use 
   *    in vec3.transformMat3
   *
   */
  getInvertedRotationMatrix: function( plane ){
    
    var zAxis   = [   0      ,    0     ,    1     ];
    var normal  = [ plane[0] , plane[1] , plane[2] ];
 
    var vector1 = [];
    vec3.cross( vector1 , zAxis , normal );

    var vector1Normalized = [];
    vec3.normalize( vector1Normalized , vector1 );

    var vector2 = [];
    vec3.cross( vector2 , vector1Normalized , normal );

    var vector2Normalized = [];
    vec3.normalize( vector2Normalized , vector2 );


    var A = [
      vector1Normalized[0]  , vector1Normalized[1]  , vector1Normalized[2] ,
      vector2[0]            , vector2[1]            , vector2[2] ,
      normal[0]             , normal[1]             , normal[2]
    ];


    var a = [
      vector1Normalized[0] , vector2[0] , normal[0],
      vector1Normalized[1] , vector2[1] , normal[1],
      vector1Normalized[2] , vector2[2] , normal[2],
    ]
   
    return a

  },


  transform: function( point , iRotMatrix ){
    
    var newPoint = [];

    vec3.transformMat3( newPoint , point , iRotMatrix );

    //console.log( newPoint );

    return newPoint;

  }



}


/*
 *  RENDERER3D
 *
 *  This is what will actuall do the 'renderering'
 *  of the 3D -> 2D beauty. And by renderering I mean
 *  it updates the positions of everything that needs
 *  to be drawn. The positions, however, are determined
 *  by Math3D
 *
 */
function Renderer3D( controller ){

  this.controller           = controller;

  this.size                 = controller.params.size;
  this.color                = controller.params.color;
  this.color1               = controller.params.color1;
  this.color2               = controller.params.color2;
  this.linewidth            = controller.params.linewidth;

  
  this.material             = new THREE.MeshPhongMaterial({

   
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

  this.wireframeMaterial    = new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0x8F7845,
    diffuse:      0x8F7845,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.FlatShading,
    side:         THREE.DoubleSide,
    opacity:      .5,
    transparent:  true
        
    });

  this.connectorMaterial    = new THREE.LineBasicMaterial({
  
    color:      this.color,
    linewidth:  this.linewidth
  
  });

  this.geometry             = new THREE.CubeGeometry( .1 , .1 , .1 );

  this.scene                = new THREE.Object3D();


  this.initFullScene();
  this.initFlatScene();


}

Renderer3D.prototype = {


  /*
   *  FULL SCENE
   */ 
  initFullScene:function(){

    // Create the scene
    this.fullScene  = new THREE.Object3D();

    
    // First off draw a Cube
    var geo = new THREE.CubeGeometry( 1 , 1 , 1 );
    
    this.fullScene.wireframe = new THREE.Mesh( geo , this.wireframeMaterial );

    this.fullScene.wireframe.scale.multiplyScalar( .99 );

    // Need to make sure to center it
    // So the math is on the edges
    // Pretty Hack-y , but keeps the math more simple
    // TODO: Clean up
    this.fullScene.wireframe.position.x = .5;
    this.fullScene.wireframe.position.y = .5;
    this.fullScene.wireframe.position.z = .5;

    this.fullScene.add( this.fullScene.wireframe );

    this.fullScene.connections = [];
    
    for( var  i = 0; i < 6; i ++ ){
    
      // Next create our connector
      var geo = new THREE.Geometry();
      geo.vertices.push( new THREE.Vector3( 1 , 1  ,1 ) );
      geo.vertices.push( new THREE.Vector3( 1 , -1 , 1) );

      var connection = new THREE.Line( geo , this.connectorMaterial );

      this.fullScene.connections.push( connection );
      this.fullScene.add( connection );

    }
    
    // Holds all the objects for the full intersections
    this.fullScene.intersections = [];

    // Second set up the intersections.
    // There are only 2 possible for 2D
    // So its easy enough
    for( var i = 0; i < 6; i++ ){
      
      var mesh = new THREE.Mesh( this.geometry , this.material );
      var light = new THREE.PointLight( this.color , 50 , .3 );
      mesh.add( light );
      this.fullScene.intersections.push( mesh );
      this.fullScene.add( mesh );

    }
     
    // Placing the scene
    // So that the box which we moved up is centered
    this.fullScene.position.x = -.5 ;
    this.fullScene.position.y = .25 ;
    this.fullScene.position.z = -.5 ;

    //Finally adding it to the scene
    this.scene.add( this.fullScene );
  
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
    this.flatScene.add( this.flatScene.light );

        
    this.flatScene.connections = [];

    for( var  i = 0; i < 6; i ++ ){
    
      // Next create our connector
      var geo = new THREE.Geometry();
      geo.vertices.push( new THREE.Vector3() );
      geo.vertices.push( new THREE.Vector3() );

      var connection = new THREE.Line( geo , this.connectorMaterial );

      this.flatScene.connections.push( connection );
      this.flatScene.add( connection );

    }
    
    // Holds all the objects for the full intersections
    this.flatScene.intersections = [];

    for( var i = 0; i < 6; i++ ){
      
      var mesh = new THREE.Mesh( this.geometry , this.material );
      this.flatScene.intersections.push( mesh );
      this.flatScene.add( mesh );

    }

    // Placing the scene
    this.flatScene.position.y = -1;

    //Finally adding it to the scene
    this.scene.add( this.flatScene  );
  
  },


  updateFullScene:function(){

    var intersections = this.controller.intersections;
    
    //console.log( 'c' );
    for( var i = 0; i < this.fullScene.intersections.length; i ++ ){
      if( intersections[i] ){
        this.fullScene.intersections[i].position = intersections[i];
      }else{
        this.fullScene.intersections[i].position.x = 1000000;
      }
    }

    for( var i = 0; i < this.fullScene.connections.length; i++ ){

      var geo = this.fullScene.connections[i].geometry;
      
      if( this.connections[i] ){

        geo.vertices[0] = this.connections[i][0];
        geo.vertices[1] = this.connections[i][1];
      
      }else{

        // GET THAT SHIT OUTTA HERE
        geo.vertices[0].x  = 1000000;
        geo.vertices[1]    = geo.vertices[0];

      }


      geo.verticesNeedUpdate = true;


    }


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
    
    for( var i = 0; i < this.flatScene.connections.length; i++ ){

      var geo = this.flatScene.connections[i].geometry;
      var v1  = geo.vertices[0];
      var v2  = geo.vertices[1];
      
      if( this.flatConnections[i] ){

        geo.vertices[0] = this.flatConnections[i][0];
        geo.vertices[1] = this.flatConnections[i][1];
      
      }else{

        geo.vertices[0].x  = 1000000;
        geo.vertices[1]    = geo.vertices[0];

      }

      geo.verticesNeedUpdate = true;

    }


  },


  updateConnections: function(){

    this.connections      = this.getConnections( this.controller.intersections );
    this.flatConnections  = this.getConnections( this.controller.flatIntersections );

  },

  update:function(){

    this.updateConnections();
    this.updateFullScene();
    this.updateFlatScene();

  },


  getConnections: function( points ){

    var connections = [];  

    for( var i = 0; i < points.length; i++ ){
      for( var j = i+1; j < points.length; j++ ){

        var p1 = points[i];
        var p2 = points[j];
        //console.log( p1 );

        if( 
          p1.edges[0] == p2.edges[0] || 
          p1.edges[0] == p2.edges[1] || 
          p1.edges[1] == p2.edges[0] || 
          p1.edges[1] == p2.edges[1]
        ){

          connections.push([ p1 , p2 ]);

        }

      }

    }

    return connections;

  },




}
