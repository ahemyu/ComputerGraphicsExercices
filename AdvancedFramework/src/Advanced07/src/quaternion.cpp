#include "quaternion.h"

using namespace glm;


Quaternion::Quaternion() {
    real = 1;
    img = vec3(0);
}

Quaternion::Quaternion(vec3 axis, float angle) {
    // TODO 7.3 a)
    // Initialize with classic axis angle rotation as defined in the lecture.
	// Change the following two lines!

    // the real part is cos of half of the angle
	real = cos(angle/2);
    // imaginary part is the axis multiplied by sin of half of the angle
	img = axis * sin(angle/2);
}

mat3 Quaternion::toMat3() {
    // Conversion Quaternion -> mat3
    // You won't have to implement it.. :)
    mat3 result;

    float qxx(img.x * img.x);
    float qyy(img.y * img.y);
    float qzz(img.z * img.z);
    float qxz(img.x * img.z);
    float qxy(img.x * img.y);
    float qyz(img.y * img.z);
    float qwx(real * img.x);
    float qwy(real * img.y);
    float qwz(real * img.z);

    result[0][0] = float(1) - float(2) * (qyy +  qzz);
    result[0][1] = float(2) * (qxy + qwz);
    result[0][2] = float(2) * (qxz - qwy);
    result[1][0] = float(2) * (qxy - qwz);
    result[1][1] = float(1) - float(2) * (qxx +  qzz);
    result[1][2] = float(2) * (qyz + qwx);
    result[2][0] = float(2) * (qxz + qwy);
    result[2][1] = float(2) * (qyz - qwx);
    result[2][2] = float(1) - float(2) * (qxx +  qyy);

    return result;
}

mat4 Quaternion::toMat4() {
    return mat4(toMat3());
}

float Quaternion::norm() const {
    // TODO 7.3 b)
    // Compute the L2 norm of this vector.

    // the l2 norm is sqrt(elementwise mult(q))
    return sqrt((real * real) + (img.x * img.x) + (img.y * img.y) + (img.z * img.z));
}

Quaternion Quaternion::normalize() {
    // TODO 7.3 b)
    // Normalize this quaternion.
    // we need to divide each component of the quat by it's norm

    float norm = this->norm();

    real = real / norm;
    img.x = img.x / norm;
    img.y = img.y / norm;
    img.z = img.z / norm;
    return *this;
}

Quaternion Quaternion::conjugate() const {
    // TODO 7.3 b)
	// Return the conjugate of this quaternion.

    // conjugate is  just the imaginary coeff with sign flipped
    Quaternion result;
    result.real = real;
    result.img.x = -1 * img.x;
    result.img.y = -1 * img.y;
    result.img.z = -1 * img.z;

    return result.normalize();
}

Quaternion Quaternion::inverse() const {
    // TODO 7.3 b)
	// Return the inverse of this quaternion.

    //inverse is the conjugate divided by the norm^2
    Quaternion result;
    float norm = this->norm();

    Quaternion conj = conjugate();
    result.real = real / (norm * norm);
    result.img.x = conj.img.x / (norm * norm); 
    result.img.y = conj.img.y / (norm * norm); 
    result.img.z = conj.img.z / (norm * norm); 

    return result.normalize();
}

float dot(Quaternion x, Quaternion y) {
    // TODO 7.3 b)
	// Compute the dot product of x and y.

    // easy, just multiply real parts first and then add the dot product of the img parts

    return x.real * y.real + ((x.img.x * y.img.x) + (x.img.y * y.img.y) + (x.img.z * y.img.z));
}

Quaternion operator*(Quaternion l, Quaternion r) {
    // TODO 7.3 c)
    // Perform quaternion-quaternion multiplication as defined in the lecture.
	// Hint: You can use the glm function for vector products.

    // if l = (a,b), r = (c, d), result shall be: (a*c - b * d, a*d + b*c + b x d)


    Quaternion result;
    result.real = (l.real * r.real) - (l.img.x * r.img.x + l.img.y * r.img.y + l.img.z * r.img.z);

    vec3 first = l.real * r.img;
    vec3 second  = r.real * l.img;
    vec3 third = cross(l.img, r.img);

    result.img = first + second + third;

    return result.normalize();
}

vec3 operator*(Quaternion l, vec3 r) {
    // TODO 7.3 c)
    // Rotate the vector 'r' with the quaternion 'l'.

    //first transform v into a quat
    Quaternion q_r;
    q_r.real = 0;
    q_r.img.x = r.x;
    q_r.img.y = r.y;
    q_r.img.z = r.z;

    // now get the rotation  by q * q_r * q^-1

    // we have to call the operator* for quats twice
    Quaternion temp = operator*(l, q_r);
    Quaternion res = operator*(temp, l.inverse());

    //the imaginary part of the result is the rotated vector

    return res.img; 
}

Quaternion operator*(Quaternion l, float r) {
    // TODO 7.3 c)
    // Perform quaternion-scalar multiplication.
    Quaternion result;

    result.real = l.real * r;
    result.img = r * l.img;

    return result;
}

Quaternion operator+(Quaternion l, Quaternion r) {
    // TODO 7.3 c)
	// Return the sum of the two quaternions.
    Quaternion result;

    result.real = l.real + r.real;
    result.img = l.img + r.img;
    return result;
}

Quaternion slerp(Quaternion x, Quaternion y, float t) {
	float epsilon = 0.00001f;

    // TODO 7.3 d)
    // Spherical linear interpolation (slerp) of quaternions.

    // Compute the interpolated quaternion and return it normalized.

    //do the division by zero check
    float dot_x_y = dot(x,y);
    if(dot_x_y > 1 - epsilon){
        //treat quaternions as 4d vectors and do linear interpolation
        return operator+(operator*(x, (1-t)), operator*(y, t)).normalize();   
    }
	
    //first we need to get the angle between the quats with: omega = acos(dot(x,y)/ norm(x)*norm(y))
    float angle = acos(dot_x_y/(x.norm()*y.norm()));

    // now the formula is q(t) = (sin((1-t) * omega)/ sin(omega)) * x + y * (sin(t * omega)/sin(omega))
    Quaternion result = operator+(operator*(x, (sin((1-t) * angle)/ sin(angle))), operator*(y, (sin(t * angle)/sin(angle))));
    return result.normalize();
}

std::ostream& operator<<(std::ostream &str, Quaternion r) {
    str << "( " << r.real << "," << r.img.x << "," << r.img.y << "," << r.img.z << " )";
    return str;
}
