var cubeScenes = [ ];

function initGeos(){

  /*
   *  Sets up all the cube scenes. 
   *
   *  cubeScene[0] will be slice in its plane
   *  and cubeScenes[1 - 4] are the projections
   *  of the slice onto the different basis
   *
   */
  for( var i = 0; i <= 3 ; i++){

    cubeScenes[i] = new THREE.Object3D();
    cubeScenes[i].position.x = - 5.5 + i * 2;
    cubeScenes[i].position.y = - 1;
    cubeScenes[i].position.z = -.5;

    scene.add( cubeScenes[i] );

  }

}


function updateCubeScenes(){

  if( intersections.length > 0 ){

    for( var i = 0; i < cubeScenes.length; i++ ){
     
      // Gets rid of the geometry for this scene
      if( cubeScenes[i].children[0] ){
        cubeScenes[i].remove( cubeScenes[i].children[0] );
      }

      // converts the points of intersection for a convex geometry
      var points = convertToPoints( intersections , i+1 );
      var geo  = new THREE.ConvexGeometry( points );

      if( i == 2 ){

      } 

      // Lastly create the mesh and add it to the scene
      var mesh = new THREE.Mesh( geo , tesseractMaterial );
      cubeScenes[i].add( mesh );

    }
  }

}

