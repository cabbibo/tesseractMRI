

function App(){

  this.init();
}

App.prototype = {

  init:function(){

    initMath();
    initScene();
    initAudio();
    initLeap();
    initEmitters();

    this.ui2d = new Controller2D();
    this.ui3d = new Controller3D();

    console.log( this.ui2d );

    /*this.emitters   = initEmitters();
    this.contoller  = initLeap();
    this.notes      = initAudio();*/

  },


}

function animate(){

    requestAnimationFrame( animate );

    updateAudio();

    if( app.update ){
      app.update();
    }

    app.ui2d.update();
    app.ui3d.update();

    controls.update();
    stats.update();
    renderer.render(scene, camera);

  }

