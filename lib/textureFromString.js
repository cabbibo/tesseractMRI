
var stringCanvas = document.createElement('canvas');
stringCanvas.width  = 500;
stringCanvas.height = 500; 

function textureFromString( string ){

    // create a canvas element
	var canvas1 = document.createElement('canvas');
	var context1 = canvas1.getContext('2d');
	context1.font = "Bold 40px Arial";
	context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.fillText( string , 0, 50);
    
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas1) 
	texture.needsUpdate = true;

    return texture;
    
}




/*
 
  THREE.textCreator 

  This will be a way to quickly add text to a three.js 
  scene. There will be two ways to do this. 

  1. domElement

    Create a Dom Element that will always be positioned
    over the object by doing a projection


  2. text3D
    
    Creates a 3D texture to use in the scene, and than
    gives it a plane geometry scaled so it looks good

*/
THREE.TextCreator = function(params){

  this.params = _.defaults( params || {}, {
   
      size:                                300,
      type:                  "Bold 20px Arial", 
      color:  "rgba( 255 , 255 , 255 , 0.95 )"
          
  });

  this.canvas         = document.createElement('canvas');
  this.canvas.width   = this.params.size;
  this.canvas.height  = this.params.size;

  this.canvas.style.position = 'absolute'; 
  this.canvas.style.top = '0px'; 
  this.canvas.style.left = '0px';
  this.canvas.style.zIndex = '1000'

  console.log( document.body );
  document.body.appendChild( this.canvas );

  console.log( this.canvas );

  this.context        = this.canvas.getContext( '2d' );
  this.context.width  = this.canvas.width;
  this.context.height = this.canvas.height;

  this.context.font   = "1px GeoSans";
  this.context.fontSize = 50;
  //this.context.textBaseline = 'middle';


}

THREE.TextCreator.prototype = {


    createMesh: function( params ){

    var canvas  = document.createElement('canvas');

    var context = canvas.getContext( '2d' ); 


    var params = _.defaults( params || {}, {
      
      string: 'hey there buddy',
      color:  '#ffffff',
      size:   100,
          
    });


    var size   = params.size;
    var color  = params.color;
    var string = params.string;



    var margin;

    if( !params.margin ){
      margin = size * .5;
    }

    context.font = size + "pt  Arial";
    var textWidth = context.measureText(string).width;

    canvas.width = textWidth + margin;
    canvas.height = size + margin;
    context.font = size + "pt 'GeoSans'";

    if(params.backgroundColor) {
        context.fillStyle = params.backgroundColor;
        context.fillRect(
            canvas.width / 2 - textWidth / 2 - margin / 2, 
            canvas.height / 2 - size / 2 - + margin / 2, 
            textWidth + margin, 
            size + margin
        );
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    context.fillText(string, canvas.width / 2, canvas.height / 2);


    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({
        map :         texture,
        transparent:  true
    });

    var geo = new THREE.PlaneGeometry(canvas.width, canvas.height);
    var mesh = new THREE.Mesh(geo, material);
    mesh.doubleSided = true;

    mesh.string = string;

    return mesh;

  },

  addText: function( string , size ){

    var mesh = createMesh( string , size );
    scene.add( mesh );

    return mesh

  }

}


function addCircle(){
var testMat = new THREE.MeshNormalMaterial();
  var geo = new THREE.SphereGeometry( 300 , 4 ,4 );
    var mesh = new THREE.Mesh( geo , testMat );

    scene.add( mesh );

}



