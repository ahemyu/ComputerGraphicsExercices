"use strict";

function Basic1(canvas, slices) {
    //slices is numnber of triangles we will use to create the circle
    let gl = canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw new Error("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    gl.viewport(0, 0, canvas.width, canvas.height);

    let c = [0.3, 0.2];
    let r = 0.7;

    let vertices = []; //vertec coordinates
    let indices = []; //triangle indices
 
    // TODO 3.1)	Replace the following code so that
    //              the vertices and indices do not describe
    //              a triangle but a circle around the center
    //              c with radius r. Use triangles to describe 
    //              the circle's geometry. The number of
    //              triangles is stored in the variable slices.

    /* 
    The aim of the first task is to rasterize a circle using triangles. 
    The result should be similar to the arc() and SVG circles you know from the first exercise sheet.
    On the right, you can see a schematic of the circle construction from triangles.
    The testcases below only show a single triangle so far. \
    Change the code in Basic1.js to build a vertex buffer object and an index buffer object describing a circle \
    with radius r (currently set to 0.7) around the center point c (currently set to [0.3, 0.2]). 
    The amount of circle segments is varied for the different testcases.
    Each vertex should only be stored once - use the Indexed Face Set structure shown in the lecture to keep the vertex buffer small:
    Do not store points twice but store them once and reference them twice (or more times) using an index buffer
    */


    //this creates a triangle
    //TODO: We need to replace this code by code that rasterizes a circle with triangles


    //so one thing we know for sure is that ALL of the triangles will share at least one common vertex, which will be at the center. 
    // so lets first defione that one vertex and create an index for it such that we can reuse it throughout the code



    vertices.push(c[0]);
    vertices.push(c[1]);

    // ok so we need slice many vertices around the perimeter of the circle 
    // that means that each vertex is exctly theta spaced between each other
    // so then we can use v_x = c[0] + r * cos(theta) and v_y = c[1] + r * sin(theta)

    let angle = 0;
    let angle_offset = (2 * Math.PI)/slices;

    for (let i = 0; i < slices; i++){
        angle = (i * angle_offset) + (Math.PI / 2); //use offset to determine current angle
        //define vertex position
        let v_x = c[0] + r * Math.cos(angle);
        let v_y = c[1] + r * Math.sin(angle);
        //add to vertices 
        vertices.push(v_x);
        vertices.push(v_y);
       }    

    // now the indices

    for (let i = 1; i <= slices; i++){
        // so we always push the center vertex
        indices.push(0);
        
        // current one
        indices.push(i); 

        //and the next one BUT we can resuse vertex 1 again
        if (i == slices){
            indices.push(1);
        }else{
            indices.push(i+1)
        }
        
    }

    
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let ibo = gl.createBuffer(); //index buffer, Indexed Face Set 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let vertexShader = getShader(gl, "shader-vs");
    let fragmentShader = getShader(gl, "shader-fs");

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    let attrVertexPosition = gl.getAttribLocation(shaderProgram, "vVertex");
    gl.enableVertexAttribArray(attrVertexPosition);
    gl.vertexAttribPointer(attrVertexPosition, 2, gl.FLOAT, false, 8, 0);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

// so in a nutshell it does this: 
// 1. GPU reads indices from IBO
// 2. For each index, fetches corresponding vertex from VBO
// 3. Groups vertices into triangles
// 4. Runs vertex shader on each vertex
// 5. Rasterizes triangle
// 6. Runs fragment shader on each pixel
// 7. Draws to canvas