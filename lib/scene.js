

var container , scene , camera, controls, renderer , stats;

var tesseract , tesseractScene , tesseractGeometry , tesseractMaterials;

var initScene = function(){

  container = document.getElementById( 'container' );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.5, 50 );

  camera.position.z = 5;

  controls = new THREE.OrbitControls( camera );

 
  // TODO: take out
  //var light = new THREE.AmbientLight( 0xff0000 );
  //scene.add( light );

  var light = new THREE.DirectionalLight( 0xaaaaff , 2);
  light.position.set( 0 , 1 , 0 );
  scene.add( light );


  var light = new THREE.PointLight(0xaaaaaa	, 3 , 5);
  light.position.z = 1;
  scene.add( light ); 


  // our tesseract will always be added to its own scene
  // so it is properly positioned
  tesseractScene = new THREE.Object3D();
  tesseractScene.position.x = -.5;
  tesseractScene.position.y = -.5;
  tesseractScene.position.z = -.5;

  tesseractMaterials = [
    new THREE.MeshLambertMaterial({
   
    color:        0xaaaaaa , 
    shading:      THREE.FlatShading,
    opacity:      1,
    transparent:  true
        
    }),

    new THREE.MeshLambertMaterial({
   
      color:        0x333333 , 
      shading:      THREE.FlatShading,
      opacity:      1,
      transparent:  true,
      wireframe:    true
        
    })

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


function render() {

  controls.update();
  stats.update();
  renderer.render(scene, camera);

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

  notes.array[ hitCorners[i][0] ].play();

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
