
--vertex
layout(location = 0) in vec3 in_position;


out vec3 position;

void main() {
        position = vec3(in_position.x,in_position.z,1);
        gl_Position =  vec4(position, 1);
        gl_Position.z = 0.999999; //draw quad behind everything (almost) on the far plane
}

--fragment

#include "helper.glsl"

layout (location = 0) uniform mat4 projView;
layout (location = 1) uniform vec3 cameraPos;

layout (location = 10) uniform sampler2D color;

layout (location = 0) out vec4 out_color;

in vec3 position;

void main() {
    //TODO 6.4 b)

    // 1. compute world position of current fragment.
    //    use the matrix 'projView' to do so.
    
    // the position coming from the vertex shader is in clip space (screen space)
    // we need to transform it back to world space
    // projView = projection * view, so to go backwards we need the inverse
    mat4 invProjView = inverse(projView);
    
    // position is in clip space, so we convert it to a vec4 with w=1
    vec4 clipSpacePos = vec4(position.xy, position.z, 1.0);
    
    // transform from clip space to world space
    vec4 wp = invProjView * clipSpacePos;
    
    // perspective divide to get actual 3D position
    wp = wp / wp.w;

    // 2. compute view direction.
    //    use the variable 'cameraPos' to do so.
    
    // direction from camera to the fragment (normalized)
    // this tells us which direction we're looking
    vec3 direction = normalize(vec3(wp) - cameraPos);

    // 3. convert view direction to texture coordinates and read from the 'color' texture.
    
    // first convert the direction (cartesian) to spherical coordinates
    vec2 sphericalCoords = cartesianToSpherical(direction);
    
    // then convert spherical to texture coordinates [0,1]
    vec2 tc = sphericalToTexture(sphericalCoords);
    
    // finally sample the universe texture at those coordinates
    out_color = texture(color, tc);
}
