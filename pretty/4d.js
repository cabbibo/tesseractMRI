


var equations , corners , plane; 
var intersections   = [];
var oIntersections  = [];

var rotationMatrix , rotationMatrixT;

var initMath = function(){
  
  equations = [

    // X = 0 
    [ 1 , 0 , 0 , 0 , 0 ],    // 0

    // X = 1
    [ 1 , 0 , 0 , 0 , 1 ],    // 1

    // Y = 0
    [ 0 , 1 , 0 , 0 , 0 ],    // 2

    // Y = 1
    [ 0 , 1 , 0 , 0 , 1 ],    // 3  

    // Z = 0
    [ 0 , 0 , 1 , 0 , 0 ],    // 4

    // Z = 1
    [ 0 , 0 , 1 , 0 , 1 ],    // 5

    // W = 0
    [ 0 , 0 , 0 , 1 , 0 ],    // 6

    // W = 1
    [ 0 , 0 , 0 , 1 , 1 ],    // 7

  ]


  corners = [
   
    [ 0 , 2 , 4 , 6 ],
    [ 0 , 2 , 4 , 7 ],
    [ 0 , 2 , 5 , 6 ],
    [ 0 , 2 , 5 , 7 ],

    [ 0 , 3 , 4 , 6 ],
    [ 0 , 3 , 4 , 7 ],
    [ 0 , 3 , 5 , 6 ],
    [ 0 , 3 , 5 , 7 ],

    [ 1 , 2 , 4 , 6 ],
    [ 1 , 2 , 4 , 7 ],
    [ 1 , 2 , 5 , 6 ],
    [ 1 , 2 , 5 , 7 ],

    [ 1 , 3 , 4 , 6 ],
    [ 1 , 3 , 4 , 7 ],
    [ 1 , 3 , 5 , 6 ],
    [ 1 , 3 , 5 , 7 ]

  ]

  plane = [ -0.4347, -0.757, -0.546, 1.11, -0.1145 ];
  //plane =  [ .1 , .1 , .1 , .4 , .4 ];

  rotationMatrixT = [
    1 , 0 , 0 , 0 ,
    0 , 1 , 0 , 0 ,
    0 , 0 , 1 , 0 ,
    0 , 0 , 0 , 1
  ];
 

}

