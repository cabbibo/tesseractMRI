
subScenes = [];


geoSizes = [ .3 , .1 , .04 ];




var geos = [
  new THREE.CubeGeometry( geoSizes[0] , geoSizes[0] , geoSizes[0]  ),
  new THREE.CubeGeometry( geoSizes[1] , geoSizes[1] , geoSizes[1]  ),
  new THREE.CubeGeometry( geoSizes[2] , geoSizes[2] , geoSizes[2]  ),
]

var geoMaterials = [

  new THREE.MeshLambertMaterial({ color:0xFF6C00 }),
  new THREE.MeshLambertMaterial({ color:0xFFAB00 }),
  new THREE.MeshLambertMaterial({ color:0xF10026 }),

]

//var geoMat = new THREE.MeshNormalMaterial();
function initGeos( numOfGeos ){

  for( var i =0; i < numOfGeos; i ++ ){

    var subScene = new THREE.Object3D();

    subScene.position.x = (Math.random() -.5 ) * 4;
    subScene.position.y = (Math.random() -.5 ) * 4;
    subScene.position.z = (Math.random() -.5 ) * 4;

    var mesh = new THREE.Mesh(
        geos[0],
        geoMaterials[0] 
    );
    subScene.add( mesh );
    

    subScene.subScenes = [];

    for( var j = 0 ; j < numOfGeos; j++ ){
  
      var subSubScene = new THREE.Object3D();

      subSubScene.position.x = (Math.random() -.5 ) * 4;
      subSubScene.position.y = (Math.random() -.5 ) * 4;
      subSubScene.position.z = (Math.random() -.5 ) * 4;

      var mesh = new THREE.Mesh(
        geos[1],
        geoMaterials[1] 

      );
      
      subSubScene.add( mesh );
      subScene.add( subSubScene )

      
      subSubScene.subScenes = [];

      for( var k = 0; k < numOfGeos; k++){

        var subSubSubScene = new THREE.Object3D();

        subSubSubScene.position.x = (Math.random() -.5 ) * 4;
        subSubSubScene.position.y = (Math.random() -.5 ) * 4;
        subSubSubScene.position.z = (Math.random() -.5 ) * 4;

        var mesh = new THREE.Mesh(
          geos[2],
          geoMaterials[2] 
        );
        
        subSubSubScene.add( mesh );
        subSubScene.add( subSubSubScene )

        subSubScene.subScenes.push( subSubSubScene );
        //subSubScene.subScenes = [];



      }

      subScene.subScenes.push( subSubScene );

    }




    scene.add( subScene );

    subScenes.push( subScene );
      

  }


}




function placeGeos( geo ){

  //console.log( geo );

  for( var i = 0; i < geo.vertices.length; i++){


    var subScene = subScenes[i];
    var vertex= geo.vertices[i];

    subScene.position.copy( vertex );
    subScene.position.x -= .5;
    subScene.position.y -= .5;
    subScene.position.z -= .5;
    subScene.position.multiplyScalar( 3 );
    subScene.rotation.copy( vertex );



    for( var j = 0; j < geo.vertices.length; j ++ ){

      var ss = subScene.subScenes[j];
      var vertex = geo.vertices[j];


      ss.position.copy( vertex );
      ss.position.x -= .5;
      ss.position.y -= .5;
      ss.position.z -= .5;
      ss.position.multiplyScalar( 1 );
      ss.rotation.copy( vertex );


      for( var k = 0; k < geo.vertices.length; k ++ ){
        
        var sss = ss.subScenes[k];
        var vertex = geo.vertices[k];


        sss.position.copy( vertex );
        sss.position.x -= .5;
        sss.position.y -= .5;
        sss.position.z -= .5;
        sss.position.multiplyScalar( 1 );
        sss.rotation.copy( vertex );

        

      }

    }
    //subScene.position.add( face.centroid );
    
    //subScene.position = 

    //console.log( vertex );

  }

  for( var i = geo.vertices.length ; i < subScenes.length; i ++) {

    subScenes[i].position.x = 500;
    subScenes[i].subScenes[i].position.x = 500;
    subScenes[i].subScenes[i].subScenes[i].position.x = 500;

  }


  /*for( var i =0; i < subScenes.length; i ++ ){

    /*if( subScenes[i].children[0] ){
      subScenes[i].remove( subScenes[i].children[0] );
    }*/
    /*for( var j = 0 ; j < subScenes.children.length; j ++ ){

      var child = subScenes.children[j];

      //if( child instanceOf THREE.Mesh ){
        subScene.remove( child );
      //}

    }

    var mesh = new THREE.Mesh( geo , geoMat );

      //subScenes[i].add( mesh );

  }*/

}
