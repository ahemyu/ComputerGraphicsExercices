// from rt.h
// struct IntersectionResult {
//     bool isIntersection;
//     float tHit; //distance to ray origin
//     vec3 normal;
//     vec3 hitPosition;
//     float epsilon; //some objects have different epsilons
// };

IntersectionResult intersectRayPlane(Ray ray, vec4 planeData) {
    vec3 n = planeData.xyz;
    float k = planeData.w;

    vec3 direction = normalize(ray.direction);
    vec3 origin = ray.origin;

    // 9.2 b)
    // Ray-Plane Intersection
	// Have a look at the definition of struct "IntersectionResult" in rt.h.
	// You can use "EPSILON" defined in rt.glsl.

    // after some math we get that t = (k - (o · n))/d · n
    float dDotN = dot(direction, n);
    // important: if d · n = 0, the ray is parallel and we return noIntersection
    if (dDotN == 0){
        return noIntersection;
    }
    float originDotN = dot(origin, n);
    float tHit = (k - originDotN)/dDotN;
    // if the intersection is right at ot behind eye, we do not care abt it
    if(tHit <= 0){
        return noIntersection;
    }

    vec3 hitPosition = tHit * direction + origin;

    IntersectionResult result;
    result.isIntersection = true;
    result.tHit = tHit;
    result.normal = n;
    result.hitPosition = hitPosition;
    result.epsilon = EPSILON;

    return result;
}



IntersectionResult intersectRaySphere(Ray ray, vec4 sphereData) {
    vec3 c = sphereData.xyz;
    float r = sphereData.w;
    vec3 d = normalize(ray.direction);
    vec3 o = ray.origin;

    float t;

    // so we need to solve for t in: |dt + o-c|^2 = r^2
    // after some trafos we get: t = -dot(d, m) +- sqrt(dot(d, m)^2 - |m|^2 + r^2) where m = o - c
    vec3 m = o - c;
    float dDotM = dot(d, m);
    float discriminant = dDotM * dDotM - dot(m, m) + r * r;

    if (discriminant < 0.0) {
        // no real solution - ray misses sphere
        return noIntersection;
    }

    float t1 = -dDotM - sqrt(discriminant);
    float t2 = -dDotM + sqrt(discriminant);

    // pick the smaller positive t
    if (t1 > 0.0) {
        t = t1;
    } else if (t2 > 0.0) {
        t = t2;
    } else {
        // both intersections are behind the camera
        return noIntersection;
    }

    // calculate intersection point with found t
    vec3 p = d * t + o;

    vec3 n = normalize(p - c); // normal is vec from center to hitpoint

    // TODO 9.2 c)
    // Ray-Sphere Intersection
	// You can use "noIntersection" defined in rt.glsl.
	// Note that t has to be positive for the sphere to be in front of the camera:
	// Make sure that you cannot see objects behind the camera.
    IntersectionResult result;
    result.isIntersection = true;
    result.tHit = t;
    result.normal = n; 
    result.hitPosition = p;
    result.epsilon = EPSILON;

    return result;
}
