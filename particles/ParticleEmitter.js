
var particleEmitters = [];

var cornerEmitter;
var particleScene;

var emitterClock = 0;



var particleMaterials = [

  new THREE.MeshLambertMaterial({ color:0xaaaaaa }),
  new THREE.MeshLambertMaterial({ color:0x6633aa }),  //Life
  new THREE.MeshLambertMaterial({ color:0xaa3344 }),  //Death
  new THREE.MeshLambertMaterial({ color:0x009E8E }),  //Sleep


]

ParticleEmitter.prototype = {


  update:function(){
    
    // Takes care of dealing with the lifetimes of the particles
    for( var i = 0; i < this.particles.length; i++ ){

      this.particles[i].age -= this.particles[i].decayRate;
      
      if( this.particles[i].age < 0 ){

        this.particles[i].suicide();
        this.particles.splice( i , 1 );

      }

    }


    // After we are done seeing which particels live and die
    // update them all
    for( var i = 0; i < this.particles.length; i++ ){

      this.particles[i].mesh.rotation.x += masterAudioArray[i] / 2000; 
      this.particles[i].mesh.rotation.y += masterAudioArray[i] / 2500; 
      this.particles[i].mesh.rotation.z += masterAudioArray[i] / 3000;

      this.particles[i].update();

    }


  },

  emitParticles:function( numOf ){

    for( var i = 0 ; i < numOf; i++ ){

      var particles = new Particle( this );  

    }

  },


  explodeParticles:function( numOf ){

    for( var i = 0 ; i < numOf; i++ ){

      var particles = new Particle( this , true );  

    }

  },


  birth:function(){

    for( var i = 0 ; i < 20; i++ ){

      var particles = new Particle( this ,  true , particleMaterials[1] );  

    }

  },

  death:function(){

    for( var i = 0 ; i < 20; i++ ){

      var particles = new Particle( this , true , particleMaterials[2] );  

    }

  },

  sleep:function(){

    for( var i = 0 ; i < 20; i++ ){

      var particles = new Particle( this , true , particleMaterials[3] );  

    }

  }



}

/*
 *
 *  Particle Emitter:
 *  A particle emitter is used to define all of its sub particles
 *  It will handle the update loop for the particles as well, and 
 *  has its own geometry
 *
 */
function ParticleEmitter( params ){

  this.params = _.defaults( params || {}, {

    geometry:       new THREE.CubeGeometry( .1 , .1 , .1 ),
    material:       particleMaterials[0],
    lifeMaterial:   particleMaterials[1],
    deathMaterial:  particleMaterials[2],
    velocityU:      .1,
    age:            1,
    ageU:           .1,
    decayRate:      .01,
    decayRateU:     .1,
    viscosity:      .99,
    viscosityU:     .01

  });
  
  this.geometry       = this.params.geometry;
  this.material       = this.params.material;
  this.lifeMaterial   = this.params.lifeMaterial;
  this.deathMaterial  = this.params.deathMaterial;
  this.velocityU      = this.params.velocityU;
  this.age            = this.params.age;
  this.ageU           = this.params.ageU;
  this.decayRate      = this.params.decayRate;
  this.decayRateU     = this.params.decayRateU;
  this.viscosity      = this.params.viscosity;
  this.viscosityU     = this.params.viscosityU;
  
  
  this.particles      = [];

  this.velocity       = new THREE.Vector3();

  this.position       = new THREE.Vector3();
  this.oPosition      = new THREE.Vector3();

  this.scene          = new THREE.Object3D();
  
  this.mesh           = new THREE.Mesh( this.geometry , this.material );
 
  this.scene.add( this.mesh );

  this.scene.postion = this.position;

  particleScene.add( this.scene );
  
  particleEmitters.push( this );

}


Particle.prototype = {


  update:function(){

    this.position.add( this.velocity );
    //this.velocity.multiplyScalar( this.viscosity );
    this.mesh.position = this.position;

    // Scales the meshes so that they
    // shrink as they get closer to death
    this.mesh.scale.x = this.age / 2;
    this.mesh.scale.y = this.age / 2;
    this.mesh.scale.z = this.age / 2;

 
  },

  suicide:function(){
    particleScene.remove( this.mesh );
  }



}

function Particle( e , explode , mat  ){

  // using e for emitter, just for shorter code
  // I know its non descriptive, but pretty is 
  // more important than useful
  this.emitter  = e;

  this.position = e.position.clone();

  if( !explode ){

    this.velocity = e.velocity.clone();

    this.velocity.x += M.randomRange( .01 );
    this.velocity.y += M.randomRange( .01 );
    this.velocity.z += M.randomRange( .01 );


    this.velocity.x *= 1 + M.randomRange( e.velocityU );
    this.velocity.y *= 1 + M.randomRange( e.velocityU );
    this.velocity.z *= 1 + M.randomRange( e.velocityU );

  }else{

    this.velocity = new THREE.Vector3();
    this.velocity.x += M.randomRange( .03 );
    this.velocity.y += M.randomRange( .03 );
    this.velocity.z += M.randomRange( .03 );

  }

  var material = e.material;

  if( mat ){
    material = mat;
  }

  this.mesh = new THREE.Mesh( e.geometry , material );

  this.age        = (1 + M.randomRange( e.ageU ) ) * e.age;
  this.decayRate  = (1 + M.randomRange( e.decayRateU )) * e.decayRate;
  this.viscosity  = (1 + M.randomRange( e.viscosityU )) * e.viscosity;

  e.particles.push( this );

  particleScene.add( this.mesh );

  this.update();

}


function initEmitters(){


  particleScene = new THREE.Object3D();

  particleScene.position.x = -.5;
  particleScene.position.y = -.5;
  particleScene.position.z = -.5;

  scene.add( particleScene );

  for( var i = 0 ; i < 12; i++ ){

    var emitter = new ParticleEmitter();

  }

  cornerEmitter = new ParticleEmitter();

}


function updateEmitters(){

  emitterClock += 1;

  for( var i = 0;  i < particleEmitters.length; i++ ){

    var emitter = particleEmitters[i];

    emitter.update();

    if( intersections[i] && oIntersections[i] ){

      emitter.oPosition = emitter.position.clone();

      emitter.position.x = intersections[i][0][0]; 
      emitter.position.y = intersections[i][0][1]; 
      emitter.position.z = intersections[i][0][2];

      emitter.scene.position = emitter.position;

      emitter.velocity.subVectors( emitter.position , emitter.oPosition );

      if( emitterClock % 800000 == 0 )
        emitter.emitParticles( 1 );
      
    // Juste gained this particleEmitter
    }else if( intersections[i] ){

      //emitter.birth();

    // Just lost this particleEmitter
    }else if( oIntersections[i] ){

      //emitter.death();
      emitter.position.x = 10000;

    }else{


    }


  }

}
