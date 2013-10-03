
var particleEmitters = [];

var cornerEmitter;
var particleScene;

var emitterClock = 0;



var particleMaterials = [

  new THREE.MeshPhongMaterial({

   
    color:        0x3F6D82,
    emissive:     0x994A89,
    specular:     0xffffff,
    diffuse:      0xffffff,
    shinines:     100000,
    ambient:      0xE870D0,
    shading:      THREE.FlatShading,
    opacity:      1,
    transparent:  true
        
  }),

   new THREE.MeshPhongMaterial({

   
    color:        0x66aaaa,
    emissive:     0x66aaaa,
    specular:     0xffffff,
    diffuse:      0xffffff,
    shinines:     100000,
    ambient:      0x44cc44,
    shading:      THREE.SmoothShading,
    //wireframe:    true,
    opacity:      .3,
    transparent:  true
        
  }),

    new THREE.MeshPhongMaterial({

   
    color:        0xcc4444,
    emissive:     0xcc4444,
    specular:     0xffffff,
    diffuse:      0xffffff,
    shinines:     100000,
    ambient:      0xcc4444,
    shading:      THREE.SmoothShading,
    //wireframe:    true,
    opacity:      .3,
    transparent:  true
        
  }),

  new THREE.MeshPhongMaterial({

   
    color:        0x4444cc,
    emissive:     0x4444cc,
    specular:     0xffffff,
    diffuse:      0xffffff,
    shinines:     100000,
    ambient:       0x4444aa,
    shading:      THREE.SmoothShading,
    //wireframe:    true,
    opacity:      .3,
    transparent:  true
        
  }),
  //new THREE.MeshLambertMaterial({ color:0xaaffaa }),  //Life
  //new THREE.MeshLambertMaterial({ color:0xffaaaa }),  //Death
  //new THREE.MeshLambertMaterial({ color:0xaaaaff }),  //Sleep


]

ParticleEmitter.prototype = {


  update:function(){

    if( tesseractGeometry.vertices.length >=4 )
      this.geometry = tesseractGeometry;

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

      var audio = masterAudioArray[i] + .1;
      //console.log( audio );
      this.particles[i].update( audio );

    }


  },

  emitParticles:function( numOf ){

    for( var i = 0 ; i < numOf; i++ ){

      var particles = new Particle( this );  

    }

  },


  explodeParticles:function( numOf ){

    for( var i = 0 ; i < numOf; i++ ){

      var particles = new Particle( this );  

    }

  },


  birth:function(){

    for( var i = 0 ; i < 10; i++ ){
      
      var particles = new Particle( this ,  particleMaterials[1] );  

    }

  },

  death:function(){

    for( var i = 0 ; i < 10; i++ ){

      var particles = new Particle( this , particleMaterials[2] );  

    }

  },

  sleep:function(){

    for( var i = 0 ; i < 10; i++ ){

      var particles = new Particle( this , particleMaterials[3] );  

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

    geometry:       new THREE.IcosahedronGeometry( .06 , 1 ),
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


  update:function( audio ){

    //console.log( audio );
    this.mesh.rotation.x += audio / 2000;
    this.mesh.rotation.y += audio / 3000;
    this.mesh.rotation.z += audio / 4000;

    //debugger
    this.velocity.multiplyScalar( (1 + audio/100000 ));
    this.velocity.z = - Math.abs( this.velocity.z )
    this.position.add( this.velocity );
    
    this.mesh.position = this.position;

    //this.mesh.rotation.x += 

    // Scales the meshes so that they
    // shrink as they get closer to death
    var r  = 2 - this.mesh.geometry.boundingSphere.radius;

    var r =this.mesh.geometry.boundingSphere.radius - 2
    this.r = 1/ ( 1 / (r*r));

    this.r = 1;
    this.mesh.scale.x = this.age * this.r// * (1 + audio/256 );
    this.mesh.scale.y = this.age * this.r// * (1 + audio/256 );
    this.mesh.scale.z = this.age * this.r// * (1 + audio/256 );

 
  },

  suicide:function(){
    particleScene.remove( this.mesh );
  }



}

function Particle( e , mat  ){

  // using e for emitter, just for shorter code
  // I know its non descriptive, but pretty is 
  // more important than useful
  this.emitter  = e;

  this.position = e.position.clone();

  this.velocity = new THREE.Vector3();
  this.velocity.x += M.randomRange( .05 );
  this.velocity.y += M.randomRange( .05 );
  this.velocity.z -= M.random( .0001 );

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

}


function initEmitters(){


  particleScene = new THREE.Object3D();

  particleScene.position.x = -.5;
  particleScene.position.y = -.5;
  particleScene.position.z = -.5;


  cornerEmitter = new ParticleEmitter();

  for( var i = 0; i < 12; i ++ ){

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

      emitter.position.x = 10000;
      emitter.scene.position = emitter.position;

    
    }


  }

}
