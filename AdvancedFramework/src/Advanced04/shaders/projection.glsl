vec3 projectVertexToPlane(vec3 vertex, vec3 direction, vec3 pointOnPlane, vec3 planeNormal) {
    // TODO 4.4 a)
    // Project 'vertex' on the plane defined by 'pointOnPlane' and 'planeNormal'.
    // The projection direction is given by 'direction'.

    // ray equation is vertex + t * direction
    // so we need to find t 
    // for any point p on the plane: dot((p - pointOnPlane), planeNormal) = 0
    // so we need to solve the equation by t: dot(vertex + t * direction) - pointOnPlane, planeNormal) = 0 
    // we have these dot prodcut rules: dot(A + B, C) = dot(A, C) + dot(B, C)
    // dot(t* A, B) = t * dot(A, B)

    float t = -dot(vertex - pointOnPlane, planeNormal) / dot(direction, planeNormal);
    vec3 projectedPoint = vertex + t * direction;

    return projectedPoint;
}
