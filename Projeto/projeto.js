var gl;
var canvas;
var colorLoc;
var factor = 0.25;
var scale = 1.0;
var isJulia = false;
var cx =0;
var cy = 0;
var desloc = 0.0;
var deslocY = 0.0;
var lastX = 0.0;
var lastY = 0.0;
var clicked = false;
var factorLoc = 0.0;
var deslocLoc = 0.0;
var scaleLoc = 1.0;

window.onload = function init() {
	
		
		var m = document.getElementById("mymenu"); 

	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
			
			case 0:
				isJulia = false;
				cx = 0;
				cy = 0;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;

			case 1:
				isJulia = true;
				cx = -0.4;
				cy = 0.6;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;

			case 2:
				isJulia = true;
				cx =  0.285;
				cy=0;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;

			case 3:
				isJulia = true;
				cx = 0.285;
				cy = 0.01;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;

			case 4:
				isJulia = true;
				cx = -0.8;
				cy = 0.156;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;

			case 5:
				isJulia = true;
				cx = 0.8;
				cy = 0;
				gl.uniform1f(cLocx,cx);
				gl.uniform1f(cLocy,cy);
				gl.uniform1f(isJuliaLoc, isJulia);
				break;
		
	}
});


	
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    // Three vertices
    var vertices = [
        vec2(-1.0,1.0),
        vec2(-1.0,-1.0),
        vec2(1.0,1.0),
        vec2(1.0, -1.0)
    ];
    
	
	canvas.onmousedown = click;
    canvas.onmouseup = unclick;
    canvas.onmousemove = move;
	onkeydown = press;
	
    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	//liga as variaveis do html
	var cLocx = gl.getUniformLocation(program, "cx");
	var cLocy = gl.getUniformLocation(program, "cy");
	deslocLoc = gl.getUniformLocation(program, "desloc"); 
	deslocLocY = gl.getUniformLocation(program, "deslocY");
	var isJuliaLoc = gl.getUniformLocation(program, "isJulia");
	factorLoc = gl.getUniformLocation(program, "factor");
    scaleLoc = gl.getUniformLocation(program, "scale");
	
	gl.uniform1f(scaleLoc,scale); //scaleLoc = var do html  e scale = variavel calculada no js e mandada para o scaleLoc do html
	gl.uniform1f(deslocLoc,desloc);
	gl.uniform1f(deslocLocY,deslocY);
	gl.uniform1f(isJuliaLoc, isJulia);
	gl.uniform1f(cLocx,cx);
	gl.uniform1f(cLocy,cy);
	gl.uniform1f(factorLoc, factor);
    render();
	
}
	
function changeFactor() {
		
		factor = document.getElementById("slide").value;
		document.getElementById("showvalue").innerHTML = factor;
		gl.uniform1f(factorLoc, factor);
 }; 
 
 
 
 function click(event){
	 clicked = true;
	 
	 lastX = event.offsetX;
	 lastY = event.offsetY;
	 
 };
 
 function unclick(event){
	 
	clicked = false;
	
	
	 
 };
 
 function move(event){ //trata do movimento do rato
	 if(!clicked){
		 return ;
	 }
	 
	  desloc += (event.offsetX - lastX)/(canvas.width*scale);
	  deslocY +=(event.offsetY - lastY)/(canvas.height*scale);
	
	  lastX = event.offsetX;
	  lastY = event.offsetY;
	 
	  gl.uniform1f(deslocLoc,desloc); 
	  gl.uniform1f(deslocLocY,deslocY);
 };
 
 function press(event){
	
	 switch(event.which){
		 
		 case 187: //+
				scale += 0.8*scale;
				
				gl.uniform1f(scaleLoc,scale);
				
		 break;
		 
		 case 189: //-
				scale -= 0.8*scale;
				gl.uniform1f(scaleLoc,scale);
		 break;
	 }
	 
 };

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	window.requestAnimFrame(render);
	
}
