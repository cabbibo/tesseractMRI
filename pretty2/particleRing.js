

function ParticleRing( params ){

  this.params = _.defaults( params || {}, {

    color:0xff0000,
    numOfParticles: 200,
    numOfRings:     80,
    size:           2,

  });


  this.numOfParticles = this.params.numOfParticles
  this.size           = this.params.size;
  this.numOfRings     = this.params.numOfRings;


  this.scene = new THREE.Object3D();

  this.geometry = new THREE.Geometry();


  for( var i = 0; i < this.numOfParticles; i++ ){

    var angle = 2 * Math.PI * ( i / this.numOfParticles )
    var vert  = Math.toCart( this.size , angle , 0 );

    var tempZ = vert.z;

    vert.z = vert.y;
    vert.y = tempZ;

    this.geometry.vertices.push( vert );

  }

  // Now that We've made the geometry, clone it
  this.data = this.geometry.clone();

  this.rings = [];



  for( var i = 0; i < this.numOfRings; i++ ){

    var c = new THREE.Color();
    c.r = ( i / this.numOfRings );
    c.b = .5;
    c.g = .7;
    
    var material = new THREE.ParticleBasicMaterial({
      color: c,
      //map: this.image,
      size: .04,
      blending: THREE.AdditiveBlending,
      opacity: .9,
      transparent: true//color
    });

    // TODO: Make rings
    var ring = new THREE.ParticleSystem( this.geometry, material );

    ring.position.z = ( -i/20);
    //ring.scale.multiplyScalar( 1 + (i / this.numOfRings ));

    this.rings.push( ring );
    this.scene.add( ring );
    

  }


  //scene.add( this.scene );

}


ParticleRing.prototype.update = function(){

  for( var i = 0; i < this.geometry.vertices.length; i ++ ){

    //console.log( masterAud
    if( masterAudioArray[i] ){
    

      var a = masterAudioArray[i];
      var vert = this.geometry.vertices[i];
      var data = this.data.vertices[i];

      vert.x = data.x  * ( 1 +( a / 200 ));
      vert.y = data.y  * ( 1 +( a / 200 ));
      vert.z = data.z  * ( 1 +( a / 200 ));

      //console.log( vert );


    }
    
    this.geometry.verticesNeedUpdate = true;

  }



}
