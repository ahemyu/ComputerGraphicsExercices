import { Vec, Mat } from "../resources/js/num.js";
import * as Num from "../resources/js/num.js";
import { clearCanvas2d, clearImage } from "../resources/js/sheet.js";

////////////////////////////////////////////////////////
/////////////////////   HELPER   ///////////////////////
////////////////////////////////////////////////////////

/**
 * Sort objects by the x-coordinate of the center of their aabb
 * @param {Object2D[]} objects - array of objects bound by an aabb
 * @returns {Object2D[]} - sorted copy of the input array
 */
function sort_along_x(objects) {
    let objects_copy = objects.slice();
    objects_copy.sort(function (a, b) { return (a.aabb[0][0] + a.aabb[1][0]) / 2 - (b.aabb[0][0] + b.aabb[1][0]) / 2; });
    return objects_copy;
}

/**
 * Sort objects by the y-coordinate of the center of their aabb
 * @param {Object2D[]} objects - array of objects bound by an aabb
 * @returns {Object2D[]} - sorted copy of the input array
 */
function sort_along_y(objects) {
    let objects_copy = objects.slice();
    objects_copy.sort(function (a, b) { return (a.aabb[0][1] + a.aabb[1][1]) / 2 - (b.aabb[0][1] + b.aabb[1][1]) / 2; });
    return objects_copy;
}

/**
 * Determine if two objects overlap (based on their aabb)
 * @param {Object2D} first 
 * @param {Object2D} second 
 * @returns {boolean} - true if aabbs of the objects overlap
 */
function overlaps(first, second) {
    let f_min_x = 1000;
    let f_min_y = 1000;
    let f_max_x = 0;
    let f_max_y = 0;
    let s_min_x = 1000;
    let s_min_y = 1000;
    let s_max_x = 0;
    let s_max_y = 0;
    for (let i = 0; i < first.primitives.length; i++) {
        let point = first.primitives[i].p0;
        if (point[0] < f_min_x) f_min_x = point[0];
        if (point[1] < f_min_y) f_min_y = point[1];
        if (point[0] > f_max_x) f_max_x = point[0];
        if (point[1] > f_max_y) f_max_y = point[1];
    }
    for (let i = 0; i < second.primitives.length; i++) {
        let point = second.primitives[i].p0;
        if (point[0] < s_min_x) s_min_x = point[0];
        if (point[1] < s_min_y) s_min_y = point[1];
        if (point[0] > s_max_x) s_max_x = point[0];
        if (point[1] > s_max_y) s_max_y = point[1];
    }
    if (f_min_x > s_max_x) return false; // min x
    if (f_max_x < s_min_x) return false; // max x
    if (f_min_y > s_max_y) return false; // min y
    if (f_max_y < s_min_y) return false; // max y
    return true;
}


