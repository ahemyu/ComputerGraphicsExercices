#include "cg.h"

using namespace glm;

CG::CG(int w, int h) : Window(w, h) {
    shaderManager.registerProgram("simple_color", SHADERTYPE_FLAG::VERTEX | SHADERTYPE_FLAG::FRAGMENT);
    shaderManager.update();
    
    sphereMesh.load("data/icosphere.obj");

    {
        // create ring mesh
        int segments = 100;
        float radius = 1;
        std::vector<int> indices;
        std::vector<VertexNT> vertices;
        for(int i = 0; i < segments; ++i) {
            VertexNT v;
            float angle = float(i) / segments * glm::two_pi<float>();
            v.position = vec4(radius * sin(angle), -cos(angle), 0, 1);
            vertices.push_back(v);
            indices.push_back(i);
        }
        indices.push_back(0);
        ringMesh.create(vertices.data(), vertices.size(), indices.data(), indices.size());
    }

    Camera::getCurrent()->lookAt(vec3(0, 0, 10), vec3(0), vec3(0, 1, 0));
}

void CG::update(float dt) {
    time += dt * timeScale;

    if(!ImGui::GetIO().WantCaptureMouse)
        Camera::getCurrent()->update(dt);

    // TODO 3.5		Use the following methods to create 4x4 transformation matrices:
    //				mat4 glm::translate(vec3 v);
    //				mat4 glm::scale(vec3 v);
    //				mat4 glm::rotate(float angle, vec3 axis);

    //     Tips and notes:
    // The earth revolves around the sun in a circle (It is actually an ellipsis, but we use an approximation here). The plane containing this circle is called ecliptic plane.
    // To keep it simple, we define the ecliptic plane as the x-y plane.
    // By default, the camera is looking in -z direction with x pointing to the right and y upwards.
    // The camera can be controlled with W,A,S,D and the left mouse button.
    // The sun is at the origin (0,0,0) of our coordinate system and all given parameters are relative to it.
    // The loaded models for the planet and the ring have a radius of 1. 

    // a) Sun
    //TODO: Compute the 4x4 transformation matrix of the sun. The following properties must be met:
    // The sun has a radius of 1.5. Use the parameter sunRadius.
    // The sun rotates counter-clockwise (when using the default camera) in 30 days around its own axis. Hint: Convert the time given in days to angular velocity in rad/day. Use the parameter sunRotationTime.
    // The sun is tilted in respect to the ecliptic plane by 7.25 degrees. Use the parameter sunObliquity.

    // TODO: calculate angular velocity with the given timescale and sunRotationTime
    // so it does a 360 degree( or 2 pi) rotation in sunRotationTime days. so if we just divide 365 (2 PI) by suinRotationTime we get the angle we need to rotate. 
    float rotation_angle_sun = glm::radians(time* (360/sunRotationTime)); //this is the angle by which we need to rotate counterclockwisea

    sun = glm::scale(vec3(sunRadius)) * glm::rotate(rotation_angle_sun, vec3(0,0,1))* glm::rotate(sunObliquity, vec3(1,0,0)); // we first tilt, then rotate then scale

    // b) Earth
    //TODO: Compute the 4x4 transformation matrix of the earth. The following properties must be met:
    // The earth has a radius of 0.5. Use the parameter earthRadius.
    // The earth revolves counter-clockwise around the sun in 365.256 days at a distance of 5. Use the parameters earthRevolutionTime and earthOrbitRadius.
    // The earth rotates counter-clockwise in 0.997 days around its own axis. Use the parameter earthRotationTime.
    // The earth is tilted in respect to the ecliptic plane by 23.4 degrees. Use the parameter earthObliquity.

    glm::mat4 scale = glm::scale(vec3(earthRadius));
    float revolution_angle_earth = glm::radians(time * (360 / earthRevolutionTime));
    
    glm::mat4 revolution = glm::translate(vec3(earthOrbitRadius * glm::cos(revolution_angle_earth), earthOrbitRadius * glm::sin(revolution_angle_earth) , 0)); //TODO: think abt the translation 
    float rotation_angle_earth_own_axis = glm::radians(time*(360/earthRotationTime));
    glm::mat4 rotation = glm::rotate(rotation_angle_earth_own_axis, vec3(0,0,1));
    glm::mat4 tilt = glm::rotate(earthObliquity, vec3(1,0,0));
    earth = revolution * scale * rotation * tilt;

    // c) Moon
    //TODO:      Compute the 4x4 transformation matrix of the moon. The following properties must be met:
    // The moon has a radius of 0.2. Use the parameter moonRadius.
    // The moon revolves counter-clockwise around the earth in 27.32 days at a distance of 1. Use the parameters moonRevolutionTime and moonOrbitRadius.
    // The moon rotates counter-clockwise in 27.32 days around its own axis. Use the parameter moonRotationTime. Sidenote: The moon rotates at the same speed as it revolves around the earth. That is why we always see the same side of the moon.
    // The moon orbit is inclined by 5.14 degrees relative to the ecliptic plane (see image above). Use the parameter moonOrbitalInclination.
    // The moon is tilted in respect to the ecliptic plane by 1.54 degrees (see image above). Use the parameter moonObliquity.

    
    glm::mat4 scale_moon = glm::scale(vec3(moonRadius));
    float revolution_angle_moon = glm::radians(time * (360 / moonRevolutionTime));
    
    glm::mat4 revolution_moon = glm::translate(vec3(earth[3][0] + (moonOrbitRadius * glm::cos(revolution_angle_moon)), earth[3][1] + (moonOrbitRadius * glm::sin(revolution_angle_moon)) , 0)); //TODO: need to add offset of earth here bc we want to revolute around earth and not sun  
    float rotation_angle_moon = glm::radians(time*(360/moonRotationTime));
    glm::mat4 rotation_moon = glm::rotate(rotation_angle_moon, vec3(0,0,1));
    glm::mat4 tilt_moon= glm::rotate(moonObliquity, vec3(1,0,0));
    moon = revolution_moon * scale_moon * rotation_moon * tilt_moon;

    // d) Orbit Rings
    earthOrbit = glm::scale(vec3(earthOrbitRadius));
    moonOrbit = glm::translate(vec3(earthOrbitRadius + moonOrbitRadius, 0, 0)); // <- Change this line
}

