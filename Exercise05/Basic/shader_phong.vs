precision mediump float;

attribute vec3 vVertex;
attribute vec3 vNormal;

uniform mat4 modelMatrix; // model matrix
uniform mat4 cameraMatrix; // camera matrix
uniform mat4 projectionMatrix; // projection matrix

uniform mat4 normalMatrix; //this is the inverse trasnpose of upper left (3 by 3) modelMatrix, needed for non-uniform scaling 


// TODO 5.2a)	Define a varying variable to
//				pass the normal to the fragment
//				shader.

varying vec3 normal;

// TODO 5.2a)	Define a varying variable to
//				pass the world position to the
//				fragment shader.
varying vec3 worldPosition;


void main(void)
{
	mat4 MVP = projectionMatrix * cameraMatrix * modelMatrix;
	gl_Position = MVP * vec4(vVertex, 1);

	// TODO 5.2a)	Assign the normal to the varying variable. 
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to normalize the normal
	//				afterwards.
	//TODO: transform Vnormal from Model Space to Object space

	normal = vec3(normalMatrix * vec4(vNormal, 0.0));
	//TODO: normalize the normal 
	normal = normalize(normal);
	
	// TODO 5.2a)	Assign the position to the varying variable. 
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to dehomogenize it 
	//				afterwards.

	//TODO: transform vVertex from model space to world space
	worldPosition = vec3(modelMatrix * vec4(vVertex, 1.0));
}