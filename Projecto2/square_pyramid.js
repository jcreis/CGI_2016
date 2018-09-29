
square_pyramid_vertices = [
		vec3(-0.5, -0.5, 0.5), //Base 1
		vec3(0.5, -0.5, 0.5),  //Base 2
		vec3(-0.5, -0.5, -0.5), //Base 3
		vec3(0.5, -0.5, -0.5), //Base4
		vec3(0 , 0.5 ,0)           //Topo

];

var square_pyramid_points = [];
var square_pyramid_normals = [];
var square_pyramid_faces = [];
var square_pyramid_edges = [];

var square_pyramid_points_buffer;
var square_pyramid_normals_buffer;
var square_pyramid_faces_buffer;
var square_pyramid_edges_buffer;

function square_pyramidInit(gl) {
    square_pyramidBuild();
    square_pyramidUploadData(gl);
}

function square_pyramidBuild()
{
    square_pyramidAddBaseFace(0,1,2,3,vec3(0,-1,0));
	square_pyramidAddFace(0,1,4,vec3(0,0.5,1));
    square_pyramidAddFace(1,3,4,vec3(0.5,0,1));
    square_pyramidAddFace(3,2,4,vec3(0,-0.5,1));
    square_pyramidAddFace(2,0,4,vec3(-0.5,0,1));   
}
function  square_pyramidUploadData(gl)
{
	
    square_pyramid_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(square_pyramid_points), gl.STATIC_DRAW);
    
    square_pyramid_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(square_pyramid_normals), gl.STATIC_DRAW);
    
    square_pyramid_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_pyramid_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(square_pyramid_faces), gl.STATIC_DRAW);
    
    square_pyramid_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_pyramid_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(square_pyramid_edges), gl.STATIC_DRAW);
	
}

function square_pyramidDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_pyramid_edges_buffer);
    gl.drawElements(gl.LINES, square_pyramid_edges.length, gl.UNSIGNED_BYTE, 0);

   
}

function square_pyramidDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, square_pyramid_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_pyramid_faces_buffer);
    gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_BYTE, 0);

    
}


function square_pyramidAddBaseFace(a, b, c, d, n)
{
    var offset =   square_pyramid_points.length;
	
    square_pyramid_points.push(square_pyramid_vertices[a]);
    square_pyramid_points.push(square_pyramid_vertices[b]);
    square_pyramid_points.push(square_pyramid_vertices[c]);
    square_pyramid_points.push(square_pyramid_vertices[d]);
	

	for(var i=0; i<4; i++)
        square_pyramid_normals.push(n);
    
    // Add 2 triangular faces (a,b,c) and (a,c,d)
    square_pyramid_faces.push(offset);
    square_pyramid_faces.push(offset+1);
    square_pyramid_faces.push(offset+2);
    
    square_pyramid_faces.push(offset+2);
    square_pyramid_faces.push(offset+3);
    square_pyramid_faces.push(offset+1);
    
    // Add all base edges
    square_pyramid_edges.push(offset);
    square_pyramid_edges.push(offset+1);
    
    square_pyramid_edges.push(offset+1);
    square_pyramid_edges.push(offset+3);
	
	square_pyramid_edges.push(offset+3);
    square_pyramid_edges.push(offset+2);
	
	square_pyramid_edges.push(offset+2);
    square_pyramid_edges.push(offset);	
}

function square_pyramidAddFace(a, b, c, n)
{
   var offset = square_pyramid_points.length;
    
    square_pyramid_points.push(square_pyramid_vertices[a]);
    square_pyramid_points.push(square_pyramid_vertices[b]);
    square_pyramid_points.push(square_pyramid_vertices[c]);

		
    for(var i=0; i<3; i++)
        square_pyramid_normals.push(n);
    
    // Add triangular face
    square_pyramid_faces.push(offset);
    square_pyramid_faces.push(offset+1);
	square_pyramid_faces.push(offset+2);
    
    // Add 2 edges
	 
	square_pyramid_edges.push(offset+1);
	square_pyramid_edges.push(offset+2);
	
	square_pyramid_edges.push(offset+2);
	square_pyramid_edges.push(offset);
     
}
