vec2 cartesianToSpherical(vec3 n)
{
    // TODO 6.4 a)
    // Convert cartesian coordinates to spherical coordinates. 
    // For computing the inverse tangent, use the two-argument
    // version of atan().
    // theta = 1/tan(z/x)
    // phi = 1/cos(y)
    float x = n[0];
    float y = n[1];
    float z = n[2];
    float theta = atan(z, x);
    float phi = acos(y);

    return vec2(theta,phi);
}

vec3 sphericalToCartesian(vec2 a)
{
    float theta = a.x;
    float phi = a.y;

    // TODO 6.4 a)
    // Convert spherical coordinates to cartesian coordinates.
    // x = sin(phi) * cos(theta)
    // y  = cos(phi)
    // z = sin(phi) * sin(theta)

    float x = sin(phi) * cos(theta);
    float y = cos(phi);
    float z = sin(phi) * sin(theta);

    return vec3(x,y,z);
}


vec2 sphericalToTexture(vec2 a)
{
    const float PI = 3.14159265;
    float theta = a.x; //in range [-PI,PI]
    float phi = a.y; // in range [0,PI]

    // TODO 6.4 a)
    // Compute texture coordinates from spherical coordinates.
	// Do not forget to mirror both coordinates to have the north pole at the top 
	// and France located west of Germany! ;)
  // ok  so u correspoinds to theta and v to phi 
  // problem is that theta is in [-pi, pi] but u needs to be in [0, 1]
  // same for phi, it is in [0, pi] but v needs to be in [0, 1]
 
    float u = 1 - ((theta + PI) / (2*PI)); //we do 1 - to mirror it
    float v = 1 - (phi / PI); //same here
    return vec2(u,v);
}

