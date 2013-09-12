var controller , frame;

function initLeap(){

  controller = new Leap.Controller();

  controller.on( 'frame' , function( data ){

    frame = data;

    if( frame.hands[0] ){

      var dir = frame.hands[0].palmNormal;

      var yPos = frame.hands[0].palmPosition[1];
      var xPos = frame.hands[0].palmPosition[1];
      var offset  = -( yPos - frame.interactionBox.center[1]) / 200;
      var offsetX =  ( xPos - frame.interactionBox.center[0]) / 200;

      plane = [ dir[0] , dir[1] , dir[2] , offsetX , offset ]; //offsetX , offset ];
      rotationMatrix = rotationToW( plane );
      rotationMatrixT = [];
      mat4.invert( rotationMatrixT , rotationMatrix );

      drawIntersections();
      //drawPoints();

    }

  });

  controller.connect();

}

function checkData(){

  rotationMatrix = rotationToW( plane );
  rotationMatrixT = [];
  console.log( 'ROTATION MATRIX' );
  console.log( rotationMatrix );
  mat4.invert( rotationMatrixT , rotationMatrix );

  drawIntersections();


}
