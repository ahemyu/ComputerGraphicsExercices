"use strict";

function Basic2(canvas, wireframe) {

    let gl = canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true , antialias: false});
    if (!gl) throw new Error("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    gl.viewport(0, 0, canvas.width, canvas.height);


    // TODO 3.2a)	Replace the following code so that
    //              the "vertices" array does not only
    //              contain positions of each vertex,
    //              but also colors. The layout should 
    //              be as follows:
    //              [p0x,p0y,c0x,c0y,c0z,p1x...

    /*
    *
    A central property of geometry are so-called vertex attributes, which means vertex specific data. 
    The most common and most important vertex attribute is the position, but arbitrary other attributes can be defined.
    In this subtask, you should define a color attribute and pass it to the shader program in order to color the triangle. 
    You have to complete several steps to define and use this additional vertex attribute:

    1. in Basic2.js: Define a second attribute (in addition to the position) by extending vertices. 
    The color should be plain red, plain green and plain blue for the three vertices, as you can see in the image. 
    For the shader stage to know which of the entries in vertices belong to the position attribute, define the strides and offsets 
    for the position and color attributes using the three functions gl.getAttribLocation(), gl.enableVertexAttribArray() and 
    gl.vertexAttribPointer().

    2. in the vertex shader: Create an attribute whose name you can use for gl.getAttribLocation(). 
    This attribute will hold the additional color property of each vertex. Create a varying variable and assign the color to 
    it to interpolate the color for each pixel and pass the interpolated value to the fragment shader.

    3. in the fragment shader: Define the varying variable again to enable variable passing from the vertex shader. 
    Use this variable to color each pixel. 


    */
   //TODO: extend this to include the color information for each vertex
    let vertices = [-.5, -.5, 1.0, 0, 0 , //plain ted
                     .5, -.5, 0, 1.0, 0, //plain green 
                     0, .5, 0, 0, 1.0   // plain blue
                    ];

    let indices = [0, 1, 2];

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let fragmentShader = getShader(gl, "shaderWireFrame-fs");
    let vertexShader = getShader(gl, "shaderWireFrame-vs");

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); // why do we bind them agaim here? 

    

    // TODO 3.2a)	Add code to create and enable the second
    //              attribute. Use gl.vertexAttribPointer() to
    //              set offset and stride (in bytes!).
    //              BEWARE: You also have to change the stride
    //              for the position attribute!

    let attrVertexPosition = gl.getAttribLocation(shaderProgram, "vVertex");
    gl.enableVertexAttribArray(attrVertexPosition);
    gl.vertexAttribPointer(attrVertexPosition, 2, gl.FLOAT, false, 20, 0);

    let attrVertexColor = gl.getAttribLocation(shaderProgram, "cVertex");
    gl.enableVertexAttribArray(attrVertexColor);
    gl.vertexAttribPointer(attrVertexColor, 3, gl.FLOAT, false, 20, 8);

    let uniformLocationWireframe = gl.getUniformLocation(shaderProgram, "wireframe");
    gl.uniform1f(uniformLocationWireframe, wireframe);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
