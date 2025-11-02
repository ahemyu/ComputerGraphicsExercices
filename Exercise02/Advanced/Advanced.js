"use strict";

///////////////////////////
//// global variables  ////
///////////////////////////

// see the slides of lecture 05 for some of the polygons
                  // triangle
var polygons = [new Polygon(
                           [new Point(40, 170),
                            new Point(120, 30),
                            new Point(180, 100)],
                            new Color(127, 200, 0)),
                  // two triangles
                  new Polygon(
                           [new Point(20, 170),
                            new Point(50, 20),
                            new Point(100, 100),
                            new Point(190, 10),
                            new Point(180, 190),
                            new Point(100,100)],
                            new Color(0, 127, 255)),
                  // weird shape
                  new Polygon(
                           [new Point(20, 180),
                            new Point(110, 20),
                            new Point(110, 90),
                            new Point(160, 70),
                            new Point(180, 130)],
                            new Color(255, 0, 127)),
                  // star
                  new Polygon(
                           [new Point(100, 10),
                            new Point(120, 72),
                            new Point(186, 72),
                            new Point(136, 112),
                            new Point(153, 173),
                            new Point(100, 138),
                            new Point(47, 173),
                            new Point(64, 112),
                            new Point(14, 72),
                            new Point(80, 72)],
                            new Color(255, 127, 0))];

/////////////////////
//// edge table  ////
/////////////////////

// edge table entry
function EdgeTableEntry(edge) {
    let dx = 0;
    let dy = 0;
    if (edge.startPoint.y < edge.endPoint.y) {
        this.y_lower = edge.startPoint.y;
        this.x_lower = edge.startPoint.x;
        this.y_upper = edge.endPoint.y;
        dx = edge.endPoint.x - edge.startPoint.x;
        dy = edge.endPoint.y - edge.startPoint.y;
    }
    else {
        this.y_lower = edge.endPoint.y;
        this.x_lower = edge.endPoint.x;
        this.y_upper = edge.startPoint.y;
        dx = edge.startPoint.x - edge.endPoint.x;
        dy = edge.startPoint.y - edge.endPoint.y;
    }

    this.invSlope = dx / dy;
}

function compareEdgeTableEntries(a, b) {
    return a.y_lower - b.y_lower;
}

function printEdgeTableEntry(e) {
    console.log("ET: " + e.y_lower + " " + e.x_lower + " " + e.y_upper + " " + e.invSlope);
}

// edge table
function EdgeTable(polygon) {
    this.entries = new Array(polygon.nEdges);
    this.nEntries = polygon.nEdges;

    for (let i = 0; i < polygon.nEdges; i++) {
        this.entries[i] = new EdgeTableEntry(polygon.edges[i]);
    }
    this.entries.sort(compareEdgeTableEntries);

    // uncomment for debugging
    // for (let i = 0; i < polygon.nEdges; i++) {
    //     printEdgeTableEntry(this.entries[i]);
    // }
}

////////////////////////////
//// active edge table  ////
////////////////////////////

// active edge table entry
function ActiveEdgeTableEntry(edgeTableEntry) {
    this.x_intersect = edgeTableEntry.x_lower;
    this.y_upper = edgeTableEntry.y_upper;
    this.invSlope = edgeTableEntry.invSlope;
}

function compareActiveEdgeTableEntries(a, b) {
    return a.x_intersect - b.x_intersect;
}

// active edge table
function ActiveEdgeTable() {
    this.entries = new Array();
    this.nEntries = 0;
}


/////////////////////////////
//// scanline algorithm  ////
/////////////////////////////

function scanline(image, polygon) {

    let edgeTable = new EdgeTable(polygon);
    let activeEdgeTable = new ActiveEdgeTable();
    
    // TODO 2.3     Perform the scanline algorithm 
    //              by following the single comments.
    //              In order to reach the full number of
    //              points, you only have to do the man-
    //              datory part.

    for (let y_scanline = 0; y_scanline < image.height; y_scanline++) {
        // [optimization]
        // if the active edge table is empty (nEntries==0) we can step to the next edge, i.e. we can set y_scanline = myEdgeTableEntry.y_lower
        // note that the edge table is sorted by y_lower!



        // [mandatory]
        // as we cannot delete entries from the active edge table:
        // - build a new active edge table
        // - copy all those edges from the previous active edge table which should still be in the active edge table for this scanline
        // - assign the new active edge table to activeEdgeTable



        // [mandatory]
        // add new edges from the edge table to the active edge table



        // [mandatory]
        // sort the active edge table along x (use the array sort function with compareActiveEdgeTableEntries as compare function)



        // [mandatory]
        // rasterize the line:
        // for every two successive active edge entries set the pixels in between the x intersections (the first and the second entry build a line segment, the third and the fourth build a line segment and so on)
        // note that setPixel() requires integer pixel coordinates!



        // [mandatory]
        // update the x_intersect of the active edge table entries



    }
}


//////////////////////////
//// render function  ////
//////////////////////////

function RenderCanvas3(canvas, polygon) {

    let context = canvas.getContext("2d");
    let image = context.createImageData(canvas.width, canvas.height);

    // clear canvas
    clearImage(image);

    // draw line
    scanline(image, polygon);

    // show image
    context.putImageData(image, 0, 0);
}

function setupScanline(canvas, polygon_id) {
    // execute rendering
    RenderCanvas3(canvas, polygons[polygon_id]);
}
