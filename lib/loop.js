var controller , frame;

var initLeap = function(){

  controller = new Leap.Controller();

  controller.on( 'frame' , function( data ){

    frame = data;

    if( frame.hands[0] ){

      var dir = frame.hands[0].palmNormal;

      var yPos = frame.hands[0].palmPosition[1];
      var xPos = frame.hands[0].palmPosition[2];
      var offsetY  = -( yPos - frame.interactionBox.center[1]) / 200;
      var offsetX =  ( xPos - frame.interactionBox.center[0]) / 200;

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

    }

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
