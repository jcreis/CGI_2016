var torus_points = [];
var torus_normals = [];
var torus_faces = [];
var torus_edges = [];

var torus_points_buffer;
var torus_normals_buffer;
var torus_faces_buffer;
var torus_edges_buffer;

var TORUS_LATS=20;
var TORUS_LONS=30;

function torusInit(gl) {
    torusBuild(TORUS_LATS, TORUS_LONS);
    torusUploadData(gl);
}

// Generate points using polar coordinates
function torusBuild(nlat, nlon) 
{
    // phi will be latitude
    // theta will be longitude
 
    var d_phi = 2*Math.PI / nlat;
    var d_theta = 2*Math.PI / nlon;
    var r = 0.6;
    var sr = 0.3;
    
    // Generate first
	var first = vec3( (r + sr * Math.cos(2*Math.PI)) * Math.cos(2*Math.PI),  -(sr * Math.sin(2*Math.PI)) ,(r + sr * Math.cos(2*Math.PI)) * Math.sin(2*Math.PI));
    torus_points.push(first);
    torus_normals.push(vec3(0,1,0));
    
    // Generate middle
    for(var phi=-2*Math.PI; phi <= 0; phi+=d_phi) {
	
        for(var theta=0; theta<= 2*Math.PI; theta+=d_theta) {

            var pt = vec3((r + sr * Math.cos(theta)) * Math.cos(phi),-(sr * Math.sin(theta)),(r + sr * Math.cos(theta)) * Math.sin(phi));
            torus_points.push(pt);
            var n = vec3(pt);
            torus_normals.push(normalize(n));
        }
    }
 
	   // Generate last
	 var last = vec3( (r + sr * Math.cos(2*Math.PI)) * Math.cos(2*Math.PI),  -(sr * Math.sin(2*Math.PI)) ,(r + sr * Math.cos(2*Math.PI)) * Math.sin(2*Math.PI));
  
    torus_points.push(last);
    torus_normals.push(vec3(0,1,0));
    
//torus faces
    var offset=1;
  
    for(var i=0; i<nlat-1; i++) {
		
        for(var j=0; j<nlon-1; j++) {
			//normal faces
            var p = offset+i*nlon+j;
            torus_faces.push(p);
            torus_faces.push(p+nlon);
            torus_faces.push(p+nlon+1);
            
            torus_faces.push(p);
            torus_faces.push(p+nlon+1);
            torus_faces.push(p+1);
        }
	
			//equator faces
       var p = offset+i*nlon+nlon-1;
    	torus_faces.push(p);
        torus_faces.push(p+nlon);
        torus_faces.push(p+1);

        torus_faces.push(p);
        torus_faces.push(p+1);
        torus_faces.push(p-nlon+1);
		
		// last slice faces
		if(i == nlat-2){
		
		var y =0;
		//Last slice normal faces
		for(var k = 0; k<nlon-1; k++,y++){
	   var p = (nlat-1)*(nlon)+y;
	   
		torus_faces.push(k+1);
	    torus_faces.push(p+1);
        torus_faces.push(k);
	   
		torus_faces.push(p);
        torus_faces.push(k);
        torus_faces.push(p+1);
		
	   
		}
		
		//last slice equator faces
		var p = (nlat)*nlon;
	
		torus_faces.push(p);
		torus_faces.push(nlon);
		torus_faces.push(p-1);

		torus_faces.push(nlon);
		torus_faces.push(nlon-1);
		torus_faces.push(p-1);

		torus_faces.push(nlon);
		torus_faces.push(p);
		torus_faces.push(p+1);
	

		torus_faces.push(p);
		torus_faces.push(p+1);
		
		torus_faces.push(p-nlon+1);

		}
	}
	 
    // Build the edges

var k = 0;
    for(var i=0; i<nlat; i++) {
        for(var j=0; j<nlon;j++) {
            var p = 1 + i*nlon + j;
            torus_edges.push(p);  
            if(j!=nlon-1) 
                torus_edges.push(p+1);
            else torus_edges.push(p+1-nlon);
            
            if(i!=nlat-1) {
                torus_edges.push(p);  
                torus_edges.push(p+nlon);
            }
            else {
				if(k == 0){
				torus_edges.push(p);
                torus_edges.push(k);
				k++;
				}
				
				else{
				torus_edges.push(p-1);
                torus_edges.push(k);
				k++;
					
				}	
               
            }
        }
    }
    
}

function torusUploadData(gl)
{
    torus_points_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_points), gl.STATIC_DRAW);
    
    torus_normals_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torus_normals), gl.STATIC_DRAW);
    
    torus_faces_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_faces), gl.STATIC_DRAW);
    
    torus_edges_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(torus_edges), gl.STATIC_DRAW);
}

function torusDrawWireFrame(gl, program)
{    
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_edges_buffer);
    gl.drawElements(gl.LINES, torus_edges.length, gl.UNSIGNED_SHORT, 0);
}

function torusDrawFilled(gl, program)
{
    gl.useProgram(program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_points_buffer);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, torus_normals_buffer);
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, torus_faces_buffer);
    gl.drawElements(gl.TRIANGLES, torus_faces.length, gl.UNSIGNED_SHORT, 0);
}