var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;

var x = 0;
var y = 0;
var k = 0;
var l = 0;
var alpha = 0;
var beta = 0;
var teta = 0;
var gamma = 0;


matrixStack = [];

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    
    setupProjection();
    setupView();
}

function setupProjection() {
    projection = perspective(60, 1, 0.1, 100);
    //projection = ortho(-1,1,-1,1,0.1,100);
}

function setupView() {
    view = lookAt([0,0,5], [0,0,0], [0,1,0]);
    modelView = mat4(view[0], view[1], view[2], view[3]);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function press(event) {
     
    switch(event.which){
        case 37:
            //tecla esquerda
           if(x>-0.35)
                x-=0.02;
        break;
        case 38:
            //tecla cima
           if(y>-0.15)
            y-= 0.02;
        break;    
        case 39:
            //tecla direita
			if(x<0.05)
                x+=0.02;
        break;
        case 40:
            //tecla baixo
            if(y<0.10)
            y+= 0.02;
        break;
		case 81:
		
			//rotate left
			alpha -=5;
			
			break;
		case 87:
			//rotate right
			
			alpha +=5;
			break;
			
		case 88:
			//rotate bottom arm up
			if(beta<0)
				beta += 10;
		
		break;
		
		case 90:
			//rotate bottom arm down
			if(beta> -90)
				beta -= 10;
		
		break;
		
		case 65:
				//rotate top arm up
				if(teta<0)
				teta += 10;
		break;
		
		
		case 83:
				//rotate top arm down
				if(teta>-90)
				teta -= 10;
		break;
		
		case 75:
			//rotate hand left
			gamma -=5;
			break;
		case 76:
			//rotate hand right
			gamma +=5;
			break;
			
		case 79:
			//open
			if(k > -0.2&& l < 0.4){
				k -= 0.05;
				l +=0.05;
			}
			break;
			
		case 80:
			//close
			
				if(k<0.18 && l > -0.11 ){
					k+=0.05;
					l-=0.05;
				
				}
				
			break;
			
	}
	
}

function draw_scene()
{
    

   
    pushMatrix();
		multTranslation([0,-1,4]);
        draw_cube([1,1,1]);
		
		pushMatrix();
			
			 multTranslation([x+0.15,0.70,y+0.30]);
		
			 multScale([0.20,0.02,0.20]);
			
			 draw_cube([1,0,0]);
			 
			 pushMatrix();

			      multTranslation([0,1,0]);
				  multScale([0.30,1.50,0.30]);
				  multRotY(alpha);
				  draw_cylinder([0,1,0]);
				  
				  pushMatrix();
					multTranslation([0,1,0]);
					multScale([0.50,1,0.50]);
				    draw_cube([1,0,0]);
							pushMatrix();
							
								   multTranslation([0,0.95,0]);
								   multScale([1.40,1.5,1.40]);
								   multRotX(beta);
								   draw_sphere([0,0,1]);
										pushMatrix();
										 multTranslation([0,1.35,0]);
										 multScale([0.7,2,0.7]);
										 draw_cube([1,0,0]);
												pushMatrix();
													
												   multTranslation([0,0.7,0]);
												   multScale([1.40,0.50,1.40]);
												   multRotX(teta);
												   draw_sphere([1,1,0]);
														pushMatrix();
														 	
														 multTranslation([0,1.9,0]);
														 multScale([0.7,3,0.7]);
														 draw_cube([1,0,0]);
																pushMatrix();
																	  multTranslation([0,0.5,0]);
																	  multScale([4,0.3,4]);
																	  multRotY(gamma);
																	  draw_cylinder([1,1,1]);
																		pushMatrix();
																			pushMatrix();
																		 multTranslation([-0.2+k,1.35,0]);
																		 multScale([0.12,2,0.12]);
																		 draw_cube([1,1,0]);
																			popMatrix();
																		
																			pushMatrix();
																			
																		multTranslation([0.2+l,1.35,0]);
																		multScale([0.12,2,0.12]);
																		draw_cube([1,1,0]);
																		
																			popMatrix();		
																		
																	
																	 
																		popMatrix();
																
																popMatrix();
														popMatrix();
												popMatrix();
							
										popMatrix();
							popMatrix();
				  
				  popMatrix();
			
			popMatrix();
		
		popMatrix();
    popMatrix();
   
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    
    requestAnimFrame(render);
}


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    initialize();
	
	
            
    render();
	onkeydown = press;
}