export function Basic1(canvas, pRaySource, pRayTarget, pDrawRay, pNumPolygons, pPolygonSize, pShowAABB, pUseTree, pShowIntersections, pSeed) {
    
    //////////////////////////////////////
    /////////////   Ray   ////////////////
    //////////////////////////////////////

    class Ray{
        constructor(from, to){
            this.pos = from.copy();
            this.dir = to.sub(from).normalized();
        }

        /**
         * Test intersection of ray with aabb
         * @param {number[][]} aabb - axis aligned bounding box in the form [[min_x,min_y],[max_x,max_y]]
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns 
         */
        intersect(aabb, context){
            let result = null;
            // TODO 10.1 c)     Compute the intersection point of this ray with the given
            //                  axis-aligned bounding box if there is one.

            // 1. Compute the distance to the entry and exit points for the two (x and y) slabs
            //    and compute both the first exit point and the last entry point.
            let tminx, tmaxx, tminy, tmaxy = 0;
            let enter = tminx;
            let exit = tmaxx;


            // 2. Check if there is an intersection with the AABB
            //    by making sure the intersections of both slabs
            //    overlaps and the exit point is not behind the ray.
            //    If there is an intersection return a new 
            //    Intersection object containing this ray and the entry distance.
            if (enter > 0) {
                // result = ...;
            }

            return result;
        }
    }

    class Intersection{
        constructor(ray, ray_t){
            this.ray = ray;
            this.ray_t = ray_t;
            this.point = ray.pos.add(ray.dir.sca(ray_t));
        }
    }

    ////////////////////////////////////////////////////////
    /////////////   Line - 2D Primitive   //////////////////
    ////////////////////////////////////////////////////////

    class Line {
        /**
         * 2D Line Primitive
         * @param {Vec} p0 - line start point
         * @param {Vec} p1 - line end point
         * @param {number[]} color - color triple [r,g,b]
         */
        constructor(p0, p1, color) {
            this.p0 = p0.copy();
            this.p1 = p1.copy();
            this.color = color.copy();
        }

        /**
         * Draw the line to the context (using its color)
         * @param {object} context - 2d canvas context
         * @param {bool} debug - use yellow color
         */
        draw(context, lineWidth = 1, debug = false) {
            context.setLineDash([1, 0]);
            context.lineWidth = lineWidth;
            context.strokeStyle = 'rgb(' + Math.floor(255 * this.color[0]) + ',' + Math.floor(255 * this.color[1]) + ',' + Math.floor(255 * this.color[2]) + ')';
            if(debug) context.strokeStyle = 'rgb(255,255,0)';
            context.beginPath();
            context.moveTo(this.p0[0], this.p0[1]);
            context.lineTo(this.p1[0], this.p1[1]);
            context.stroke();
        }

        /**
         * Compute Intersection of line with ray
         * @param {Ray} ray
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns {Intersection|null} - intersection if exists
         */
        intersect(ray, context){
            if(showIntersections) this.draw(context, 1, true);
            let lineDir = this.p1.sub(this.p0);
            let b = this.p1.sub(ray.pos);
            let A = new Mat([lineDir[0], lineDir[1]], [ray.dir[0], ray.dir[1]]);
            let x = A.inv().mul(b);
            const t_max = Number.POSITIVE_INFINITY;
            if (x.x >= 0 && x.x <= 1.0 && x.y >= 0 && x.y <= t_max) {
                return new Intersection(ray, x.y);
            }
            return null;
        }
    }


    ////////////////////////////////////////////////////////
    //////////////////   2D Object   ///////////////////////
    ////////////////////////////////////////////////////////

    class Object2D {
        /**
         * 2D Object (i.e. collection of line-primitives)
         * @param {Line[]} primitives - 2D lines, the object consists of
         * @property {number[][]} aabb - Axis aligned bounding box [[min_x,min_y],[max_x,max_y]] (generated based on primitives)
         * @property {Line[]} aabb_primitives - Visual representation of aabb (4 Lines) (generated based on aabb)
         */
        constructor(primitives) {
            this.primitives = primitives;
            console.log(primitives);

            // 10.1 a)     Compute the axis-aligned bounding box
            //                  for the object. The box should be defined by 
            //                  its bottom left (smallest x- and y-value) and
            //                  its top right corner (highest x- and y-value).

            // 1. Compute the axis-aligned bounding box!
            //    Replace the following dummy line.
            let x_min = Infinity;
            let x_max = -Infinity;
            let y_min = Infinity;
            let y_max = -Infinity;

            for(const primitive of primitives){
               // each primitive is object like this: {
                //   "p0": [
                //     187.41520668199882,
                //     146.4998044539243
                //   ],
                //   "p1": [
                //     185.0347117350691,
                //     173.34454930832067
                //   ],
                //   "color": [
                //     0.45250727627717424,
                //     0.5563853605599434,
                //     0.48690709596124293
                //   ]
                // }

                x_min = Math.min(x_min, primitive.p0[0], primitive.p1[0])
                y_min = Math.min(y_min, primitive.p0[1], primitive.p1[1]);
                x_max = Math.max(x_max, primitive.p0[0], primitive.p1[0]);
                y_max = Math.max(y_max, primitive.p0[1], primitive.p1[1]);
            }
            this.aabb = [[x_min, y_min], [x_max, y_max]]; // should be in this format: [[min_x, min_y],[max_x, max_y]]


            // 2. Compute the primitives to graphically represent the
            //    bounding box as "Line"s. Use the given color.
            //    Be careful to pass the line's start and end point as Vecs.
            //    You have to draw the lines counter-clockwise, otherwise the testcases wont work!
            let color = new Vec(0.1, 0.1, 0.1);
            // counter clockwise means: 
            //  from (x_min, y_min) to (x_max, y_min)
            // then from (x_max, y_min) to (x_max, y_max)
            // then from (x_max, y_max) to (x_min, y_max)
            // then from (x_min, y_max) to (x_min, y_min)
            // edit: no it does not bc on canvas y growns downward!
            // so it should actually be: 

            //  from (x_min, y_min) to (x_min, y_max)
            // then from (x_min, y_max) to (x_max, y_max)
            // then from (x_max, y_max) to (x_max, y_min)
            // then from (x_max, y_min) to (x_min, y_min)
            this.aabb_primitives = [
                new Line(new Vec(x_min, y_min), new Vec(x_min, y_max), color), 
                new Line(new Vec(x_min, y_max), new Vec(x_max, y_max), color), 
                new Line(new Vec(x_max, y_max), new Vec(x_max, y_min), color), 
                new Line(new Vec(x_max, y_min), new Vec(x_min, y_min), color), 
            ];
        }

        /**
         * Draw the object to the context (i.e. draw its primitives (and its aabb))
         * @param {object} context - 2d canvas context
         */
        draw(context) {
            for (let i = 0; i < this.primitives.length; ++i) {
                this.primitives[i].draw(context);
            }
            if (showAABB) {
                for (let i = 0; i < this.aabb_primitives.length; i++) {
                    this.aabb_primitives[i].draw(context);
                }
            }
        }

        /**
         * Compute Intersection of object with ray (i.e. closest intersection with one of its primitives)
         * @param {Ray} ray
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns {Intersection|null} - intersection if exists
         */
        intersect(ray, context){
            // here one part of the optimization takes place
            let aabbIntersection = null;
            if(this.aabb[0]){
                if(showIntersections){
                    for(let p of this.aabb_primitives) p.draw(context, 1, true);
                }
                aabbIntersection = ray.intersect(this.aabb, context);
            }
            if(this.aabb[0] && !aabbIntersection){
                return null;
            } else {
                // only test primitives for intersection, if aabb is intersected
                let result = null;
                for(let p of this.primitives){
                    let i = p.intersect(ray, context);
                    if(i && (!result || result.ray_t>i.ray_t)) result = i;
                }
                return result;
            }
        }
    }


    ////////////////////////////////////////////////////////
    ///////////////////   2D Scene   ///////////////////////
    ////////////////////////////////////////////////////////

    class Scene {
        /**
         * 2D Scene (i.e. collection of objects)
         * @param {Object2D[]} objects - the objects forming the scene
         * @property {KDTree} kdTree - Kd-tree object hierarchy (generated based on objects aabbs)
         */
        constructor(objects) {
            this.objects = objects;
            this.kdTree = new KDTree(objects);
        }

        /**
         * Draw the scene to the context (i.e. draw its objects and the kdTree)
         * @param {object} context - 2d canvas context
         */
        draw(context) {
            if (!useTree) { // simply draw the objects
                for (let i = 0; i < this.objects.length; ++i) {
                    this.objects[i].draw(context);
                }
            } else { // draw the kdTree and the contained objects
                this.kdTree.draw(context);
            }
        }

        /**
         * Compute Intersection of scene with ray (i.e. closest intersection with one of its objects)
         * @param {Ray} ray
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns {Intersection|null} - intersection if exists
         */
        intersect(ray, context){
            let result = null;
            if(!useTree){
                // Not optimized intersection test
                for(let p of this.objects){
                    let i = p.intersect(ray, context);
                    if(i && (!result || result.ray_t>i.ray_t)) result = i;
                }
            }else{
                // optimized hierarchical intersection test
                result = this.kdTree.intersect(ray, context);
            }
            return result;
        }
    }

    ////////////////////////////////////////////////////////
    //////////////   Kd tree and its nodes   ///////////////
    ////////////////////////////////////////////////////////

    class KdNode {
        /**
         * Node of the Kd tree
         * @param {boolean} isInner 
         * - true: it is an inner node (storing aabb, children-nodes, splitAxis and splitPosition)
         * - false: it is a leaf node  (storing aabb and children-objects)
         * @param {number[][]} aabb - axis aligned bounding box of the node [[min_x,min_y],[max_x,max_y]]
         * @param {(KdNode[]|Object2D[])} children 
         * - (if inner node) two-element array holding left and right (or top and bottom) children.
         * - (if leaf node)   array holding the objects
         * @param {string} splitAxis - (only inner node) "x": split along x-axis, "y": split along y-axis
         * @param {number} splitPosition - (only inner node) 1D position of the split in world-coordinates (along the axis defined by splitAxis)
         */
        constructor(isInner, aabb, children, splitAxis, splitPosition) {
            this.isInner = isInner;      
            this.aabb = aabb;         
            this.children = children;
            this.splitAxis = splitAxis;
            this.splitPosition = splitPosition;
        }

        /**
         * Draw the Node to the context (i.e. draw all its children and a split axis (horizontal red, vertical blue) for inner nodes)
         * @param {object} context - 2d canvas context
         */
        draw(context) {
            if (this.isInner) {
                let line;
                if (this.splitAxis == 'x') {
                    let color = new Vec(0, 0, 1); // vertical splitting lines: blue
                    line = new Line(new Vec(this.splitPosition, this.aabb[0][1]), new Vec(this.splitPosition, this.aabb[1][1]), color);
                } else {
                    let color = new Vec(1, 0, 0); // horizontal splitting lines: red
                    line = new Line(new Vec(this.aabb[0][0], this.splitPosition), new Vec(this.aabb[1][0], this.splitPosition), color);
                }
                line.draw(context, 2);
            }
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].draw(context); // draw exists for both objects and nodes
            }
        }

        /**
         * Compute Intersection of node with ray (i.e. closest intersection with one of its children)
         * @param {Ray} ray
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns {Intersection|null} - intersection if exists
         */
        intersect(ray, context){
            if(showIntersections){
                context.lineWidth = 3;
                context.beginPath();
                context.strokeStyle="rgb(255,255,0)";
                context.moveTo(this.aabb[0][0],this.aabb[0][1]);
                context.lineTo(this.aabb[1][0],this.aabb[0][1]);
                context.lineTo(this.aabb[1][0],this.aabb[1][1]);
                context.lineTo(this.aabb[0][0],this.aabb[1][1]);
                context.lineTo(this.aabb[0][0],this.aabb[0][1]);
                context.stroke();
                context.lineWidth = 1;
            }

            //Here, the optimization takes place
            let aabbIntersection = ray.intersect(this.aabb, context);
            if(!aabbIntersection){
                return null;
            } else {
                // only test children for intersection, if aabb is hit
                let result = null;
                for(let p of this.children){
                    let i = p.intersect(ray, context);
                    if(i && (!result || result.ray_t>i.ray_t)) result = i;
                }
                return result;
            }
        }
    }

    class KDTree {
        /**
         * Kd Tree (hierarchy of KdNodes)
         * @param {Object2D[]} objects - objects to create a Kd-Tree hierarchy for.
         */
        constructor(objects) {
            this.objects = objects;

            // This creates the root node as a single leaf node containing the whole canvas size
            // and all objects. The first axis to split along is the x axis.
            this.root = new KdNode(false, [[0, 0], [canvas.width, canvas.height]], this.objects, 'x', 0);

            // The root node is put onto the stack for further examination.
            // In the following, the stack contains all leaf nodes which might
            // be split into inner nodes afterwards.
            let stack = [];
            stack.push(this.root);

            // As long as the stack is not empty, this loop pops nodes 
            // from the stack.
            while (stack.length != 0) {
                let node = stack.pop();

                // TODO 10.1 b)     Build the kd-tree structure by
                //                  splitting nodes which contain 
                //                  too many triangles.

                if (node.children.length > 3) { // The node needs to be split.

                    // This node should be an inner node from now on.
                    node.isInner = true;

                    // 1. Compute the split position (x value for split along x axis,
                    //    y value for split along y axis). 
                    //    You can use the functions sort_along_x() and sort_along_y() 
                    //    in order to get a sorted copy of the objects in the node.
                    //    Use the objects' bounding boxes to determine the right split 
                    //    location, which must be in between the two neighbouring
                    //    bounding boxes! (midway between [first.min, second.max])
                    //    Keep in mind that for an odd amount of polygons the right/lower
                    //    node (with the higher x/y values) should contain the extra polygon.
                    if (node.splitAxis == 'x') {
                        // ...
                    } else {
                        // ...
                    }

                    // 2. Iterate over the objects in the node and assign them to
                    //    one of the two or even both arrays (via .push()), depending on their
                    //    relative position to the split position.
                    //    Use the objects' bounding boxes to decide!
                    let objectsLeft = [];
                    let objectsRight = [];
                    for (let i = 0; i < node.children.length; i++) {
                        let obj = node.children[i];
                        if (node.splitAxis == 'x') {
                            // ...
                        } else {
                            // ...
                        }
                    }

                    // 3. Create two new leafs with the appropriate objects, aabb and splitAxis.
                    //    Afterwards, assign them as the current node's children and push them on
                    //    the stack for further splitting.
                    let leftChild;
                    let rightChild;
                    if (node.splitAxis == 'x') {
                        // ...
                    } else {
                        // ...
                    }
                    // ...
                }
            }
        }

        /**
         * Draw the KdTree to the canvas (i.e. draw its nodes recursively starting with the root-node)
         * @param {object} context - 2d canvas context
         */
        draw(context) {
            this.root.draw(context);
        }

        /**
         * Compute Intersection of KdTree with ray (i.e. intersection with the root node)
         * @param {Ray} ray
         * @param {object} context - 2d canvas context, the intersection is logged to
         * @returns {Intersection|null} - intersection if exists
         */
        intersect(ray, context){
            return this.root.intersect(ray, context);
        }
    }

    // random state
    let deterministicRandomState = -17;
    function deterministicRandomResetState(seed = -17) { deterministicRandomState = seed; }
    /**
     * Deterministic random Function
     * @returns {number} pseudo random number in [0,1]
     */
    function deterministicRandom() {
        let x = Math.sin(deterministicRandomState++) * 10000;
        return x - Math.floor(x);
    }

    let context = canvas.getContext("2d");
    let nPolygons = pNumPolygons;
    let scene = initScene();
    let raySource = pRaySource;
    let rayTarget = pRayTarget;
    let drawRay = pDrawRay
    let showAABB = pShowAABB;
    let useTree = pUseTree;
    let showIntersections = pShowIntersections;

    ///////// Setup Interaction
    if (canvas.id == "canvasBasic1") {
        let slider = document.getElementById('nPolygons');
        slider.addEventListener("change",function() {
            nPolygons = this.value;
            scene = initScene();
            Render();
        });
        slider.value = nPolygons;
        let checkbox1 = document.getElementById('box');
        checkbox1.addEventListener("change",()=>{
            showAABB = !showAABB;
            Render();
        });
        checkbox1.checked = showAABB;
        let checkbox2 = document.getElementById('tree');
        checkbox2.addEventListener("change",()=>{
            useTree = !useTree;
            Render();
        })
        checkbox2.checked = useTree;

        let checkbox3 = document.getElementById('tests');
        checkbox3.addEventListener("change",()=>{
            showIntersections = !showIntersections;
            Render();
        })
        checkbox3.checked = showIntersections;

        canvas.addEventListener('mousedown', onMouseDown, false);
        function onMouseDown(e) {
            let rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            if (e.ctrlKey) {
                raySource = new Vec(x,y);
            } else {
                rayTarget = new Vec(x,y);
            }
            Render();
        }
    }

    //////// Render

    Render();
    function Render(){
        clearCanvas2d(canvas);
        scene.draw(context);
        let ray = new Ray(raySource, rayTarget);
        let intersection = scene.intersect(ray, context);
        if (drawRay) {
            let hitpoint = new Vec(ray.pos[0]+100000*ray.dir[0],ray.pos[1]+100000*ray.dir[1]);
            if (intersection) {
                hitpoint = new Vec(intersection.point.x, intersection.point.y);
            }
            context.strokeStyle="rgb(0,0,0)";
            context.lineWidth = 3;
            context.beginPath();
            context.setLineDash([5, 2]);
            context.moveTo(ray.pos[0],ray.pos[1]);
            context.lineTo(hitpoint.x, hitpoint.y);
            context.stroke();
            if(intersection) {
                let endpoint = new Vec(ray.pos[0]+100000*ray.dir[0],ray.pos[1]+100000*ray.dir[1]);
                context.strokeStyle="rgb(100, 100, 100)";
                context.lineWidth = 3;
                context.beginPath();
                context.setLineDash([3, 2]);
                context.moveTo(hitpoint.x, hitpoint.y);
                context.lineTo(endpoint.x, endpoint.y);
                context.stroke();
                 // draw hitpoint
                context.fillStyle="rgb(0,0,0)";
                context.beginPath();
                context.arc(intersection.point[0], intersection.point[1], 5, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }

    // init 2d scene
    function initScene() {
        let objects = new Array();
        let border = pPolygonSize;

        deterministicRandomResetState(pSeed);

        while (objects.length < nPolygons) {
            let color = new Vec(deterministicRandom(), deterministicRandom(), deterministicRandom());
            let numPoints = Math.floor(deterministicRandom() * 7) + 3;
            let points = new Array(numPoints);
            let middle = [border + deterministicRandom() * (canvas.width - 2 * border), border + deterministicRandom() * (canvas.height - 2 * border)];
            let deltaPhi = 2 * Math.PI / numPoints;
            for (let i = 0; i < numPoints; i++) {
                let radius = (deterministicRandom()) * border;
                points[i] = new Vec(middle[0] + radius * Math.cos(i * deltaPhi), middle[1] + radius * Math.sin(i * deltaPhi));
            }
            let lines = new Array(numPoints);
            for (let i = 0; i < numPoints; i++) {
                lines[i] = new Line(points[i], points[(i + 1) % numPoints], color);
            }
            let polygon = new Object2D(lines);
            let overlapping = false;
            for (let i = 0; i < objects.length; i++) {
                if (overlaps(polygon, objects[i])) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
                objects.push(polygon);
            }
        }
        return new Scene(objects);
    }
}
