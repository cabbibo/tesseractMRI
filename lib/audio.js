
var musicContext = new webkitAudioContext();	
 
var masterGain = musicContext.createGain();

var masterAudioArray;


var masterAnalyser = musicContext.createAnalyser();
masterAnalyser.frequencyBinCount = 1024;


// Make sure that it never loads
// unless we define a songs needed to load
var songsLoaded = 0;
var songsNeededToLoad = 200000;

masterGain.gain.value =.8;

masterGain.connect(masterAnalyser);
masterAnalyser.connect(musicContext.destination);

loops = {
  array:[],
  analyser:musicContext.createAnalyser(),
  gain:musicContext.createGain()
}

loops.gain.connect(loops.analyser);
loops.analyser.connect(masterGain);

notes = {
  array:[],
  analyser:musicContext.createAnalyser(),
  gain:musicContext.createGain()
}

notes.gain.connect(notes.analyser);
notes.analyser.connect(masterGain);


function LOOP( file , startingScore, fadeInEnd, fadeOutStart , endingScore  ){

  this.file = file;
  this.loop = true;

  this.startingScore = startingScore;
  this.fadeInEnd = fadeInEnd;
  this.fadeOutStart = fadeOutStart;
  this.endingScore = endingScore;

  this.loadFile();


}

LOOP.prototype = {
	playing:false,
	stop:function(){
		this.playing = false
		this.source.noteOff(0);
        //this.destroySource();
	},
		
	play:function(){
		
      this.playing = true
      this.source.noteOn(0);
      //var self = this

     
      console.log('ss');
      if(this.source.loop == false){
        this.createSource();	
      }

	},
    
    createSource:function(looped) {
      this.source = musicContext.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = this.loop;
                  
      this.analyser = musicContext.createAnalyser();
      this.gain = musicContext.createGain();

      if( this.loop == true ){
        this.gain.gain.value = 1;
      }
      
      this.source.connect(this.gain);
      this.gain.connect( this.analyser);
      this.analyser.connect(loops.gain);

    
    },	
	
		
	/*destroySource:function(){
        this.source.disconnect(masterGain)
		this.analyser.disconnect(this.gainNode)
		this.source = undefined
		this.analyser = undefined
	},*/
	
    onDecode:function(){
      //gets just the track name, removing the mp3
      this.trackID= this.file.split('.')[this.file.split('.').length-2];
      this.playing = false;
      this.createSource();
      this.loadBarAdd();
    },


    loadFile:function(){ 
      var request=new XMLHttpRequest();
	  request.open("GET",this.file,true);
	  request.responseType="arraybuffer";


      var self = this
      request.onload = function(){

        musicContext.decodeAudioData(request.response,function(buffer){

          if(!buffer){
            alert('error decoding file data: '+url);
            return;
          }

          self.buffer = buffer;
          self.onDecode();

        })
      },

      request.send();
    },

    loadBarAdd: function(){

      songsLoaded += 1;
      console.log(songsLoaded);
      loops.array.push( this );  

      if(songsLoaded == songsNeededToLoad){
        BEGIN();
      }


    },

    checkGain: function(){

      if( score >= this.startingScore && score <= this.fadeInEnd ){

        var dif = this.fadeInEnd - this.startingScore;
        this.gainNode.gain.value = (score - this.startingScore) / dif;

      }else if( score >= this.fadeOutStart && score <= this.endingScore){

        var dif = this.endingScore - this.fadeOutStart;
        this.gainNode.gain.value = (this.endingScore - score )/ dif;

      }else if( score <= this.startingScore || score >= this.endingScore ){
        this.gainNode.gain.value = 0;
      }

    }
    
}

function NOTE( file ){

  this.file = file;
  this.loop = false;
  this.loadFile();

}


