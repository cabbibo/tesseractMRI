

var container , scene , clock, camera, controls, renderer , stats;

// Intersection geometry, and particle system
var iGeometry , pSystem, pMaterial, convexGeo, materials;

var lights = [];


// Global variable to test with in console
// TODO: TAKE OUT
var testVar , testVar1;

//var convexScene , xScene, yScene, zScene , wScene; 
var cubeScenes = [ ];


var iMesh

function initScene(){

  container = document.getElementById( 'container' );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );

  camera.position.z = 5;

  clock = new THREE.Clock();
  clock.start();
  
  materials = [

  new THREE.MeshLambertMaterial({ 
    color:0x009E8E , 
    shading:THREE.FlatShading,
    opacity: 1,
    transparent: true
  })

  ];


  var light = new THREE.DirectionalLight({ color:0x009E8E });

  scene.add( light );


  var light = new THREE.PointLight(0xFFAB00	, 3 , 5);
  light.position.z = 1;
  scene.add( light ); 




  /*
   *  Sets up all the cube scenes. 
   *
   *  cubeScene[0] will be slice in its plane
   *  and cubeScenes[1 - 4] are the projections
   *  of the slice onto the different basis
   *
   */
  cubeScenes[0] = new THREE.Object3D();

  cubeScenes[0].position.x = -.5;
  cubeScenes[0].position.y = -.5;
  cubeScenes[0].position.z = -.5;

  scene.add( cubeScenes[0] );

  /*for( var i = 1; i <= 4 ; i++){

    cubeScenes[i] = new THREE.Object3D();
    cubeScenes[i].position.x = - 5.5 + i * 2;
    cubeScenes[i].position.y = - 3;
    cubeScenes[i].position.z = -.5;

    scene.add( cubeScenes[i] );

  }*/

  controls = new THREE.OrbitControls( camera );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right    = '0px';
  stats.domElement.style.bottom   = '0px';
  
  container.appendChild( renderer.domElement );
  container.appendChild(stats.domElement )


}

function animate() {

  requestAnimationFrame( animate );
  
  controls.update();
  stats.update();


  /*plane[0] =  Math.sin( clock.getElapsedTime() );
  plane[1] =  Math.cos( clock.getElapsedTime() );
  plane[2] =  Math.sin( clock.getElapsedTime() * .1 );
  plane[3] =  Math.cos( clock.getElapsedTime() * .3 );*/
  //plane[4] =  3 * Math.cos( clock.getElapsedTime() * .3 );
  //console.log( plane );


  drawIntersections();

  renderer.render(scene, camera);

}


function convertToThree( points , scene ){


  var toReturn = [];
  for( var i = 0 ; i < points.length ; i++ ){

    var v = new THREE.Vector3( 
      points[i][scene][0] , 
      points[i][scene][1] , 
      points[i][scene][2]
    );

    toReturn.push( v );
  }

  return toReturn

}


function drawIntersections(){

  //console.log( intersections.length );

  setRotationMatrices( plane );

  // Save the intersections form last frame
  // so we can see what changed
  oIntersections = intersections;

  // Get all the intersection points
  intersections = loopThroughIntersections();

  
  // 
  var changedVerts = changedVertexFaces( intersections, oIntersections );

  if( changedVerts ){
  
    hitCorners = checkCorners( changedVerts );

    for( var i = 0; i < hitCorners.length; i ++ ){
      
      notes.array[ hitCorners[i] ].play();

    }
  
  }
  
  if( intersections.length > 0 ){
    for( var i = 0; i < cubeScenes.length; i++ ){
     
      // Gets rid of the geometry for this scene
      if( cubeScenes[i].children[0] ){
        cubeScenes[i].remove( cubeScenes[i].children[0] );
      }

      // converts the points of intersection for a convex geometry
      var points = convertToThree( intersections , i );
      cubeScenes[i].geo  = new THREE.ConvexGeometry( points );
      //cubeScenes[i].geo.computeFaceNormals();
      //cubeScenes[i].geo.computeVertexNormals();

      if( i == 2 ){
        //console.log( points.length );
        testVar1 = points;
        testVar = cubeScenes[i].geo;

      }

      //console.log( geo );
           // Lastly create the mesh and add it to the scene
      //var mesh = THREE.SceneUtils.createMultiMaterialObject( geo , materials );
      var mesh = new THREE.Mesh( cubeScenes[i].geo , materials[0] );
      cubeScenes[i].add( mesh );

    }
  }else{
    cubeScenes[0].geo = new THREE.Geometry();
  }

  placeGeos( cubeScenes[0].geo );
}


function createPSystem( points ){

  var geo = new THREE.Geometry();
  geo.vertices = points;

  var material = new THREE.ParticleBasicMaterial({ color:0xff0000, size: .1 });

  var pSys = new THREE.ParticleSystem( geo , material );

  pSys.x = 2;
  scene.add( pSys );

}

 /* Loop to get all faces 
  for( var i = 0; i < equations.length;  i++ ){

    var shared = [];
    for( var j = 0; j < intersections.length; j++ ){

      if( 
        intersections[j][4] == i ||
        intersections[j][5] == i ||
        intersections[j][6] == i ||
      )
      shared.push( j );
    }

    for( var j = 0 ; j < shared.length; j ++ ){


    }


  }
  for( var i = 0;   i < intersections.length; i++ ){
  for( var j = i+1; j < intersections.length; j++ ){
  for( var k = j+1; k < intersections.length; k++ ){

    var i1 = intersections[i];
    var i2 = intersections[j];
    var i3 = intersections[k];

    for( var a = 4; a <= 6; a++ ){
    for( var b = a; b <= 6; b++ ){
    for( var c = b; c <= 6; c++ ){

      if( i1[a] == i2[b] && i1[a] == i3[c] ){
        iGeometry.faces.push( new THREE.Face3( i , j , k ) );
      }

    }
    }
    }
      
  }
  }
  }

*/
