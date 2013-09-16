

var container , scene , camera, controls, renderer , stats;

var tesseract , tesseractScene , tesseractGeometry , tesseractMaterial;

function initScene(){

  container = document.getElementById( 'container' );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );

  camera.position.z = 3;

  controls = new THREE.OrbitControls( camera );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right    = '0px';
  stats.domElement.style.bottom   = '0px';

  // our tesseract will always be added to its own scene
  // so it is properly positioned
  tesseractScene = new THREE.Object3D();
  tesseractScene.position.x = -.5;
  tesseractScene.position.y = -.5;
  tesseractScene.position.z = -.5;

  tesseractMaterial = new THREE.MeshLambertMaterial({
   
    color:        0x009E8E , 
    shading:      THREE.FlatShading,
    opacity:      1,
    transparent:  true
        
  });


  scene.add( tesseractScene );

  var light = new THREE.DirectionalLight({ color:0x009E8E });
  scene.add( light );


  var light = new THREE.PointLight(0xFFAB00	, 3 , 5);
  light.position.z = 1;
  scene.add( light ); 
  
  container.appendChild( renderer.domElement );
  container.appendChild( stats.domElement )

}


function render() {

  controls.update();
  stats.update();
  renderer.render(scene, camera);

}

/*
 *  Returns set of 3JS vectors so we can pass them into
 *  convex geometry, or particles system, etc.
 *
 */
function convertToPoints( points , projection ){

  var toReturn = [];
  for( var i = 0 ; i < points.length ; i++ ){

    var v = new THREE.Vector3( 
      points[i][ projection ][0] , 
      points[i][ projection ][1] , 
      points[i][ projection ][2]
    );

    toReturn.push( v );
  }

  return toReturn

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

  tesseract = new THREE.Mesh( tesseractGeometry, tesseractMaterial );

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

  notes.array[ hitCorners[i] ].play();

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
