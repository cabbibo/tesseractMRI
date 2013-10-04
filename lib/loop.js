var controller , frame , oFrame;

var timer = 0;

var initLeap = function(){

  controller = new Leap.Controller({enableGestures:true});

  controller.on( 'frame' , function( data ){

    frame = data;
    if( !oFrame )
      oFrame = frame;

    if( tweening == false ){
      
      if( frame.fingers.length == oFrame.fingers.length ){

      for( var i = 0; i < slider.chooseBar.selections.length; i++ ){

        if( frame.fingers.length - 1 == i && Math.abs(frame.hands[0].palmNormal[1]) >= .5 ){

          slider.chooseBar.timers[i] ++;
          
        }else{
          
          slider.chooseBar.timers[i] --;

          if( slider.chooseBar.timers[i] < 0 ) slider.chooseBar.timers[i] = 0;

        }

      }
    
      }


    }

    if( frame.hands[0] ){


      /* Sets up the plane for slice */
      var dir = frame.hands[0].palmNormal;

      var yPos = frame.hands[0].palmPosition[1];
      var xPos = frame.hands[0].palmPosition[2];
      var offsetY  = -( yPos - frame.interactionBox.center[1]) / (frame.interactionBox.size[1]/2);
      var offsetX =  ( xPos - frame.interactionBox.center[0]) / (frame.interactionBox.size[0]/2);

      plane = [ 
        dir[0]  , 
        dir[1]  , 
        dir[2]  , 
        offsetX ,
        offsetY 
      ]; //offsetX , offset ];
      
      setRotationMatrices( plane );

      //drawIntersections();
      //drawPoints();


      /*if( Math.abs(dir[0]) >= .95 ){

        if( !tweening ){
         if(frame.hands[0].palmVelocity[0]>= 500 ){
            slideRight(); 
          }else if(frame.hands[0].palmVelocity[0] <= -500 ){
            slideLeft();
          }
        }

      }*/



    }

    if( frame.gestures[0] ){

      if( frame.gestures[0].type == 'circle' ){
  
        if( frame.gestures[0].progress > 4 && oFrame.gestures[0].progress < 4 ){

          if( frame.gestures[0].normal[2] < 0 )
            triggerAwesome();
          else
            triggerNormal();

        }

      }

    }

    oFrame = frame 
  });

  controller.connect();

}


function setRotationMatrices( plane ){
  
  rotationMatrix  = rotationToW( plane );
  rotationMatrixT = getMatrix4Transpose( rotationMatrix );

}


function getRotationMatrixT( plane ){
  rotationMatrix = rotationToW( plane );
  rotationMatrixT = [];
  console.log( 'ROTATION MATRIX' );
  console.log( rotationMatrix );
  mat4.invert( rotationMatrixT , rotationMatrix );
  return rotationMatrixT


}


function getMatrix4Transpose( matrix ){

  matrixT = [];
  mat4.invert( matrixT , matrix );
  return matrixT;

}

function checkData(){

  rotationMatrix = rotationToW( plane );
  rotationMatrixT = [];
  console.log( 'ROTATION MATRIX' );
  console.log( rotationMatrix );
  mat4.invert( rotationMatrixT , rotationMatrix );

  drawIntersections();


}
