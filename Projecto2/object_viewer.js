var gl;
var canvas;
var program, program1, program2;


var vertexColors = [
          
		 [ 1.0, 0.0, 0.0],  // red    
		 [ 1.0, 1.0, 0.0],  // yellow        
		 [ 0.0, 0.0, 1.0],  // blue      
		 [ 1.0, 0.0, 1.0],  // magenta 
		 [ 0.0, 1.0, 0.0],  // green 		 
		 [ 0.0, 1.0, 1.0],  // cyan       
		 [ 1.0, 1.0, 1.0]   // white    
		 ];



var mModelView;
var mModelViewLoc;
var mNormals;
var mNormalsLoc;
var mProjection;
var mProjectionLoc;
var ilu = false;
var projDisplay = 0;

var d = 0.65;
var prespective = false;
var axio = false;
var obliq = false;
var l = 0.1;
var beta = 0;

var wire = true;
var sphere = false;
var isSphere = false;
var cube = false;
var square_pyramid = false;
var torus = false;

var gamma = 0;
var theta = 0;

var generatedColorsFill = [];
var generatedColorsWire = [];


function quad(a, b, c, d,color) { 

   for ( var i = 0; i < 4; ++i ) {
	
		
	  generatedColorsWire.push( vertexColors[6] );   
	   // for solid colored faces use 
      generatedColorsFill.push(vertexColors[color]); 
	  
   }
}

function tri(a, b, c,color) {  
   var x = 0;

   for ( var i = 0; i < 3; ++i ) {
 
		
	  generatedColorsWire.push( vertexColors[6] );   
	   // for solid colored faces use 
      generatedColorsFill.push(vertexColors[color]); 
	  } 
}


//color each cube face with a color
function colorCube() { 
    quad(0,1,2,3,0); //cor 0
    quad(5,6,1,2,1); //cor 1
    quad(4,7,6,5,2); 
    quad(0,3,7,4,3); 
	quad(3,2,6,7,4);  
	quad(0,4,5,1,5); 
}


//color each square pyramid face with a color
function colorSquare_pyramid(){
	
	quad(0,1,2,3,6);
	tri(1,3,4,2);
	tri(3,2,4,3);
	tri(2,0,4,4);
	tri(0,1,4,1);
	

	
	
}

//color sphere with two colors
function colorSphere(){
	var x = 0;

	for(var i =0; i < 200; i++){
		if(x ==1){
			x =0;
		}
	  generatedColorsWire.push( vertexColors[6] );   
	   // for solid colored faces use 
      generatedColorsFill.push(vertexColors[x]);
	  x++;
		
	}
}
//color torus with two colors
function colorTorus(){
	
	var x= 0;

	for(var i =0; i < 200; i++){
	if(x == 2){
		x = 0;
	}
	  generatedColorsWire.push( vertexColors[6] );   
	   // for solid colored faces use 
      generatedColorsFill.push(vertexColors[x]);
	 x++;
		
	}
}



function load_file() {
	
    var selectedFile = this.files[0];

    var reader = new FileReader();
    var id=this.id == "vertex" ? "vertex-shader-2" : "fragment-shader-2";
    reader.onload = (function(f){
        var fname = f.name;
	
        return function(e) {
	
				console.log(fname);
				console.log(e.target.result);
				console.log(id);
				document.getElementById(id).textContent = e.target.result;

			
            if(document.getElementById("fragment-shader-2").textContent!="" && document.getElementById("vertex-shader-2").textContent!=""){
		
                program2 = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
                gl.useProgram(program2);
            if(program2!=-1){
                   reset_program(program2);
                   program = program2;
              }
				}
        }
		
    })(selectedFile);
    reader.readAsText(selectedFile);
	}



function reset_program(prg) {
    mModelViewLoc = gl.getUniformLocation(prg, "mModelView");
    mNormalsLoc = gl.getUniformLocation(prg, "mNormals");
    mProjectionLoc = gl.getUniformLocation(prg, "mProjection");
	iluLoc = gl.getUniformLocation(prg, "ilu");
	gl.uniform1f(iluLoc,ilu);
    program = prg;
}

window.onload = function init() {

	var m = document.getElementById("mymenu"); 
	var m2 = document.getElementById("mymenu2"); 
	var s = document.getElementById("Switch");

	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
			
			case 0:
			
			break;
			case 1:
				    generatedColorsFill = [];
					generatedColorsWire = [];
					cube = true;
					sphere = false;
					square_pyramid = false;
					torus = false;
					wire = true;
					
				
				break;
			case 2:
					generatedColorsFill = [];
					generatedColorsWire = [];
					sphere = true;
					cube = false;
					square_pyramid = false;
					torus = false;
					wire = true;
					
				
				break;
			case 3:
					generatedColorsFill = [];
					generatedColorsWire = [];
					cube = false;
					sphere = false;
					torus = false;
					square_pyramid = true;
					wire = true;

				break;
			case 4:
					generatedColorsFill = [];
					generatedColorsWire = [];
					sphere = false;
					cube = false;
					square_pyramid = false;
					torus = true;
					wire = true;
					
				break;
	
		
	}
	});
	
	m2.addEventListener("click", function() {
		hide();
		switch (m2.selectedIndex) {
			
			case 0:
			 
			break;
			case 1:
			
					obliq = false;
					prespective = false;
					axio = true;
					 document.getElementById("Axo").style.display = "inline";
				
				break;
			case 2:
				
					prespective = false;
					obliq = true;
					axio = false;
						 document.getElementById("Oblique").style.display = "inline";
				
				break;
			case 3:
					
					obliq = false;
					axio = false;
					prespective = true;
					document.getElementById("Perspective").style.display = "inline";
					
			
				break;
	
		
	}
	});
	

