"use strict"

/** __Draws two circles using canvas utilities__
 * 
 * @param {Vec} center_blank - center of the circle without contour
 * @param {Vec} center_contour - center of the circle with contour
 * @param {number} radius_blank - radius of the circle without contour
 * @param {number} radius_contour_inner - radius of the inner circle of the circle with contour
 * @param {number} width_contour - width of the contour
 * @param {Vec} color_blank - color of the circle without contour
 * @param {Vec} color_contour_inner - color of the inner circle of the circle with contour
 * @param {Vec} color_contour_contour - color of the contour
 */
function drawArcCircle(canvas, center_blank, center_contour, radius_blank, radius_contour_inner, width_contour, color_blank, color_contour_inner, color_contour_contour) {
    let context = canvas.getContext("2d", { willReadFrequently: true });
    context.clearRect(0, 0, canvas.width, canvas.height);
    //TODO 1.2) Use the arc() and stroke() methods to rasterize the two circles from Task 1.1.
    /** Task description: JavaScript provides us with some rendering utilities for drawing primitives, 
     * some of which are the arc() method and the stroke() method. Have a look at the documentation 
     * and implement the same circles as before using those methods. The Canvas lineWidth Property may help you with the Contour. 
     * Instead of rendering into two separate canvases, draw the two circles from Task 1.1 into the same render area this time. 
     * Use the given vec_to_string(color) function to convert the color vector to a CSS color value. Draw the circles clockwise! */
    //Blank circle
    //TODO: somwehow at the border there is still smth wrong (idk what)
    context.beginPath();
    context.arc(center_blank[0], center_blank[1], radius_blank, 0, 2* Math.PI);
    context.fillStyle = vec_to_string(color_blank);
    context.fill()
    context.strokeStyle = "white";
    context.stroke();
    
    //contour circle
    context.beginPath();
    context.arc(center_contour[0], center_contour[1], radius_contour_inner, 0, 2* Math.PI);
    context.fillStyle = vec_to_string(color_contour_inner);
    context.fill()
    context.strokeStyle = vec_to_string(color_contour_contour);
    context.lineWidth = width_contour;
    context.stroke();
    

    /** Converts a vector to a "rgb(r,g,b)" string used by javascript
     * @param {Vec} color - color to be converted
     */
    function vec_to_string(color) {
        return "rgb(" + color.r + "," + color.g + "," + color.b + ")"
    }
}
