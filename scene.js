

var container , scene , camera, controls, renderer , stats;

// Intersection geometry, and particle system
var iGeometry , pSystem, pMaterial, convexGeo, materials;

//var convexScene , xScene, yScene, zScene , wScene; 
var cubeScenes = [ ];


var iMesh

function initScene(){

  container = document.getElementById( 'container' );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );

  camera.position.z = 3;

  materials = [

  new THREE.MeshNormalMaterial(),
  new THREE.MeshBasicMaterial({ color: 0xff0000, shading: THREE.FlatShading, wireframe: true } )

  ];



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
  cubeScenes[0].position.y = .5;
  cubeScenes[0].position.z = -.5;

  scene.add( cubeScenes[0] );

  for( var i = 1; i <= 4 ; i++){

    cubeScenes[i] = new THREE.Object3D();
    cubeScenes[i].position.x = - 5.5 + i * 2;
    cubeScenes[i].position.y = - 1;
    cubeScenes[i].position.z = -.5;

    scene.add( cubeScenes[i] );

  }

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

function render() {

  requestAnimationFrame(render);
  
  controls.update();
  stats.update();

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

  // Save the intersections form last frame
  // so we can see what changed
  oIntersections = intersections;

  // Get all the intersection points
  intersections = loopThroughIntersections();

  //console.log( 'frame' );
  //console.log( rotationMatrixT );
  for( var i = 0; i < intersections.length; i ++ ){
    //console.log( intersections[i].toString() );
  }

  for( var i = 0; i < cubeScenes.length; i++ ){
    
    if( cubeScenes[i].children[0] ){
      cubeScenes[i].remove( cubeScenes[i].children[0] );
    }

    var points = convertToThree( intersections , i );
    var geo  = new THREE.ConvexGeometry( points );
    var mesh = THREE.SceneUtils.createMultiMaterialObject( geo , materials );
    cubeScenes[i].add( mesh);

  }
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
