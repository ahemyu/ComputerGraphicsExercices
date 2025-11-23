
/////////////////////////////
////////   Helpers   ////////
/////////////////////////////

/**
 * Converts a color given in float range [0,1] to the integer range [0,255]
 * @param {number[]} rgb_float - three float color values [r,g,b] in the range [0,1]
 * @returns {number[]} - three integer color values [r,g,b] in the range [0,255]
 */
function floatToColor(rgb_float) {
    return [Math.max(Math.min(Math.floor(rgb_float[0] * 255.0), 255), 0),
            Math.max(Math.min(Math.floor(rgb_float[1] * 255.0), 255), 0),
            Math.max(Math.min(Math.floor(rgb_float[2] * 255.0), 255), 0)];
}

/**
 * Set current stroke color of context to the given color.
 * @param {object} context - canvas 2D context
 * @param {number[]} rgb_float - three float color values in the range [0,1]
 */
function setStrokeStyle(context, rgb_float) {
    let c = floatToColor(rgb_float);
    context.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

/**
 * Set current fill color of context to the given color.
 * @param {object} context - canvas 2D context
 * @param {number[]} rgb_float - three float color values in the range [0,1]
 */
function setFillStyle(context, rgb_float) {
    let c = floatToColor(rgb_float);
    context.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

function arrow(context, fromx, fromy, tox, toy, text) {
    if (fromx == tox && fromy == toy) return;

    // http://stuff.titus-c.ch/arrow.html
    let headlen = 5;   // length of head in pixels
    let angle = Math.atan2(toy - fromy, tox - fromx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    if (text) {
        let d = [tox - fromx, toy - fromy];
        let l = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
        context.fillText(text, tox + 10 / l * d[0], toy + 10 / l * d[1]);
    }
}


///////////////////////////
////////   5.1a)   ////////
///////////////////////////

/**
 * @param {Object} context - Canvas 2D Context
 * @param {vec2} point - 2D surface point that should receive lighting
 * @param {vec2} normal - 2D surface normal
 * @param {vec2} eye - 2D eye position
 * @param {vec2} pointLight - 2D point light position
 * @param {vec3} albedo - base color
 * @param {boolean} showVectors 
 * @returns {vec3} - lighting color
 */
function PhongLighting(context, point, normal, eye, pointLight, albedo, showVectors) {

    /* Phong Lighting approximates the illumination of a surface point p seen from a position eye
    ,assuming that the perceived color of the surface point is composed out of an ambient part, which tries to model the indirect light from the environment, a diffuse part and a specular part.

    Below you see the eye, the position of the point light source (light) and the surface. The surface is sampled at certain points. You can set a user specific sample using the left mouse button. 
    Your task is to implement the Phong Lighting, 
    therefore you have to implement the function PhongLighting(). 
    Note: The light emitted from the light source is assumed to be white so that you can ignore the terms I_amb and I_in in the Phong formulae.
    */ 

    // TODO 5.1a) Implement Phong lighting - follow the stepwise instructions below:

    // 1. Compute view vector v, light vector l and the reflected light vector r (all pointing away from the point and normalized!).
    //    Note: To help you implementing this task, we draw the computed vectors for the user specified sample point.
    //    Replace the following dummy lines:
    // view vector
    let v = eye.sub(point).normalized();

    //light vector
    // we will need the point_light I think? 
    // direction from x to point_light is just point - pointLight?
    // or do I need to divide by the length as well (like we did for view vector?)

    let l = pointLight.sub(point).normalized();

    //reflection vector
    // from slides:r = 2(n dot l)n - l
    let r = normal.sca(2 * normal.dot(l)).sub(l);

    // 2. Compute the ambient part, use 0.1 * albedo as ambient material property.
    //    You can check your results by setting "color" (defined below) to only ambient part - 
    //    this should give you constant dark green.

    let ambient = albedo.sca(0.1);

    // 3. Compute the diffuse part, use 0.5 * albedo as diffuse material property.
    //    You can check your results by setting "color" (defined below) to only diffuse part - 
    //    this should give you a color which gets lighter the more the plane's normal coincides with the direction to the light.
    // from lectures: L_diff = k_diff * I_in * (normal.dot(l))
    let diffuse = (albedo.sca(0.5)).sca(clamp(normal.dot(l), 0, normal.dot(l)));
    
    // 4. Compute the specular part, assume an attenuated white specular material property (0.4 * [1.0, 1.0, 1.0]).
    //    Use the defined shiny factor.
    //    You can check your results by setting "color" (defined below) to only diffuse part - 
    //    this should give you a grey spotlight where view direction and reflection vector coincide.
    
    // from lectures: L_spec = k_spec * I_in * (v.dot(r))^n_s   (I_n = 1; n_s = shiny) 
    let shiny = 30.0;
    let k_spec = new Vec(0.4, 0.4, 0.4);
    let spec = k_spec.sca(Math.pow(clamp(v.dot(r), 0, v.dot(r)), shiny));

    // 5. Add ambient, diffuse and specular color.
    //    Store the result in the variable color - replace the following dummy line:
    let color = ambient.add(diffuse).add(spec);


    if (showVectors) {
        // draw vectors
        let vecScale = 100;
        context.strokeStyle = 'rgb(0,0,0)';
        arrow(context, point.x, point.y, point.x + vecScale * normal.x, point.y + vecScale * normal.y, "n");
        arrow(context, point.x, point.y, point.x + vecScale * v.x, point.y + vecScale * v.y, "v");
        arrow(context, point.x, point.y, point.x + vecScale * l.x, point.y + vecScale * l.y, "l");
        arrow(context, point.x, point.y, point.x + vecScale * r.x, point.y + vecScale * r.y, "r");
    }

    return color;
}

function Basic1_1(canvas, nSamples, eye_pos, light_pos) {
    let alpha = 0.25;

    if (canvas.id == "canvasPhongLighting") {
        // reset the slider and the checkboxes
        let slider = document.getElementById('nSamples');
        slider.addEventListener('change', onChangeNSamples);
        slider.value = 5;

        canvas.addEventListener('mousedown', onMouseDown, false);
    }
    
    Render();
    
    // Interaction

    function onChangeNSamples() {
        nSamples = this.value;
        Render();
    }

    function onMouseDown(e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        alpha = x / rect.width;
        Render();
    }

    // Rendering

    function Render() {
        let context = canvas.getContext("2d", { willReadFrequently: true });
        if (canvas.id == "canvasPhongLighting") {
            clearCanvas2d(canvas);
            context.font = "italic 12px Georgia";
            context.textAlign = "center";
        }

        // light source
        let eye = eye_pos;

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.arc(eye.x, eye.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasPhongLighting") {
            // eye text
            context.fillText("eye", eye.x, eye.y + 20);
        }

        // light source
        let pointLight = light_pos;

        // draw light source
        context.fillStyle = 'rgb(50, 100, 250)';
        context.beginPath();
        context.arc(pointLight.x, pointLight.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasPhongLighting") {
            // light source text
            context.fillText("light", pointLight.x, pointLight.y + 20);
        }

        // line
        let line;
        if (canvas.id == "canvasPhongLighting") {
            line = [new Vec(0, 270), new Vec(600, 270)];
        } else {
            line = [new Vec(0, 150), new Vec(200, 150)];
        }
        let albedo = new Vec(0, 1, 0);

        // draw surface (line)
        setStrokeStyle(context, [0.5, 0.5, 0.5]);
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.lineWidth = 4;
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y);
        context.stroke();
        if (canvas.id == "canvasPhongLighting") {
            context.fillText("surface", line[0].x + 50, line[0].y + 20);
        }
        context.lineWidth = 1;

        for (let i = 0; i < nSamples; ++i) {
            let _alpha = i / (nSamples - 1.0);
            // sampled point on the surface
            let point = new Vec((1.0 - _alpha) * line[0].x + _alpha * line[1].x, (1.0 - _alpha) * line[0].y + _alpha * line[1].y);
            let normal = new Vec(0.0, -1.0);

            // compute light - Phong Lighting
            let color = PhongLighting(context, point, normal, eye, pointLight, albedo, false);

            // draw point
            setFillStyle(context, color)
            context.beginPath();
            context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            context.fill();
        }

        // current point on the surface
        let point = new Vec((1.0 - alpha) * line[0].x + alpha * line[1].x, (1.0 - alpha) * line[0].y + alpha * line[1].y);
        let normal = new Vec(0.0, -1.0);

        // compute light - Phong Lighting
        let color = PhongLighting(context, point, normal, eye, pointLight, albedo, canvas.id == "canvasPhongLighting");

        if (canvas.id == "canvasPhongLighting") {
        // draw point
            setFillStyle(context, color)
            context.beginPath();
            context.fillText("p", point.x, point.y + 20);
            context.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            context.fill();
        }
    }
}


///////////////////////////
////////   5.1b)   ////////
///////////////////////////

function Basic1_2(canvas, nLineSegments, amplitude, eye_pos, light_pos) {

    if (canvas.id == "canvasFlatShading") {
        // reset the slider and the checkboxes
        let slider1 = document.getElementById('nLineSegments2_2');
        slider1.addEventListener("change",onChangeNLineSegments);
        slider1.value = nLineSegments;
        let slider2 = document.getElementById('amplitude2_2');
        slider2.addEventListener("change",onChangeAmplitude);
        slider2.value = amplitude;
    }

    Render();

    // Interaction

    function onChangeNLineSegments() {
        nLineSegments = this.value;
        Render();
    }
    function onChangeAmplitude() {
        amplitude = this.value;
        Render();
    }

    // Rendering

    function Render() {
        let context = canvas.getContext("2d", { willReadFrequently: true });
        if (canvas.id == "canvasFlatShading") {
            clearCanvas2d(canvas);
            context.font = "italic 12px Georgia";
            context.textAlign = "center";
        }

        // light source
        let eye = eye_pos;

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.arc(eye.x, eye.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasFlatShading") {
            context.fillText("eye", eye.x, eye.y + 20);
        }

        // light source
        let pointLight = light_pos;

        // draw light source
        context.fillStyle = 'rgb(50, 100, 250)';
        context.beginPath();
        context.arc(pointLight.x, pointLight.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasFlatShading") {
            context.fillText("light", pointLight.x, pointLight.y + 20);
        }

        // line segments
        let p0 = 0;
        let p1 = canvas.width;
        let y_start = canvas.height * 0.8;
        let lineSegments = new Array(nLineSegments);
        for (let i = 0; i < nLineSegments; ++i) {
            let _alpha = i / (nLineSegments);
            let start = new Vec(Math.floor((1.0 - _alpha) * p0 + _alpha * p1), y_start - amplitude * Math.sin(_alpha * Math.PI));
            _alpha = (i + 1.0) / (nLineSegments);
            let end = new Vec(Math.ceil((1.0 - _alpha) * p0 + _alpha * p1), y_start - amplitude * Math.sin(_alpha * Math.PI));
            lineSegments[i] = [start, end];
        }
        let albedo = new Vec(0, 1, 0);

        // draw surface (line segments) using flat shading
        for (let i = 0; i < nLineSegments; ++i) {
            // TODO 5.1b) Implement Flat Shading of the line segments - follow the stepwise instructions below:

            // 1. Compute representor of the primitive (-> midpoint on the line segment).

            let startPoint = lineSegments[i][0];
            let endPoint = lineSegments[i][1];

            let midpoint = new Vec((startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2);

            // 2. Compute the normal of the line segment.
            let directonStartToEnd = endPoint.sub(startPoint);
            // perependiucular vector  of v (x, y) is v'=(y, -x) (bc in canvas y goes down)
            let normal = new Vec(directonStartToEnd[1], -directonStartToEnd[0]).normalized();

            // 3. Use the function PhongLighting that you implemented in the previous assignment to evaluate the color.
            let color = PhongLighting(context, midpoint, normal, eye_pos, light_pos, albedo, false);

            // 4. Set the stroke color (use setStrokeStyle() defined in this .js-file).
            setStrokeStyle(context, color);

            // draw the line segment
            context.beginPath();
            context.lineWidth = 8;
            context.moveTo(lineSegments[i][0].x, lineSegments[i][0].y);
            context.lineTo(lineSegments[i][1].x, lineSegments[i][1].y);
            context.stroke();

            if (canvas.id == "canvasFlatShading") {
                if (i < nLineSegments - 1) {
                    // draw auxiliary line between this and the next line segment
                    context.beginPath();
                    setStrokeStyle(context, [0, 0, 0]);
                    context.lineWidth = 1;
                    context.moveTo(lineSegments[i][1].x, lineSegments[i][1].y + 4);
                    context.lineTo(lineSegments[i][1].x, lineSegments[i][1].y + 14);
                    context.stroke();
                }
            }
        }
        context.fillStyle = 'rgb(0,0,0)';
        if (canvas.id == "canvasFlatShading") {
            context.fillText("surface", p0.x + 50, p0.y + 20);
        }
        context.lineWidth = 1;
    }
}



///////////////////////////
////////   5.1c)   ////////
///////////////////////////

function computeVertexNormal(lineSegments, segmentIndex, nLineSegments, isStartVertex) {
    // Compute normal of current segment
    let startPoint = lineSegments[segmentIndex][0];
    let endPoint = lineSegments[segmentIndex][1];
    let direction = endPoint.sub(startPoint);
    let currentNormal = new Vec(direction[1], -direction[0]).normalized();

    if (isStartVertex) {
        // Start vertex of current segment
        if (segmentIndex === 0) {
            // First segment, use only current segment normal
            return currentNormal;
        } else {
            // Interior start vertex so average with previous segment normal
            let prevStart = lineSegments[segmentIndex - 1][0];
            let prevEnd = lineSegments[segmentIndex - 1][1];
            let prevDirection = prevEnd.sub(prevStart);
            let prevNormal = new Vec(prevDirection[1], -prevDirection[0]).normalized();
            return currentNormal.add(prevNormal).normalized();
        }
    } else {
        // End vertex of current segment
        if (segmentIndex === nLineSegments - 1) {
            // Last segment so use only current segment normal
            return currentNormal;
        } else {
            // Interior end vertex, average with next segment normal
            let nextStart = lineSegments[segmentIndex + 1][0];
            let nextEnd = lineSegments[segmentIndex + 1][1];
            let nextDirection = nextEnd.sub(nextStart);
            let nextNormal = new Vec(nextDirection[1], -nextDirection[0]).normalized();
            return currentNormal.add(nextNormal).normalized();
        }
    }
}

function Basic1_3(canvas, nLineSegments, amplitude, eye_pos, light_pos) {
    if (canvas.id == "canvasGouraudShading") {
        // reset the slider and the checkboxes
        let slider1 = document.getElementById('nLineSegments2_3');
        slider1.addEventListener('change',onChangeNLineSegments);
        slider1.value = nLineSegments;
        let slider2 = document.getElementById('amplitude2_3');
        slider2.addEventListener('change',onChangeAmplitude);
        slider2.value = amplitude;
    }

    Render();

    // Interaction
        
    function onChangeNLineSegments() {
        nLineSegments = this.value;
        Render();
    }
    function onChangeAmplitude() {
        amplitude = this.value;
        Render();
    }
    
    // Rendering

    function Render() {
        let context = canvas.getContext("2d", { willReadFrequently: true });
        if (canvas.id == "canvasGouraudShading") {
            clearCanvas2d(canvas);
            context.font = "italic 12px Georgia";
            context.textAlign = "center";
        }

        // light source
        let eye = eye_pos;

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.arc(eye.x, eye.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasGouraudShading") {
            context.fillText("eye", eye.x, eye.y + 20);
        }

        // light source
        let pointLight = light_pos;

        // draw light source
        context.fillStyle = 'rgb(50, 100, 250)';
        context.beginPath();
        context.arc(pointLight.x, pointLight.y, 4, 0, 2 * Math.PI);
        context.fill();
        if (canvas.id == "canvasGouraudShading") {
            context.fillText("light", pointLight.x, pointLight.y + 20);
        }

        // line segments
        let p0 = 0;
        let p1 = canvas.width;
        let y_start = canvas.height * 0.8;
        let lineSegments = new Array(nLineSegments);
        for (let i = 0; i < nLineSegments; ++i) {
            let _alpha = i / (nLineSegments);
            let start = new Vec(Math.floor((1.0 - _alpha) * p0 + _alpha * p1), y_start - amplitude * Math.sin(_alpha * Math.PI));
            _alpha = (i + 1.0) / (nLineSegments);
            let end = new Vec(Math.ceil((1.0 - _alpha) * p0 + _alpha * p1), y_start - amplitude * Math.sin(_alpha * Math.PI));
            lineSegments[i] = [start, end];
        }
        let albedo = new Vec(0, 1, 0);

        // draw surface (line segments) using flat shading
        for (let i = 0; i < nLineSegments; ++i) {

            /*
            In contrast to Flat Shading, Gouraud Shading computes the color at the vertices and interpolates the color linearly over the primitives.
            Follow the TODOs in Basic1_2 and implement Gouraud Shading for the line segments
            */
            // TODO 5.1c) Implement Gouraud Shading of the line segments - follow the stepwise instructions below:

            // 1. Compute vertex normals by interpolating between normals of adjacent line segments (weighted by line segment length!). Take care of border cases.
            let startPoint = lineSegments[i][0];
            let endPoint = lineSegments[i][1];

            let normalLeftVertex = computeVertexNormal(lineSegments, i, nLineSegments, true);
            let normalRightVertex = computeVertexNormal(lineSegments, i, nLineSegments, false);

            // 2. Evaluate the color at the vertices using the PhongLighting function.
            let colorLeftVertex = PhongLighting(context, startPoint, normalLeftVertex, eye, pointLight, albedo, false);
            let colorRightVertex = PhongLighting(context, endPoint, normalRightVertex, eye, pointLight, albedo, false);

            // 3. Use the linear gradient stroke style of the context to linearly interpolate the vertex colors over the primitive (https://www.w3schools.com/TAgs/canvas_createlineargradient.asp).
            //    The color triples can be scaled from [0,1] to [0,255] using the function floatToColor().
            //    To apply the gradient, set context.strokeStyle to your linear gradient.

            const grd = context.createLinearGradient(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
            // first we need to convert the colorTriples which are in in [0,1 ] to [0,255]
            let colorLeftVertexRgb = floatToColor(colorLeftVertex);
            let colorRightVertexRgb = floatToColor(colorRightVertex);
            grd.addColorStop(0, `rgb(${colorLeftVertexRgb[0]}, ${colorLeftVertexRgb[1]}, ${colorLeftVertexRgb[2]})`);
            grd.addColorStop(1, `rgb(${colorRightVertexRgb[0]}, ${colorRightVertexRgb[1]}, ${colorRightVertexRgb[2]})`);

            context.strokeStyle = grd;

            // draw line segment
            context.beginPath();
            context.lineWidth = 8;
            context.moveTo(lineSegments[i][0].x, lineSegments[i][0].y);
            context.lineTo(lineSegments[i][1].x, lineSegments[i][1].y);
            context.stroke();

            if (canvas.id == "canvasGouraudShading") {
                if (i < nLineSegments - 1) {
                    // draw auxiliary line between this and the next line segment
                    context.beginPath();
                    setStrokeStyle(context, [0, 0, 0]);
                    context.lineWidth = 1;
                    context.moveTo(lineSegments[i][1].x, lineSegments[i][1].y + 4);
                    context.lineTo(lineSegments[i][1].x, lineSegments[i][1].y + 14);
                    context.stroke();
                }
            }
        }
        if (canvas.id == "canvasGouraudShading") {
            context.fillText("surface", p0.x + 50, p0.y + 20);
        }
        context.lineWidth = 1;
    }
}