void CG::render() {
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);

    // enable wireframe mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    glUseProgram(shaderManager.getProgramGL("simple_color"));

    glm::mat4 m = Camera::getCurrent()->getProjectionMatrix() * Camera::getCurrent()->getViewMatrix();
    glUniformMatrix4fv(0, 1, GL_FALSE, &m[0][0]);

    // render sun
    glUniform4fv(2, 1, &vec4(1, 1, 0, 1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &sun[0][0]);
    sphereMesh.render();

    // render earth
    glUniform4fv(2, 1, &vec4(0, 0, 1, 1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &earth[0][0]);
    sphereMesh.render();
    glUniformMatrix4fv(1, 1, GL_FALSE, &earthOrbit[0][0]);
    ringMesh.render(GL_LINE_STRIP);

    // render moon
    glUniform4fv(2, 1, &vec4(0.6, 0.6, 0.6, 1)[0]);
    glUniformMatrix4fv(1, 1, GL_FALSE, &moon[0][0]);
    sphereMesh.render();
    glUniformMatrix4fv(1, 1, GL_FALSE, &moonOrbit[0][0]);
    ringMesh.render(GL_LINE_STRIP);

    // disable wireframe mode
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
}

void CG::renderGui() {
    ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiSetCond_Once);
    ImGui::SetNextWindowSize(ImVec2(500, 400), ImGuiSetCond_Once);
    ImGui::Begin("Solar System");
    ImGui::SliderFloat("Time Scale", &timeScale, 0, 10);
    ImGui::SliderFloat("sunRotationTime", &sunRotationTime, 1, 100);
    ImGui::SliderAngle("sunObliquity", &sunObliquity, -90, 90);
    ImGui::SliderFloat("sunRadius", &sunRadius, 0, 10);
    ImGui::SliderFloat("earthRotationTime", &earthRotationTime,0, 5);
    ImGui::SliderFloat("earthRevolutionTime", &earthRevolutionTime,0, 500);
    ImGui::SliderAngle("earthObliquity", &earthObliquity, -90, 90);
    ImGui::SliderFloat("earthRadius", &earthRadius, 0, 5);
    ImGui::SliderFloat("earthOrbitRadius", &earthOrbitRadius, 0, 20);
    ImGui::SliderFloat("moonRevolutionTime", &moonRevolutionTime, 0, 50);
    ImGui::SliderFloat("moonRotationTime", &moonRotationTime, 0, 50);
    ImGui::SliderAngle("moonOrbitalInclination", &moonOrbitalInclination, -90, 90);
    ImGui::SliderAngle("moonObliquity", &moonObliquity, -90, 90);
    ImGui::SliderFloat("moonRadius", &moonRadius, 0, 2);
    ImGui::SliderFloat("moonOrbitRadius", &moonOrbitRadius, 0, 6);
    ImGui::End();
}
