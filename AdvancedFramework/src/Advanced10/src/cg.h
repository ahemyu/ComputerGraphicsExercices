#pragma once

#include "framework/window.h"
#include "framework/camera.h"
#include "framework/mesh.h"

using namespace glm;
#include "../shaders/rt.h"

class CG : public Window {
public:
    CG(int w, int h);

    virtual void update(float dt);
    virtual void render();
    virtual void renderGui();

private:
    float time = 0;
    float timeScale = 1;
    bool raytrace = true;
    Mesh  planeMesh, sphereMesh;

    int debug = 0;
    glm::vec3 lightDir = glm::normalize(glm::vec3(0.39, -0.92, -0.03));
    int maxDepth = 10;
    float sunIntensity = 1;
    float shadow = 0.2f;
    bool schlick = false;
    bool reflection = true;
    bool refraction = true;
    float airRefractionIndex = 1;
    glm::mat4 boxTrans;

    std::vector<glm::vec4> spheres;
    std::vector<Material> materials;

    virtual void processEvent(const SDL_Event& event);
};
