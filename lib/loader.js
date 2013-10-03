
function LOADER( numberToLoad , loadGif ){

  this.numberToLoad = numberToLoad;
  this.numberLoaded = 0;

  this.curtain = document.createElement('div');

  this.curtain.style.position     = 'absolute';
  this.curtain.style.top          = '0px';
  this.curtain.style.left         = '0px';
  this.curtain.style.width        = '100%';
  this.curtain.style.height       = '100%';
  this.curtain.style.background   = '#000';
  
  document.body.appendChild( this.curtain );


  this.loadBar = document.createElement('div');
  
  this.loadBar.style.position     = 'absolute';
  this.loadBar.style.top          = '50%';
  this.loadBar.style.height       = '1px';
  this.loadBar.style.width        = '0px';
  this.loadBar.style.background   = '#fff';

  this.loadBarAddAmount = window.innerWidth / this.numberToLoad;

  this.curtain.appendChild( this.loadBar );

  this.loadingGif = document.createElement( 'img' );

  this.loadingGif.src = loadGif;
  


  var curtainTemp = this.curtain;

  this.loadingGif.onload = function(){
 
    var margin = this.height + 10
    this.style.marginLeft  = "-" + this.width  / 2 + "px";
    this.style.marginTop   = "-" + margin + "px";
    this.style.position    = 'absolute';
    this.style.top         = '50%';
    this.style.left        = '50%';

    curtainTemp.appendChild( this );


  }


}


LOADER.prototype = {

  loadBarAdd: function(){

    var oldWidth = parseInt( this.loadBar.style.width );
    var newWidth = oldWidth + this.loadBarAddAmount

    this.loadBar.style.width = newWidth + "px";

    this.numberLoaded ++;

    if( this.numberLoaded == this.numberToLoad ){
      this.onFinishedLoading();
    }



  },

  onFinishedLoading: function(){
 
    var self = this;
    
    $(this.curtain).fadeOut('slow',function(){
      self.onStart();
    });

  },

  onStart: function(){


    initUI();
    notes.gain.gain.value = .9;
    loops.gain.gain.value = .4;
    playAllLoops();
    animate();

  }



}
