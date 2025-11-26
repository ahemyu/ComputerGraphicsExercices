/////////////////////////////
////////   Helpers   ////////
/////////////////////////////

/**
 * computes the midpoint between a and b
 * @param {number[]} a - point with arbitrary dimension
 * @param {number[]} b - point with dimension like a
 * @returns {number[]} component wise center between a and b
 */
function midPoint(a, b) {
    let result = new Vec(...a);
    for (let i = 0; i < a.length; ++i) result[i] = 0.5 * (a[i] + b[i]);
    return result;
}

function Basic2a(canvas) {
    clearCanvas2d(canvas);
    let context = canvas.getContext("2d", { willReadFrequently: true });
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    context.font = "bold 12px Georgia";
    context.textAlign = "center";

    // triangle - in camera space
    let triangle = [new Vec([0.5, -0.5, -1.0]), new Vec([0.0, 3.0, -4.0]), new Vec([-3.0, -1.0, -4.0])];

    // projection matrix
    let M = new Mat([1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0], [0.0, 0.0, -2.0, -1.0], [0.0, 0.0, -3.0, 0.0]);

    // TODO 6.2
    // Project triangle (Use the Mat.transformPoint function from num.js which performs homogenization, applies the matrix and dehomogenizes the result).
    // Then render the projected triangle instead of the original triangle!

    // Replace this dummy line!
    drawTriangle(context, canvasWidth, canvasHeight, triangle, true);
}


function Basic2b(canvas) {
    clearCanvas2d(canvas);
    let context = canvas.getContext("2d", { willReadFrequently: true });
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    context.font = "bold 12px Georgia";
    context.textAlign = "center";

    // triangle - in camera space
    let triangle = [new Vec([0.5, -0.5, -1.0]), new Vec([0.0, 3.0, -4.0]), new Vec([-3.0, -1.0, -4.0])];

    // projection matrix
    let M = new Mat([1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0], [0.0, 0.0, -2.0, -1.0], [0.0, 0.0, -3.0, 0.0]);

    // TODO 6.2
    // 1. Project the triangle.

    // 2. Compute the midpoints of the edges (Use the helper function midPoint defined above!)
    //    and store them in another triangle.

    // 3. Draw the triangles (Set last argument to false for inner triangle!).

}


function Basic2c(canvas) {
    clearCanvas2d(canvas);
    let context = canvas.getContext("2d", { willReadFrequently: true });
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    context.font = "bold 12px Georgia";
    context.textAlign = "center";

    // triangle - in camera space
    let triangle = [new Vec([0.5, -0.5, -1.0]), new Vec([0.0, 3.0, -4.0]), new Vec([-3.0, -1.0, -4.0])];
    
    let triangleInner = new Array(3);
    for (let i = 0; i < 3; ++i) {
        triangleInner[i] = new Vec([0.5 * (triangle[i][0] + triangle[(i + 1) % 3][0]),
                             0.5 * (triangle[i][1] + triangle[(i + 1) % 3][1]),
                             0.5 * (triangle[i][2] + triangle[(i + 1) % 3][2])]);
    }
    
    // projection matrix
    let M = new Mat([1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0], [0.0, 0.0, -2.0, -1.0], [0.0, 0.0, -3.0, 0.0]);

    // TODO 6.2
    // 1. Project the triangle and store it in homogeneous coordinates.
    // (M.transformPoint(vec) will dehomogenize, so use M.mul(vec) to only apply the projection
    // and take care to homogenize the input point yourself beforehand!)

    // 2. Compute the mid points, but this time in homogeneous coordinates (Make use of midPoint()!).

    // 3. Dehomogenize the points (you can use the Vec.dehom() function from num.js).

    // 4. Draw the triangles (Set last argument to false for inner triangle!).

}



/////////////////////////////////////
////////   Drawing Helpers   ////////
/////////////////////////////////////


function point(context, x, y, fillStyle) {
    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(x,y, 8, 0, 2 * Math.PI);
    context.fill();
}

function drawTriangle(context, canvasWidth, canvasHeight, trianglePoints, isOuterTriangle) {
    // draw triangle
    context.strokeStyle = 'rgb(0,0,0)';
    context.fillStyle = 'rgb(0,0,0)';
    context.beginPath();
    context.moveTo(canvasWidth * (0.5 - trianglePoints[0][0] / 2.0), canvasHeight * (0.5 - trianglePoints[0][1] / 2.0));
    context.lineTo(canvasWidth * (0.5 - trianglePoints[1][0] / 2.0), canvasHeight * (0.5 - trianglePoints[1][1] / 2.0));
    context.lineTo(canvasWidth * (0.5 - trianglePoints[2][0] / 2.0), canvasHeight * (0.5 - trianglePoints[2][1] / 2.0));
    context.lineTo(canvasWidth * (0.5 - trianglePoints[0][0] / 2.0), canvasHeight * (0.5 - trianglePoints[0][1] / 2.0));
    context.stroke();

    if (isOuterTriangle) {
        point(context, canvasWidth * (0.5 - trianglePoints[0][0] / 2.0), canvasHeight * (0.5 - trianglePoints[0][1] / 2.0), 'rgb(255,0,0)');
        point(context, canvasWidth * (0.5 - trianglePoints[1][0] / 2.0), canvasHeight * (0.5 - trianglePoints[1][1] / 2.0), 'rgb(0,255,0)');
        point(context, canvasWidth * (0.5 - trianglePoints[2][0] / 2.0), canvasHeight * (0.5 - trianglePoints[2][1] / 2.0), 'rgb(0,0,255)');
    } else {
        context.fillStyle = 'rgb(100,100,100)';
        context.fill();
    }
}
