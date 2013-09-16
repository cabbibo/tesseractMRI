
var particleEmitters = [];
var particleScene;

var emitterClock = 0;

var particleMaterials = [

  new THREE.MeshLambertMaterial({ color:0xFF6C00 }),
  new THREE.MeshLambertMaterial({ color:0xFFAB00 }),
  new THREE.MeshLambertMaterial({ color:0xF10026 }),

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

      var particles = new Particle( this , true , true );  

    }

  },

  death:function(){

    for( var i = 0 ; i < 20; i++ ){

      var particles = new Particle( this , true , false );  

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

  if( !params )
    var params = {};

  // The lifetime of the partilces
  if( params.geometry ){
    this.geometry = params.geometry;
  }else{
    this.geometry = new THREE.CubeGeometry( .1 , .1 , .1 );
  }

  if( params.material ){
    this.material = params.material;
  }else{
    this.material       = particleMaterials[0];
    this.lifeMaterial   = particleMaterials[1];
    this.deathMaterial  = particleMaterials[2];
  
  }

  // Uncertainty of velocity
  if( params.velocityU ){
    this.velocityU = params.velocityU;
  }else{
    this.velocityU = .1;
  }
  
  // The lifetime of the partilces
  if( params.age ){
    this.age = params.age;
  }else{
    this.age = 1;
  }

  // Uncertainty of the lifetime
  if( params.ageU ){
    this.ageU = params.ageU;
  }else{
    this.ageU = .1;
  }

  // The decay Rate of the particles
  if( params.decayRate ){
    this.decayRate = params.decayRate;
  }else{
    this.decayRate = .01;
  }

  // Uncertainty of the decayRate
  if( params.decayU ){
    this.decayU = params.decayU;
  }else{
    this.decayU = .1;
  }

  // How much the particles will slow down
  if( params.viscosity ){
    this.viscosity = params.viscosity;
  }else{
    this.viscosity = .99;
  }

  // How much the particles will slow down
  if( params.viscosityU ){
    this.viscosityU = params.viscosityU;
  }else{
    this.viscosityU = .01;
  }



  this.particles    = [];

  this.velocity     = new THREE.Vector3();

  this.position     = new THREE.Vector3();
  this.oPosition    = new THREE.Vector3();

  this.scene        = new THREE.Object3D();
  
  this.mesh         = new THREE.Mesh( this.geometry , this.material );
 
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

function Particle( e , explode , life ){

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

  if( explode && life ){
    material = e.lifeMaterial;
  }else if( explode && !life ){
    material = e.deathMaterial;

  }

  this.mesh = new THREE.Mesh( e.geometry , material );

  this.age        = (1 + M.randomRange( e.ageU ) ) * e.age;
  this.decayRate  = (1 + M.randomRange( e.decayU )) * e.decayRate;
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

      if( emitterClock % 20 == 0 )
        emitter.emitParticles( 1 );
      
    // Juste gained this particleEmitter
    }else if( intersections[i] ){

      emitter.birth();

    // Just lost this particleEmitter
    }else if( oIntersections[i] ){

      emitter.death();
      emitter.position.x = 10000;

    }else{


    }


  }

}