function hide(){
    document.getElementById("Perspective").style.display = "none";
    document.getElementById("Oblique").style.display = "none";
    document.getElementById("Axo").style.display = "none";

}

	document.getElementById("Switch").onclick = function () {
			wire = !wire;
			};	

	
    // Get the canvas
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    // Setup the contexts and the program
    gl = WebGLUtils.setupWebGL(canvas);
    program1 = initShaders(gl, "vertex-shader", "fragment-shader");

	
    document.getElementById("vertex").onchange = load_file;
    document.getElementById("fragment").onchange = load_file;


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0,0,canvas.width, canvas.height);
	gl.enable(gl.DEPTH_TEST);

	//Initialize all objects
    sphereInit(gl);
    cubeInit(gl);
	square_pyramidInit(gl);
	torusInit(gl);
	
	//Ajust to window
	mProjection = mat4();
	aspect = canvas.width / canvas.height;
	if (aspect >1) {
           mProjection = ortho(-aspect, aspect, -1, 1, -10, 10);
	}
        else{
		
         mProjection = ortho(-1, 1, -1/aspect, 1/aspect, 10, -10);
		}

    window.onresize = function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        aspect = canvas.width / canvas.height;
			if (aspect >1) {
           mProjection = ortho(-aspect, aspect, -1, 1, -10, 10);
	}
        else{
		
         mProjection = ortho(-1, 1, -1/aspect, 1/aspect, 10, -10);
		}
		
    }

    mModelView = mat4();
    mNormals = transpose(inverse(mModelView));
   

    reset_program(program1);

	
    render();
}

function drawObject(gl, program) 
{	
	
  if(!wire){
	   if(sphere){
		      var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsFill), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   sphereDrawFilled(gl, program);
			
			 
	   }
	    if(square_pyramid){
		
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsFill), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		    square_pyramidDrawFilled(gl, program);
			 
	   }
	  if(cube){
	
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsFill), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   cubeDrawFilled(gl, program);
		     
	  }
	    if(torus){
	
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsFill), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   torusDrawFilled(gl, program);
		     
	  }
  }
   else{
	   
		if(sphere){
			colorSphere();
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsWire), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
			sphereDrawWireFrame(gl, program);
		}
		if(square_pyramid){
		
			colorSquare_pyramid();
			var cBuffer = gl.createBuffer();
		    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		    gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsWire), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   square_pyramidDrawWireFrame(gl, program);
		}
		if(cube){
		  
		   colorCube();
		   
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsWire), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   cubeDrawWireFrame(gl, program);
		}
			if(torus){
				
			colorTorus();
		 
		   var cBuffer = gl.createBuffer();
		   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		   gl.bufferData( gl.ARRAY_BUFFER, flatten(generatedColorsWire), gl.STATIC_DRAW );
		   
		   var color = gl.getAttribLocation( program, "color" ); 
		   gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 0, 0 );
		   gl.enableVertexAttribArray( color );
		   torusDrawWireFrame(gl, program);
		}
	}
   
}
function changeGamma() {
		
		gamma = document.getElementById("slide2").value;
		document.getElementById("showvalue").innerHTML = gamma;

 }; 
 
 function changeTheta() {
		
		theta = document.getElementById("slide").value;
		document.getElementById("showvalue2").innerHTML = theta;
	
 }; 
 
  function changeL() {
		
		l = document.getElementById("slide3").value;
		document.getElementById("showvalue3").innerHTML = l;
	
 }; 
 
  function changeBeta() {
		
		beta = document.getElementById("slide4").value;
		document.getElementById("showvalue4").innerHTML = beta;
	
 }; 
 
function changeD(){
	
	d = document.getElementById("slide5").value;
	
};

function render() 
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
    gl.uniformMatrix4fv(mProjectionLoc, false, flatten(mProjection));

	// Other view
    gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height/2);
	
	if(obliq){
		mModelView = mat4();
		mModelView[0][2] = l*Math.cos(radians(beta));
		mModelView[1][2] = l*Math.sin(radians(beta));
		
	}
	else if(axio){
		
	mModelView = mult((mult(rotateX(gamma),rotateY(theta))),mat4());
	}
	else if(prespective){
	
		mModelView = mat4();
		mModelView[3][2] = 1/d;
		mModelView[3][3] = 0;
	}
	else{
		mModelView[0][0] = 0;
		mModelView[1][1] = 0;
		mModelView[2][2] = 0;
		mModelView[3][3] = 0;
	}
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);
	
    // Top view
    gl.viewport(0,0,canvas.width/2, canvas.height/2);
	mModelView = mult(rotateX(90),mat4());
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    

    // Front view
    gl.viewport(0,canvas.height/2,canvas.width/2, canvas.height/2);
	mModelView = mat4();
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    // Side view
    gl.viewport(canvas.width/2,canvas.height/2,canvas.width/2, canvas.height/2);
	mModelView = mat4();
	mModelView =  mult(rotateY(90),mat4());
    gl.uniformMatrix4fv(mModelViewLoc, false, flatten(mModelView));
    gl.uniformMatrix4fv(mNormalsLoc, false, flatten(mNormals));
    drawObject(gl, program);

    window.requestAnimationFrame(render);
};
