

function ParticleRing( params ){

  this.params = _.defaults( params || {}, {

    color:0xff0000,
    numOfParticles: 200,
    numOfRings:     80,
    size:           .5,

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
    c.r = .3//( i / this.numOfRings );
    c.b = .3;
    c.g = .3;
    
    var material = new THREE.ParticleBasicMaterial({
      color: c,
      //map: this.image,
      size: .02,
      blending: THREE.AdditiveBlending,
      opacity: .99,
      transparent: true//color
    });

    // TODO: Make rings
    var ring = new THREE.ParticleSystem( this.geometry, material );

    
    ring.position.z = 0//( -i/20);
    ring.scale.multiplyScalar( 1 + (i / this.numOfRings ));

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
