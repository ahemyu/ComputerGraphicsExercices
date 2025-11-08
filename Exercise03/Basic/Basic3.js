"use strict";

function Basic3(canvas) {

    // Your task is to draw a orange circle around the center of the quad with the radius r = 0.8.
    //  Additionally, use a smoothing margin for anti-aliasing with a width smoothMargin = 0.01. Implement the following subtasks:
    // Create a uniform variable vec2 canvasSize and retrieve its location in your JavaScript application. 
    // Note: If you do not use the variable in your shader it might be possible that you cannot retrieve its location. 
    // Pass the canvas size to the shader uniform using gl.uniform2f().
    // Map the fragment's coordinate gl_FragCoord.xy into the range [-1,1]^2. Hint: You can debug using gl_FragColor = vec4(abs(uv), 0.0, 1.0);.
    // Discard all fragments outside the radius r; color all fragments inside with orange.
    // Interpolate the opacity (gl_FragColor.a) for all fragments inside [r - smoothMargin, r]. You can use the GLSL function clamp()
    let gl = canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
    if (!gl) throw new Error("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    let glVersion = gl.getParameter(gl.VERSION);
    let glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    console.log("GL Version: \t" + glVersion);
    console.log("GLSL Version: \t" + glslVersion);

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let vertices = [-1, -1,
    1, -1,
    1, 1,
    -1, 1];
    let indices = [0, 1, 2, 0, 2, 3];

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let fragmentShader = getShader(gl, "shaderCircleFromQuad-fs");
    let vertexShader = getShader(gl, "shaderCircleFromQuad-vs");

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


    // TODO 3.3)	Define a constant variable (uniform) to 
    //              "send" the canvas size to all fragments.

    let uniformLocation = gl.getUniformLocation(shaderProgram, "canvasSize");
    gl.uniform2f(uniformLocation, canvas.width, canvas.height);


    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
