function MANDALA( 
  // All of these objects are arrays that must be the same length
  startingSize,   // Just a number
  size ,          // Size of each ring
  radius ,        // The radius of the each ring
  geo ,           // Geo in each ring
  material ,      // Material in each ring
  numberOf        // Number of objects in each ring
){

  this.sizeArray      = size;
  this.radiusArray    = radius;
  this.matArray       = material;
  console.log( this.matArray )
  this.numberOfArray  = numberOf;
  this.geoArray       = geo;


  this.dataArray = [];

  for( var i = 0; i < this.geoArray.length; i ++ ){

    var data = this.geoArray[i].clone();
    this.dataArray.push( data );

  }

  this.scene = new THREE.Object3D();
  this.scene.subScenes = [];
  scene.add( this.scene );

  this.subRing = 0;

  this.startingSize = startingSize;

  this.createRings(this.scene, new THREE.Vector3( 0 , 0 , 0 ) , 0);


}

MANDALA.prototype = {

  createRings:function( whichScene, position , level ){


    if( level < this.sizeArray.length){

      
      var subScene = new THREE.Object3D();
      subScene.position = position;
      subScene.subScenes = [];
      whichScene.subScenes.push(subScene);
      whichScene.add( subScene );


      for( var i = 0; i < this.numberOfArray[ level ]; i++){

        var geo = this.geoArray[ level  ];

        var mat = this.matArray[ level  ];
         
        var mesh = new THREE.Mesh( geo , mat );

        //console.log( mesh );
        var scale = this.startingSize * this.sizeArray[level];
        var radius = this.startingSize * this.radiusArray[level];


        //console.log( scale );
        mesh.scale.x = mesh.scale.y = mesh.scale.z =  scale;
  
        var rot = ( i / this.numberOfArray[ level ] ) * 2 * Math.PI;

        var pos = Math.toCart( radius, rot , 0 );

        //mesh.position = pos;
        mesh.position.x = pos.x;
        mesh.position.y = pos.z;
        mesh.position.z = scale;

        mesh.rotation.z = rot;
        subScene.add(mesh);
        //scene.add(mesh);
          
        this.createRings( subScene , mesh.position , level + 1 );

      }

    }

  }


}



    var objectsLoaded = 0;
    var objectsToLoad = 1;

    var modelGeometries = [];
    var modelData       = [];

    var objLoad = new THREE.OBJLoader();

    objLoad.load('/allSiteLib/models/tree2.obj' , function(object ){

       objectsLoaded += 1;
       console.log( object );

       for( var i = 0; i < object.children.length; i++ ){

         var child = object.children[i];
         if( child instanceof THREE.Mesh ){

          // 3 , 5 , 7 , 9 , 10, 11, 12, 13! , 15! , 16 , 17 
          if( 
            //i ==  3 ||
            //i ==  5 ||
            //i ==  7 ||
            i ==  9 ||
            i == 10 ||
            i == 11 ||
            i == 12 ||
            i == 13 ||
            i == 15 ||
            i == 16 ||
            i == 17 

          ){

            geometry = child.geometry;
            geometry = reduceGeometry( geometry, 3 );

            data = geometry.clone();
            modelGeometries.push( geometry );
            modelData.push( data );

          }
        }


      }

      if( objectsLoaded == objectsToLoad ){
        initMandala();

        console.log( 'allLoaded' );
      }

    });


    function reduceGeometry( geometry , reductionAmount ){

      for( var i = 0; i< geometry.vertices.length; i++ ){

        geometry.vertices[i].multiplyScalar( reductionAmount );

      }

      return geometry;
    }


    function initMandala(){

      app.mandalaScene = new THREE.Object3D();
      app.mandalaScene.rotation.x = Math.PI/2;
      app.mandalaScene.position.z = -1;
     // scene.add( app.mandalaScene );
      app.mandalas = [];

      console.log( particleMaterials );
      for( var i = 0; i< 20; i ++){
          var mandala = new MANDALA(
             1/50  ,
            [ 1 , 1, 1, 1 , 1,1 ,1 ],
            [ 1 , 1 , 1 , 1,1 ,1,1],

            // 3 , 5 , 7 , 9 , 10, 11, 12, 13! , 15! , 16 , 17 
            [ 
              modelGeometries[0], 
              modelGeometries[1], 
              modelGeometries[2], 
              modelGeometries[3],
              modelGeometries[4],
              modelGeometries[5],
              modelGeometries[6]
            ],
            [ 
              particleMaterials[0], 
              particleMaterials[1], 
              particleMaterials[2], 
              particleMaterials[3], 
              particleMaterials[2], 
              particleMaterials[1], 
              particleMaterials[3] 

            ],
            [ 1, 1, 1 , 1, 1 , 1, 1]


            );
            mandala.scene.rotation.y = i / 20 * Math.PI * 2;
            //mandala.scene.rotation.x = i / 5 * Math.PI * 2;

            console.log( mandala );
            app.mandalaScene.add( mandala.scene );
            app.mandalas.push( mandala );

      }

      app.updateMandalas = function(){

        for( var i = 0; i < app.mandalas[0].geoArray.length; i ++ ){

          var geo   = app.mandalas[0].geoArray[i];
          var data  = app.mandalas[0].dataArray[i];

          
          for( var j = 0; j < geo.vertices.length; j++ ){

            if( masterAudioArray[j] ){

              var g = geo.vertices[j];
              var d = data.vertices[j];
              
              g.x = d.x * ( 1 + masterAudioArray[j] / 100 );
              g.y = d.y * ( 1 + masterAudioArray[j] / 100 );
              g.z = d.z * ( 1 + masterAudioArray[j] / 100 );

            }

          }

          geo.verticesNeedUpdate = true;

        }


      }

    }



