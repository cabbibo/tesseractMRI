  
  /*
   *  INTERSECTION FUNCTIONS
   *  for 2D , 3D , 4D
   */


  Math.intersect2d = function( line , edge ){
      
    var matrix        = [
                          line[0] , line[1] ,
                          edge[0] , edge[1]
                        ]

    var rightHandSide = [ line[2] , edge[2] ];
    var transpose     = [];
    var inverse       = []; 
    var solution      = [];

    mat2.transpose( transpose , matrix );
    mat2.invert( inverse , transpose ); 

    vec2.transformMat2( solution, rightHandSide, inverse );

    return solution;

  };

  Math.intersect3d = function( plane , face1 , face2 ){

    var matrix = [
      plane[0] , plane[1] , plane[2],
      face1[0] , face1[1] , face1[2],
      face2[0] , face2[1] , face2[2]
    ]

    var transpose  = [];

    mat3.transpose( transpose , matrix );

    var inverse = [];

    mat3.invert( inverse , transpose );

    // Our plane has 4 
    var rightHandSide = [ plane[3], face1[3] , face2[3] ];

    var solution = [];

    vec3.transformMat3( solution , rightHandSide , inverse );

    return solution;
    
  };


  // Intersects a plane with 3 4D faces, returning a point
  Math.intersect4d = function( plane , face1 , face2 , face3 ){

  var matrix = [
    plane[0] , plane[1] , plane[2] , plane[3] ,
    face1[0] , face1[1] , face1[2] , face1[3] ,
    face2[0] , face2[1] , face2[2] , face2[3] ,
    face3[0] , face3[1] , face3[2] , face3[3] ,
  ]

  var transpose  = [];

  mat4.transpose( transpose , matrix );

  var inverse = [];

  mat4.invert( inverse , transpose );

  var rightHandSide = [ plane[4], face1[4] , face2[4] , face3[4] ];

  var solution = [];
  vec4.transformMat4( solution , rightHandSide , inverse );

  return solution;
  
}



/*
 *
 * FLATTEN FUNCTIONS:
 * Returns the objects with a dimension of 1 less
 *
 */


// The inverse of the rotation matrices needed to 
// rotate the points so we can take out the last 
// component
Math.flattenMatrix2D = [];
Math.flattenMatrix3D = [];
Math.flattenMatrix4D = [];

// TODO:
Math.flattend2D = function( p ){

  // Flattens point
  var fP = [];  
  vec2.transformMat2( fP  , p , Math.flattenMatrix2D );

  return [ fP[0] ];


}

Math.flatten3D = function( p ){

   // Flattens point
  var fP = [];  
  vec3.transformMat3( fP  , p , Math.flattenMatrix3D );

  return [ fP[0] , fP[1] ];


}


Math.flatten4D = function( p ){

  // Flattens point
  var fP = [];  
  vec4.transformMat4( fP  , p , Math.flattenMatrix4D );

  return [ fP[0] , fP[1] , fP[2] ];

}


/*
 * GETTING FLATTEN MATRICES
 *
 */

