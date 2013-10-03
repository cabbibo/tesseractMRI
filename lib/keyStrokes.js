

$(document).keypress(function(event){
		var whichKey=String.fromCharCode(event.which)
	
		if(whichKey=='1'){
          camera.position.x           = -10;
          app.uiScene.active          = true;
          app.projectionScene.active  = false;
          app.sliceScene.active       = false;
        }

        if(whichKey=='2'){
          camera.position.x           = 0;
          app.uiScene.active          = false;
          app.projectionScene.active  = true;
          app.sliceScene.active       = false;
        }


        if(whichKey=='3'){
          camera.position.x           = 10;
          app.uiScene.active          = false;
          app.projectionScene.active  = false;
          app.sliceScene.active       = true;
        }


        if( whichKey == 'x' ){
          toggleInterface();
        }
  
 })



function toggleInterface(){

  if( "stats" in window )
    $(stats.domElement).toggle();
  
  if( "gui" in window )
    $(gui.domElement).toggle();
  
  $("#info").toggle();
  $("#textureData").toggle();


  var cursorStyle = $('html').css("cursor");

  if( cursorStyle == 'auto' ){
    $('html').css("cursor", "none");      
  }else if( cursorStyle == 'none' ){
    $('html').css("cursor", "auto");
  }

}


