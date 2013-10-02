

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


function BEGIN(){

  notes.gain.gain.value = .9;
  loops.gain.gain.value = .4;
  playAllLoops();
  animate();

}