// TODO:
  Math.getFlatMatrix2d = function( plane ){



  }


  Math.getFlatMatrix3d = function( plane ){
    
    var zAxis   = [   0      ,    0     ,    1     ];
    var normal  = [ plane[0] , plane[1] , plane[2] ];
 
    var vector1 = [];
    vec3.cross( vector1 , zAxis , normal );

    var vector1Normalized = [];
    vec3.normalize( vector1Normalized , vector1 );

    var vector2 = [];
    vec3.cross( vector2 , vector1Normalized , normal );

    var vector2Normalized = [];
    vec3.normalize( vector2Normalized , vector2 );


    var A = [
      vector1Normalized[0]  , vector1Normalized[1]  , vector1Normalized[2] ,
      vector2[0]            , vector2[1]            , vector2[2] ,
      normal[0]             , normal[1]             , normal[2]
    ];


    var a = [
      vector1Normalized[0] , vector2[0] , normal[0],
      vector1Normalized[1] , vector2[1] , normal[1],
      vector1Normalized[2] , vector2[2] , normal[2],
    ]
   
    return a

  };




  Math.getFlatMatrix4d = function rotationToW( plane ){

    var toNormalize = [ plane[0] , plane[1] , plane[2],  plane[3] ];

    var n = [];
    vec4.normalize( n , toNormalize );
    
    //console.log( n );//var n = [ normal[0] , normal[1] , normal[2] , normal[3] ];


    var R , v , lambda , e1  , e2  , e3 , e4 , E1 , E2 , A , U , AT;

    R = [
      1 , 0 , 0 , 0 ,
      0 , 1 , 0 , 0 ,
      0 , 0 , 1 , 0 ,
      0 , 0 , 0 , 1
    ];

    if( n != [ 0 , 0 , 0 , 1 ] ){
   
      //console.log('Normal Not Weird' );
      e1 = [ 1 , 0 , 0 , 0 ];
      e2 = [ 0 , 1 , 0 , 0 ];
      e3 = [ 0 , 0 , 1 , 0 ];
      e4 = [ 0 , 0 , 0 , 1 ];

      lambda = Math.sqrt( n[0]*n[0] + n[1]*n[1] + n[2]*n[2] );
     

      /* v is a unit vector in the plane determined by n, 
      e4 is perpendicular to e4*/

      v = [];
      var toScale = [ n[0] , n[1] , n[2] , 0 ];
      vec4.scale( v , toScale , 1/lambda );

      /*  
        Start Gram - Schmidt to find E1 , E2 , unit vectors
        which fit into an orthonormal frame along v , e4
      */

      // E1 = e1 - (e1.v)*v;
      E1 = [];
      var e1DOTv = vec4.dot( e1 , v );
      
      var toSub = [];
      vec4.scale( toSub , v , e1DOTv );
      vec4.subtract( E1 , e1 , toSub );

      //console.log( E1 );

      /*console.log( e1 );
      console.log( toSub );
      console.log( E1 );

      console.log( E1 );*/
      if( !arraysEqual( E1 , [ 0 , 0 , 0 , 0 ] ) ){

        //console.log('wtf');
        var E1Temp = [];
        vec4.normalize( E1Temp , E1 );
        E1 = E1Temp;

        // E2 = e2 - (e2.v)*v - (e2.E1)*E1;

        var part1 = [];
        var e2DOTv = vec4.dot( e2 , v );
        var toSub = [];
        vec4.scale( toSub , v , e2DOTv );
        vec4.subtract( part1 , e2 , toSub );

        var part2 = [];
        var e2DOTE1 = vec4.dot( e2 , E1 );
        vec4.scale( part2  ,E1 , e2DOTE1 );

        E2 = [];
        vec4.subtract( E2 , part1 , part2 );

        // See if what we just did worked
        // Otherwise switch to e3
        if( !arraysEqual( E2 , [ 0 , 0 , 0 , 0 ] ) ) { 

          
          var E2Temp = [];
          vec4.normalize( E2Temp , E2 );
          E2 = E2Temp;
        
        }else{
          
          //E2 = e3 - (e3.v)*v - (e3.E1)*E1;
          
          var part1 = [];
          var e3DOTv = vec4.dot( e3 , v );
          var toSub = [];
          vec4.scale( toSub , v , e3DOTv );
          vec4.subtract( part1 , e3 , toSub );

          var part2 = [];
          var e3DOTE1 = vec4.dot( e3 , E1 );
          vec4.scale( part2 , E1 , e3DOTE1 );

          E2 = [];
          vec4.subtract( E2 , part1 , part2 );

          var E2Temp = [];
          vec4.normalize( E2Temp , E2 );
          E2 = E2Temp;

        }

      }else{

        E1 = [];
        var e2DOTv = vec4.dot( e2 , v );
        var toSub = [];
        vec4.scale( toSub , v , e2DOTv );
        vec4.subtract( E1 , e2 , toSub );

        if( !arraysEqual( E1 , [ 0 , 0 , 0 , 0 ] )){

          var E1Temp = [];
          vec4.normalize( E1Temp , E1 );
          E1 = E1Temp;
          
          var part1 = [];
          var e3DOTv = vec4.dot( e3 , v );
          var toSub = [];
          vec4.scale( toSub , v , e3DOTv );
          vec4.subtract( part1 , e3 , toSub );

          var part2 = [];
          var e3DOTE1 = vec4.dot( e3 , E1 );
          vec4.scale( part2 , E1 , e3DOTE1 );

          E2 = [];
          vec4.subtract( E2 , part1 , part2 );

          var E2Temp = [];
          vec4.normalize( E2Temp , E2 );
          E2 = E2Temp;


        }else{

          console.log( 'And Now, Were fucked' );

        }

      }

      // Debug
      /*console.log( 'v ' );
      console.log(  v   );
      console.log( 'E1' );
      console.log(  E1  );
      console.log( 'E2' );
      console.log(  E2  );*/

      AT = [
        E1[0] , E1[1] , E1[2] , E1[3] ,
        E2[0] , E2[1] , E2[2] , E2[3] ,
         v[0] ,  v[1] ,  v[2] ,  v[3] ,
        e4[0] , e4[1] , e4[2] , e4[3]
      ]

      A = [];
      mat4.invert( A , AT );

      //console.log( 'A' );
      //console.log( A );
      

      U = [
        1 , 0 , 0 , 0 ,
        0 , 1 , 0 , 0 ,
        0 , 0 , n[3] , -Math.sqrt( 1 - ( n[3] * n[3] ) ),
        0 , 0 , Math.sqrt( 1 - ( n[3] * n[3] ) ) , n[3]
      ];


      // TODO: SUM FUKD UP SHIT IS GOING ON HERE
      // TODO: FIX IT
      // TODO: NOW
     
      
      //console.log('u');
      //console.log( U );
      R = [];
      var part1 = [];
      mat4.multiply( part1 , A , U );

      //console.log( 'AU' );
      //console.log( part1);
      mat4.multiply( R , part1 , AT );

      //console.log( 'R' );
      //console.log( R );

      return R

    }else{

      return R

    }
    
  }