NOTE.prototype = {


  	playing:false,
	stop:function(){
		this.playing = false
		this.source.noteOff(0);
        //this.destroySource();
	},
	
    play:function(){
	
       this.playing = true;
      this.source.noteOn(0);
      
      if(this.source.loop == false){
        this.createSource();	
      }

	},

    createSource:function(){
      this.source = musicContext.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = false;

      this.analyser = musicContext.createAnalyser();
      this.gain = musicContext.createGain();

     // this.source.connect( masterGain );
      this.source.connect( this.gain );
      this.gain.connect( this.analyser);
      this.analyser.connect( notes.gain );

    },

    /*destroySource:function(){
        this.source.disconnect(this.gain)
		this.analyser.disconnect(this.gain)
		this.source = undefined
		this.analyser = undefined
	},*/
	
    onDecode:function(){
      //gets just the track name, removing the mp3
      this.trackID= this.file.split('.')[this.file.split('.').length-2];
      this.playing = false;
      this.createSource();
      this.loadBarAdd();
    },


    loadFile:function(){
	  
      var request = new XMLHttpRequest();
	  request.open( "GET" , this.file , true );
	  request.responseType="arraybuffer";


      var self = this;
      request.onload = function(){

        musicContext.decodeAudioData( request.response , function(buffer){

          if(!buffer){
            alert('error decoding file data: '+url);
            return;
          }

          self.buffer = buffer;
          self.onDecode();

        });
      },

      request.send();
    },

    loadBarAdd: function(){

      loader.loadBarAdd();
      notes.array.push( this );  
    
    }


}


function updateAudio(){

  //Gets the frequency Data for all frequencies in the
  //analyser bin count
  masterAudioArray = new Uint8Array( masterAnalyser.frequencyBinCount );
  masterAnalyser.getByteFrequencyData( masterAudioArray );



}


function playAllLoops(){

  for( var i = 0; i< loops.array.length; i++ ){

    console.log('ss');
    loops.array[i].play();

  }

}
// One note for every corner of the tesseract

notesSRC = [

  "/allSiteLib/audio/temptations/notes/halleNote1.mp3",
  "/allSiteLib/audio/temptations/notes/halleNote2.mp3",
  "/allSiteLib/audio/temptations/notes/halleNote3.mp3",
  "/allSiteLib/audio/temptations/notes/halleNote4.mp3",
  "/allSiteLib/audio/temptations/notes/halleNote5.mp3",
  "/allSiteLib/audio/temptations/notes/halleNote6.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note1.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note2.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note3.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note4.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note5.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note6.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note7.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note8.mp3",
  "/allSiteLib/audio/temptations/notes/halle2Note9.mp3",
  
  "/allSiteLib/audio/temptations/notes/numbNote1.mp3",

]

loopsSRC = [

  //"/allSiteLib/audio/temptations/loops/colomb.mp3",
  //"/allSiteLib/audio/temptations/loops/dustySwells.mp3",
  //"/allSiteLib/audio/temptations/loops/geetLoop.mp3",
  //"/allSiteLib/audio/temptations/loops/getreidePhunk.mp3",
  //"/allSiteLib/audio/temptations/loops/highStrings.mp3",
  //"/allSiteLib/audio/temptations/loops/kick.mp3",
  //"/allSiteLib/audio/temptations/loops/kick2.mp3",
  //"/allSiteLib/audio/temptations/loops/leaving.mp3",
  //"/allSiteLib/audio/temptations/loops/nicBBC.mp3",
  //"/allSiteLib/audio/temptations/loops/seashore.mp3",
  //"/allSiteLib/audio/temptations/loops/sprinkleLoop.mp3",
  //:"/allSiteLib/audio/temptations/loops/stottLoop.mp3",

]




songsNeededToLoad = notesSRC.length + loopsSRC.length;

function initAudio(){

  for( var i = 0; i < notesSRC.length; i ++){
    
    new NOTE( notesSRC[i] );

  }

  for( var i = 0; i < loopsSRC.length; i ++){
    
    new LOOP( loopsSRC[i] );

  }


}