// Intersects a plane with 3 4D faces, returning a point
function intersect( plane , face1 , face2 , face3 ){

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


// Loops Through all of the equations of the planes, 
// and determines the intersection for each of them
function loopThroughIntersections(){

  var flattenedPoints = [];
 
  for( var i = 0; i < equations.length; i ++){

    for( var j = i; j < equations.length; j++ ){

      for( var k = j; k < equations.length; k++ ){

        // Solution of intersection of our plane
        // with the line that is made from the 2 edges
        var p = intersect( plane , equations[i] , equations[j] , equations[k] );

        // Makes sure that we are only pushing points that are 
        // actual points, AKA not intersections of parallel planes
        if( !isNaN(p[0]) ){


          // Makes sure our intersection is within
          // the cube area
          if( 
            p[0] <= 1 && p[0] >= 0 &&
            p[1] <= 1 && p[1] >= 0 &&
            p[2] <= 1 && p[2] >= 0 &&
            p[3] <= 1 && p[3] >= 0 
          ){
            

            var point = returnAllBasis( p );
            point[5] = [ i , j , k ];
            flattenedPoints.push( point );

            
          }
        
        }
      
      }
    
    }
  
  }

  return( flattenedPoints );

}


function returnAllBasis( p ){

  // Flattens point
  var fP = [];  
  vec4.transformMat4( fP  , p , rotationMatrixT );

  point = [
    [ fP[0] , fP[1] , fP[2] ],   // Flattened
    [  p[1] ,  p[2] ,  p[3] ],   // No X
    [  p[0] ,  p[2] ,  p[3] ],   // No y
    [  p[0] ,  p[1] ,  p[3] ],   // No Z
    [  p[0] ,  p[1] ,  p[2] ],   // No W
  ]

  // console.log( point[2] );
  // Making sure we know which planes are hitting this point

  return point

}

function getCornerPosition( i ){

  var x = equations[corners[i][0]][4];
  var y = equations[corners[i][1]][4];
  var z = equations[corners[i][2]][4];
  var w = equations[corners[i][3]][4]; 

  var p = returnAllBasis( [ x , y , z , w ]);

  return p;

}

/*Function to return a 4x4 rotation matrix which sends n (any unit \
vector) to e4 = (0,0,0,1) by rotating along the great circle \
determined by n and e4*/

function rotationToW( plane ){

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


function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/*function getCenterOfMass( system ){

  var total = [ 0 , 0 , 0 ]
  for( var i = 0 ; i < 


}*/


// Returns a list of vertices we have gained,
// and vertices we have lost
function changedVertexFaces( intersections , oIntersections ){

  var differentIntersections  = [];

  var gainedIntersections     = [];
  var lostIntersections       = [];

  // Bool to tell us if we have gained or lost intersections
  var gained;

  if( intersections.length > oIntersections.length ){

    gained = true;

  }

  //var noneEqual = false

  for( var i = 0 ; i < intersections.length; i++ ){
    
    var noneEqual = true;

    for( var j = 0; j < oIntersections.length; j++ ){
      if( arraysEqual( intersections[i][5] , oIntersections[j][5] ) ){
        noneEqual = false;
        break;
      }
    }

    if ( noneEqual )
      gainedIntersections.push( intersections[i][5] );

  }

  for( var i = 0 ; i < oIntersections.length; i++ ){
    
    var noneEqual = true;

    for( var j = 0; j < intersections.length; j++ ){
      if( arraysEqual( intersections[j][5] , oIntersections[i][5] ) ){
        noneEqual = false;
        break;
      }
    }

    if ( noneEqual )
      lostIntersections.push( oIntersections[i][5] );

  }


  if( gainedIntersections.length  != 0 ||
      lostIntersections.length    != 0 ){
    
    return [ gainedIntersections , lostIntersections ];
    //console.log( gainedIntersections.toString() );
    //console.log( lostIntersections.toString() );
  }


}


function checkCorners( changedVerts ){

  var cornersHit = [];

 
  // [ [] , [] , [] ]
  // [] , [] , []
  //console.log('SHE' );
  //console.log( changedVerts[0] );

  var slice = _.flatten( changedVerts[0] );//Array.prototype.slice.call(changedVerts[0]);
  var gained  = _.union( slice );
  //console.log( gained );

  var slice = _.flatten( changedVerts[1] );//Array.prototype.slice.call(changedVerts[0]);
  var lost  = _.union( slice );
  var all     = _.union( gained , lost );

  var type;

  if( changedVerts[0].length > changedVerts[1].length ){
    type = "life";
  }else if( changedVerts[0].length < changedVerts[1].length ){
    type = "death";
  }else{
    type = "sleep";
  }

  // Only 1 
  if( all.length ==  4 ){


    for( var i = 0; i < corners.length; i++ ){
  
      var dif = _.difference( all , corners[i] );
      
      if( dif.length == 0 ){
        cornersHit.push( [ i , type ] );
      }

    }


  }else{

//    console.log( 'multiple corners' );


  }
 // console.log( all );

  if( cornersHit.length > 1 ){
    console.log( 'HIT' );
    console.log( all );
    //console.log( changedVerts[0] );
    //console.log( changedVerts[1] );
    console.log( cornersHit );

  }
  return cornersHit;


}


function whichCorner( faces1 , faces2 ){


  for( var i = 0 ; i < corners.length; i ++ ){


    for( var j = 0; j < faces1.length; j++){
  
     // var face = 

    }

  }

}
