function Controller( params ){

  this.params = _.defaults( params || {}, {
   
    dimension:    2,

    size:         1,
    color:        0xaaaaaa,
    color1:       0x773333,
    color2:       0x333377,
    linewidth:    5,

  });

  this.dimensions         = this.params.dimensions;

  this.equations          = [
    
    
    
    
  ];

  this.corners            = [];

  // All of these should be three.js vectors
  // and should be made 
  this.intersections      = [];
  this.oIntersections     = [];
  this.flatIntersections  = [];



}


Controller.prototype = {




}


function createEquations( dimensions ){

  var 

}

function createCorners( equations ){


  var corner array

  for( var  i = 0; i < dimensions; i ++ ){



  }



}