Math.update = function(){

  this.getFlattenMatrices


  if( cornersToFlatten )
    flattenCorners



}



  /*
   *    Returns a Inverted Rotation matrix for use 
   *    in vec3.transformMat3
   *
   */
  Math.getInvertedRotationMatrix3D = function( plane ){
    
    var zAxis   = [   0      ,    0     ,    1     ];
    var normal  = [ plane[0] , plane[1] , plane[2] ];
 
    var vector1 = [];
    vec3.cross( vector1 , zAxis , normal );

    var vector1Normalized = [];
    vec3.normalize( vector1Normalized , vector1 );

    var vector2 = [];
    vec3.cross( vector2 , vector1Normalized , normal );

    var vector2Normalized = [];
    vec3.normalize( vector2Normalized , vector2 );


    var A = [
      vector1Normalized[0]  , vector1Normalized[1]  , vector1Normalized[2] ,
      vector2[0]            , vector2[1]            , vector2[2] ,
      normal[0]             , normal[1]             , normal[2]
    ];


    var a = [
      vector1Normalized[0] , vector2[0] , normal[0],
      vector1Normalized[1] , vector2[1] , normal[1],
      vector1Normalized[2] , vector2[2] , normal[2],
    ]
   
    return a

  },


  Math.transform3D = function( point , iRotMatrix ){
    
    var newPoint = [];

    vec3.transformMat3( newPoint , point , iRotMatrix );

    //console.log( newPoint );

    return newPoint;

  }



