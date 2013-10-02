
var tesseractModel;

// Based on corners in ../lib/4d.js
var tesseractCorners = [
  
  [ -1 , -1 , -1 ],
  [ -2 , -2 , -2 ],
  [ -1 , -1 ,  1 ],
  [ -2 , -2 ,  2 ],

  [ -1 ,  1 , -1 ],
  [ -2 ,  2 , -2 ],
  [ -1 ,  1 ,  1 ],
  [ -2 ,  2 ,  2 ],

  [  1 , -1 , -1 ],
  [  2 , -2 , -2 ],
  [  1 , -1 ,  1 ],
  [  2 , -2 ,  2 ],

  [  1 ,  1 , -1 ],
  [  2 ,  2 , -2 ],
  [  1 ,  1 ,  1 ],
  [  2 ,  2 ,  2 ]

]




  

function initTesseractModel(){

  tesseractModel = new THREE.Object3D();
  scene.add( tesseractModel );

  var lineMat = new THREE.LineBasicMaterial();

  var geo = new THREE.Geometry();
  
  for( var i = 0; i < tesseractCorners.length; i ++ ){

    var p = tesseractCorners[i];
    var vert = new THREE.Vector3( p[0] , p[1] , p[2] );

    geo.vertices.push( vert );

  }


  tesseractModel.geometry = geo;

  // If the vertices share any faces, than they are connected
  for( var i = 0; i < geo.vertices.length; i++ ){
  
    var v = geo.vertices[i];

    for( var j = i; j < geo.vertices.length; j++ ){

      var v1 = geo.vertices[j];

      var a   = v.x == v1.x && v.y == v1.y;
      var b   = v.z == v1.z && v.y == v1.y;
      var c   = v.x == v1.x && v.z == v1.z;

      // Gettin the 'inwards lines' 
      var d1x = v.x == ( v1.x * 2 )
      var d1y = v.y == ( v1.y * 2 )
      var d1z = v.z == ( v1.z * 2 )
      var d1  = d1x && d1y && d1z;
      
      var d2x = v1.x == ( v.x * 2 )
      var d2y = v1.y == ( v.y * 2 )
      var d2z = v1.z == ( v.z * 2 )
      var d2  = d2x && d2y && d2z;

      var d   = d1 || d2;

      if( a || b || c || d ){

        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push( v.clone() );
        lineGeo.vertices.push( v1.clone() );
        var line = new THREE.Line( lineGeo , lineMat );

        tesseractModel.add( line );

      }

    }

  }


  tesseractModel.corners = [];

  var cornerGeo = new THREE.IcosahedronGeometry( .3 , 1 );
  for( var i = 0; i < geo.vertices.length; i ++ ){

    
    
    //var corner = new THREE.Object3D();
    //corner.geometry = cornerGeo;

    //for( var j = 0; j < 8; j++ ){
    
      var corner = new THREE.Mesh( cornerGeo , particleMaterials[0] );
      //c.rotation.z = Math.PI * 2 * ( j / 8 );
      //corner.add( c );

    //}

    corner.position = geo.vertices[i].clone();

    tesseractModel.add( corner );

    tesseractModel.corners.push( corner );

  }


  tesseractModel.rotation.x = .3;
  tesseractModel.rotation.y = .3;
  tesseractModel.rotation.z = .3;

  tesseractModel.position.y = 1.5;

  tesseractModel.scale.multiplyScalar( .1 );


}
