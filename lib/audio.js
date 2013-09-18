

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


songsNeededToLoad = notesSRC.length ;//+ loopSRC.length;

function initAudio(){

  for( var i = 0; i < notesSRC.length; i ++){
    
    new NOTE( notesSRC[i] );

  }

}


var BEGIN = function(){

  notes.gain.gain.value = .6;
  animate();

}
