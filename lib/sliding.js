
var currentSlide = 1;
var tweening = false;
function slideRight(){

  console.log( currentSlide );
  
  if(currentSlide > 0 ){

      currentSlide -= 1;
      tweening = true; 
      console.log('slideRight')
    
    var start = {
      x:camera.position.x,      
    }
    var target =  {
      x:slides[currentSlide].position.x
    }

    var tween = new TWEEN.Tween(start).to(target, 1000);
    tween.easing(TWEEN.Easing.Exponential.InOut)

     //Set the tweening equal to true, so that we dont do multiple
    //things at the same time
    //var tweening  = true
    
    tween.onUpdate(function(){

     
      camera.position.x = start.x;

      if(start.x == target.x){
        tweening = false;
        slides[currentSlide].active = true;
      }

    });
    
    tween.start();

  }else{
    
  
  }

  
}


/*function slideLeft(){

  if(currentSlide < appContainer.slides.length-1 ){

    tweening  = true
   
    var curPos = appContainer.scene.position.x 
    var start = {
      x:curPos,
      curZ:appContainer.slides[currentSlide].position.z,
      moreZ:appContainer.slides[currentSlide+1].position.z,
      rotation:bgObject.rotation.y
    }
    var target =  {
      x:curPos - spacePerSlide,
      curZ:appContainer.slides[currentSlide].position.z-selectedZ,
      moreZ:appContainer.slides[currentSlide+1].position.z+selectedZ,
      rotation:bgObject.rotation.y - 2*Math.PI/(appContainer.slides.length)



    }

    //Set the tweening equal to true, so that we dont do multiple
    //things at the same time
    //var tweening  = true

    var tween = new TWEEN.Tween(start).to(target, 1000);
    tween.easing(TWEEN.Easing.Exponential.InOut);
    
    tween.onUpdate(function(){
      appContainer.scene.position.x  = start.x;
      appContainer.slides[currentSlide].position.z = start.moreZ;
      appContainer.slides[currentSlide-1].position.z = start.curZ;
      
      bgObject.rotation.y = start.rotation;

      if(start.x == target.x){
        tweening = false
      }

    });


    tween.start()

    currentSlide += 1

    for(var i = 0; i < slideMarkers.children.length; i++){

      var elem = $(slideMarkers.children[i].element)

      if(i == currentSlide){
        elem.css('background','#555')
      }else{
        elem.css('background','#333')
      }

    }


  }else{

  }

}*/


/*function slideUp(){

  if(currentWorld > 0){
    var curPos = camera.position.y
    var start = {
      y:curPos
    }
    var target =  {
      y:curPos - spacePerWorld
    }

    //Set the tweening equal to true, so that we dont do multiple
    //things at the same time
    tweening  = true

    var tween = new TWEEN.Tween(start).to(target, 1000);
    tween.easing(TWEEN.Easing.Exponential.InOut);
    
    tween.onUpdate(function(){
      camera.position.y  = start.y;

      if(start.y == target.y){
        tweening = false
        appContainer = yggdrasil[currentWorld];
      }

    });

    tween.start();
    currentWorld -= 1;

  }else{

    console.log('deen')
  }


}

function slideDown(){

  if(currentWorld < yggdrasil.length-1){
    var curPos = camera.position.y
    var start = {
      y:curPos
    }
    var target =  {
      y:curPos + spacePerWorld
    }

    //Set the tweening equal to true, so that we dont do multiple
    //things at the same time
    tweening  = true

    var tween = new TWEEN.Tween(start).to(target, 1000);
    tween.easing(TWEEN.Easing.Exponential.InOut);
    
    tween.onUpdate(function(){
      camera.position.y  = start.y;

      if(start.y == target.y){
        tweening = false;
        appContainer = yggdrasil[currentWorld];
      }

    });

    tween.start();
    currentWorld += 1;
    console.log('ss');


  }else{

    console.log('need');

  }


}*/

