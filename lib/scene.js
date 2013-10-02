

var container , scene , camera, controls, renderer , stats;

var tesseract , tesseractScene , tesseractGeometry , tesseractMaterials, tesseractTexture;

var initScene = function(){

  container = document.getElementById( 'container' );

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog( 0x000000 , 3.5 , 8 );
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.5, 50 );

  camera.position.z = 5;
  //camera.position.y = -1;

  //controls = new THREE.OrbitControls( camera );

 
  // TODO: take out
  //var light = new THREE.AmbientLight( 0xff0000 );
  //scene.add( light );

  var light = new THREE.DirectionalLight( 0xAB0038 , 1);
  light.position.set( 0 , 1 , 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0x004294 , 1);
  light.position.set( 0 , -1 , 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xA17F00 , 1);
  light.position.set( 1 , 0 , 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0x41AB02 , 1);
  light.position.set( -1 , 0 , 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xA14C00 , 1);
  light.position.set( 0 , 0 , 1);
  scene.add( light );


  /*var light = new THREE.PointLight( 0xffffff , 5 , 5);
  light.position.set( 0 , 0 , 5 );
  scene.add( light );*/

  /*var light = new THREE.PointLight( 0xffffff , 1 , 5);
  light.position.set( 3 , 0 , 0 );
  scene.add( light );

  var light = new THREE.PointLight( 0xffffff , 1 , 5);
  light.position.set( -3 , 0 , 0 );
  scene.add( light );*/










 // var light = new THREE.PointLight(0xaaaaaa	, 3 , 5);
 // light.position.z = 1;
 // scene.add( light ); 


  // our tesseract will always be added to its own scene
  // so it is properly positioned
  tesseractScene = new THREE.Object3D();
  tesseractScene.position.x = -.5;
  tesseractScene.position.y = -.5;
  tesseractScene.position.z = -.5;


  var map = THREE.ImageUtils.loadTexture( 'textures/texture1.png' );
				map.wrapS = map.wrapT = THREE.RepeatWrapping;
				map.anisotropy = 16;


  tesseractMaterials = [
    new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0xffffff,
    diffuse:      0xffffff,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.FlatShading,
    opacity:      1,
    transparent:  true
        
    }),

   
  ];


  scene.add( tesseractScene );


  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right    = '0px';
  stats.domElement.style.bottom   = '0px';

  container.appendChild( renderer.domElement );
  container.appendChild( stats.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
}




function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}




/*
 *  Returns set of 3JS vectors so we can pass them into
 *  convex geometry, or particles system, etc.
 *
 */
function convertToPoints( points , projection ){

  var toReturn = [];
  for( var i = 0 ; i < points.length ; i++ ){

    var v = convertToThree(  points[i][ projection ] );
    toReturn.push( v );
 
  }

  return toReturn

}

function convertToThree( point ){

  var v = new THREE.Vector3( point[0] , point[1] , point[2] );
  return v;

}





// Gets
function assignIntersections(){

  // Save the intersections form last frame
  // so we can see what changed
  oIntersections = intersections;

  // Get all the intersection points
  intersections = loopThroughIntersections();

  //console.log( intersections );

}

function createTesseractGeometry(){

  if( intersections.length > 0 ){
 
    var points = convertToPoints( intersections , 0);
    tesseractGeometry = new THREE.ConvexGeometry( points );

  }else{

    // Makes sure that a null geo is returned, 
    // so we don't get errors
    tesseractGeometry = new THREE.Geometry();
  
  }

}


function updateTesseract(){

  // Removes the old tesseract geometry
  if( tesseractScene.children[0] )
    tesseractScene.remove( tesseractScene.children[0] );

  tesseract = THREE.SceneUtils.createMultiMaterialObject( 
        tesseractGeometry, 
        tesseractMaterials 
  );
  //tesseract = new THREE.Mesh( tesseractGeometry, tesseractMaterial );

  tesseractScene.add( tesseract );

}


function checkForHitCorners(){

  // Get which Vertices have changed
  changedVerts = changedVertexFaces( intersections, oIntersections );

  if( changedVerts ){
    hitCorners = checkCorners( changedVerts );
    for( var i = 0; i < hitCorners.length; i ++ ){
      cornerHit( i );
    }
  }

}

function cornerHit( i ){

  if( app.cornerHit )
    app.cornerHit( i );

}

function drawIntersections(){

  // Assigns our global intersections and oIntersection values
  assignIntersections();
 
  // creates our tesseract, and updates it by adding to 
  // the tesseract scene
  createTesseractGeometry();
  
  // Adds the mesh to the scene
  updateTesseract();

}


function createPSystem( points , material ){

  var geo = new THREE.Geometry();
  geo.vertices = points;
  
  var pSys = new THREE.ParticleSystem( geo , material );
  
  scene.add( pSys );

}
