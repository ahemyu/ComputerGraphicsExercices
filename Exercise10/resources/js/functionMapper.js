import { parseVec } from "./num.js";

/** 
 *  This is used only in `dispatcher.js`, refer to that file for usage information
 */ 

const functionMapper = {
  Basic1: async args => {
    let canvas = args[0];
    let pUseTree = args[1] == "true";
    let pNumPolygons = parseInt(args[2]);
    let pRaySource = args.length > 3 ? parseVec(args[3]) : new Vec(0, 150);
    let pRayTarget = args.length > 4 ? parseVec(args[4]) : new Vec(200, 200);
    let pDrawRay = pRaySource.x >= 0 && pRaySource.y >= 0; // make pRaySource negative to hide ray
    let pShowAABB = args.length > 5 ? args[5] == "true" : true;
    let pPolygonSize = args.length > 6 ? parseInt(args[6]) : 40;
    let pShowIntersections = args.length > 7 ? args[7] == "true" : false;
    let hash = 0;
    for (let i = 0; i < canvas.id.length; i++) {
        let char = canvas.id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    //console.log(canvas.id, hash);
    let pSeed = args.length > 8 ? parseInt(args[8]) : hash;

    return [canvas, pRaySource, pRayTarget, pDrawRay, pNumPolygons, pPolygonSize, pShowAABB, pUseTree, pShowIntersections, pSeed];
  },

  // compare.js
  errorMap: async args => {
    let diff_map_canvas = args[0]
    let submission_canvas_id = args[1]
    let solution_img_id = args[2]
    let points = (args.length > 3) ? parseFloat(args[3]) : 1.0
    let error_pixel_threshold_perc = (args.length > 4) ? parseFloat(args[4]) : 0.05
    let shader_canvas = (args.length > 5) ? args[5] == "true" : false
    let metric = (args.length > 6) && (args[6] == 'l1' || args[6] == 'l2') ? args[6] : 'l1'

    let task_nr = diff_map_canvas.getAttribute("task-nr")
    let subtask_nr = diff_map_canvas.getAttribute("subtask-nr")

    const img_canvas = document.getElementById(solution_img_id);
    // load solution from file (binary for precision)
    const new_canvas_id = solution_img_id + "_gen"
    const canvas = document.createElement('canvas');
    canvas.id = new_canvas_id;
    canvas.style.display = 'none';
    canvas.width = img_canvas.width;
    canvas.height = img_canvas.heigth;
    document.body.appendChild(canvas);
    
    // fill solution canvas
    const src = img_canvas.getAttribute("src")
    await loadCanvasFromBinary(src, new_canvas_id);
    const img_ctx = img_canvas.getContext('2d')
    img_ctx.drawImage(canvas, 0, 0)

    return [diff_map_canvas, submission_canvas_id, solution_img_id, points, error_pixel_threshold_perc, shader_canvas, metric]
  }
}

async function loadCanvasFromBinary(path, canvas_id) {
  try {
    const response = await fetch(path);
    const buffer = await response.arrayBuffer();

    // Read the first 8 bytes as width and height
    const headerView = new DataView(buffer, 0, 8);
    const width = headerView.getUint32(0, true);
    const height = headerView.getUint32(4, true);

    // The rest is pixel data
    const pixelData = new Uint8ClampedArray(buffer, 8);

    const imgData = new ImageData(pixelData, width, height);

    const canvas = document.getElementById(canvas_id);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error("Failed to load binary canvas data:", err);
  }
}

export function mapFunction(key) {
    return functionMapper[key];
}
