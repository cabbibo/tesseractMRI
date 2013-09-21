

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

    controls.update();
    stats.update();
    renderer.render(scene, camera);

  }

