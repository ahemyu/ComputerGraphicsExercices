"use strict"

/** __Draws a circle with {center, radius, color} on {canvas}__
 * 
 * @param {Vec} center - center of the circle
 * @param {number} radius - radius of the circle
 * @param {Vec} color - color of the circle
 */

function drawPixelwiseCircle(canvas, center, radius, color) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);
    //TODO 1.1a)      Copy the code from Example.js
    //                and modify it to create a 
    //                circle.]

	// "img.data" is a 1D array of size 200*200*4, containing the rgba pixel data in uint8 format.
	// The image data layout is [height, width, channel], i.e. [200, 200, 4] in this case.
	// For example, "img.data[842]" accesses the blue channel of the 10th pixel in the second row of the image.
	// (0, 0) corresponds to the top left corner of the canvas. 

    // 'height' and 'width' are properties of the canvas object and can be referenced as seen below.
	  let width = canvas.width;
	  let height = canvas.height;

    // we store colors as vectors, you can access the elements like arrays (e.g. color[0]) or using .r/.g/.b or .x/.y/.z
    // all of these access the same value, as shown in the loop below.
    // console.log(color);

    //TODO: adust this to only fill pixels inside a circle with given center and radius
    //Two ideas: Either for each pixel (which is represented as a continuous sequence of four ints (R, G, B, A)) we check if it is inside the circle
    // using the formula: distance squared = (x - x_center) squared + (y - y_center) squared and if distance squared below or equal radius squared, it is inside circle
    let x = 0;
    let y = 0;

    for (let i = 0; i < 4 * width * height; i += 4) {
        // Calculate distance before incrementing coordinates
        let distanceSquared = Math.pow((x-center[0]), 2) + Math.pow((y-center[1]), 2);

        if(distanceSquared <= Math.pow(radius, 2)){
            img.data[i + 0] = color.r;	// access with r(ed), g(reen), b(lue) and a(lpha)
            img.data[i + 1] = color.y;	// access with x, y, z and w
            img.data[i + 2] = color[2]; // access like an array
            img.data[i + 3] = 255;
        }
        // Increment coordinates AFTER using them
        x++;
        if (x == width){
            y++;
            x = 0;
        }
    }
    
    context.putImageData(img, 0, 0);
}

/** __Draws a circle with contour on {canvas}__
 * 
 * @param {Vec} center - center of the circle
 * @param {number} radius_inner - radius of the inner circle
 * @param {number} width_contour - width of the outer contour
 * @param {Vec} color_inner - color inside of the contour
 * @param {Vec} color_contour - color of the contour
 */
function drawContourCircle(canvas, center, radius_inner, width_contour, color_inner, color_contour) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);

    //TODO 1.1b)      Copy your code from above
    //                and extend it to receive a
    //                contour around the circle.

    context.putImageData(img, 0, 0);
}

/** __Draws a circle with a smooth contour on {canvas}__
 * 
 * @param {Vec} center - center of the circle
 * @param {number} radius_inner - radius of the inner circle
 * @param {number} width_contour - width of the outer contour
 * @param {Vec} color_inner - color inside of the contour
 * @param {Vec} color_contour - color of the contour
 * @param {Vec} color_background - color of the background
 */
function drawSmoothCircle(canvas, center, radius_inner, width_contour, color_inner, color_contour, color_background) {
    let context = canvas.getContext("2d");
    let img = context.createImageData(200, 200);

    //TODO 1.1c)      Copy your code from above
    //                and extend it to get rid
    //                of the aliasing effects at
    //                the border.

    context.putImageData(img, 0, 0);
}
