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


    // so the new params we have are the width of the contour and the color of it
    // so based on only the width , we somehow need to be able to add the contour already, but how the fuck do we that? 
    // The whole task: Extend your solution by adding a contour with given pixel width in a contour color.
    //  One half of the contour should be inside the initial circle, the other half outside.
    // Ok so I think it is easier to just draw the contour outside of the circle first, once I have that I can continue with the half thing 

    //TODO: add the contour around the circle
    // we have the pixel width, so basically what we would need to do os for each pixel on the border (exactly those for whom the distance in x and y direction to the center is exactly the radius) 
    let width = canvas.width;
	let height = canvas.height;
    let x = 0;
    let y = 0;
    for (let i = 0; i < 4 * width * height; i += 4) {
        let distance = Math.sqrt(Math.pow((x-center[0]), 2) + Math.pow((y-center[1]), 2));
        if( radius_inner <= distance && distance <= (radius_inner + width_contour) ){
            img.data[i + 0] = color_contour.r;
            img.data[i + 1] = color_contour.g;
            img.data[i + 2] = color_contour.b;
            img.data[i + 3] = 255;
        }
 
        if(distance < radius_inner){
            img.data[i + 0] = color_inner.r;
            img.data[i + 1] = color_inner.g;
            img.data[i + 2] = color_inner.b;
            img.data[i + 3] = 255;
        }
        //increment coordinates
        x++;
        if (x == width){
            y++;
            x = 0;
        }
    }
    /** Comment from me: I have no idea why my code already solved the problem, bc I would have guessed that this will create a boundary
     * OUTSIDE of the circle only (bc I color with the contour colors all pixels that are between the inner radius and inner_radius + contour width)
     * So a comment explaining why this works would be highly appreciated :)
     */
    
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
    
    let width = canvas.width;
	let height = canvas.height;
    let x = 0;
    let y = 0;
    // TASK: 
    // Provide a simple solution for smoothing such edges by mixing the colors sensibly. 
    // Choose a one-pixel-wide border on the outer rim of both color transitions and give the pixels interpolated colors, 
    // based on their particular distance to the circle center.
    // so my initial guess is that I would need interpolate the pixels that directly lie on the inner border with inner color and contour color
    // and for the outer border  I interpolate between contour color and white (?) 
    // A pixel's final color should depend on what fraction of it is inside vs outside the circle.

    for (let i = 0; i < 4 * width * height; i += 4) {
        let distance = Math.sqrt(Math.pow((x-center[0]), 2) + Math.pow((y-center[1]), 2));
        // so pixels whith distance radius_inner - 0.5 shall be colored completely with the color_inner
        // pixels at distance radius_inner + 0.5 need to be colored completely with color_contour.
        // and then from this logic we need to define a percentage, i.e. we start at 1 for inner color and it goes towards 0 until we reach 
        // the outmost point on the "smoothness border"
        // I need to use radius_inner + 0.5 and -0.5 to define the "width of the border" (which is 1 at the end) but how to I get t to be 0 for distance = radius_inner = 0.5 and 1 for 
        let t_inner = distance - radius_inner; //t represents how much of color_contour we use (and 1 -t how much color_inner)  

        // this is the inner "smoothness border"
        if (radius_inner <= distance && distance <= radius_inner + 1.0){
            img.data[i + 0] = Math.round((color_contour.r * t_inner)  + (color_inner.r * (1 - t_inner))); 
            img.data[i + 1] = Math.round((color_contour.g * t_inner) +(color_inner.g * (1-t_inner)));
            img.data[i + 2] = Math.round((color_contour.b * t_inner) + (color_inner.b * (1-t_inner)));
            img.data[i + 3] = 255;
        }
        // outer smoothned border is at radius_inner + width_contour and radius_inner + width_contour + 1.0 
        let t_outer = distance - (radius_inner + width_contour);
        if((radius_inner + width_contour ) <= distance && distance <= (radius_inner + width_contour + 1.0)){
            img.data[i + 0] = Math.round( (color_background.r * t_outer)  + (color_contour.r * (1 - t_outer))); 
            img.data[i + 1] = Math.round((color_background.g * t_outer) +(color_contour.g * (1-t_outer)));
            img.data[i + 2] = Math.round((color_background.b * t_outer) + (color_contour.b * (1-t_outer)));
            img.data[i + 3] = 255;
        }
        // contour border  
        if(radius_inner + 1.0 < distance && distance < (radius_inner + width_contour) ){
            img.data[i + 0] = color_contour.r;
            img.data[i + 1] = color_contour.g;
            img.data[i + 2] = color_contour.b;
            img.data[i + 3] = 255;
        }
        // inside the circle 
        if(distance < radius_inner){
            img.data[i + 0] = color_inner.r;
            img.data[i + 1] = color_inner.g;
            img.data[i + 2] = color_inner.b;
            img.data[i + 3] = 255;
        }
        x++;
        if (x == width){
            y++;
            x = 0;
        }
    }
    context.putImageData(img, 0, 0);
}