precision mediump float;

// TODO 3.3)	Define a constant variable (uniform) to 
//              "send" the canvas size to all fragments.
uniform vec2 canvasSize;
void main(void)
{ 
	float smoothMargin = 0.01;  
	float r = 0.8;         
	 
	// TODO 3.3)	Map the fragment's coordinate (gl_FragCoord.xy) into 
	//				the range of [-1,1]. Discard all fragments outside the circle 
	//				with the radius r. Smooth the circle's edge within 
	//				[r-smoothMargin, r] by computing an appropriate alpha value.

	//mapping to [-1,1] by first mappig to [0,1], then multiplying by 2 and then subtracting 1`
	//map to [0,1] and then multiply by two and subtract 1
	vec2 uv = (gl_FragCoord.xy / canvasSize) * 2.0 - 1.0; //comvention seems to be to call 2d normalized coordinates uv

	//so now check if current coordinate is inside radius from the center
	float dist = length(uv);
	if (dist > r){
		// throw away
		discard;
	}else{
		//TODO: Interpolate the opacity (gl_FragColor.a) for all fragments inside [r - smoothMargin, r]. You can use the GLSL function clamp().
		// so alpha need to be 1 at distance r-smoothMargin and 0 at distance r (and ofc 1 anywhere else)
		// first define the range: 
		if (dist <= r && dist >= r - smoothMargin){
			float rDistance = r - dist; // between 0 and smoothMargin
			// map that distance to [0,1] to get alpha
			float alpha = rDistance / smoothMargin;
			gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, alpha);
		}else {
		//color orange with opacity one
		gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, 1.0);

		}

	}

}