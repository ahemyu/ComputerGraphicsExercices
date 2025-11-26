#pragma once

#include "framework/window.h"
#include "framework/camera.h"
#include "framework/mesh.h"
#include "framework/texture.h"


class CG : public Window {
public:
    CG(int w, int h);

    virtual void update(float dt);
    virtual void render();
    virtual void renderGui();

private:
    float time = 0;
    float timeScale = 1;
    bool wireFrame = false;
    Mesh sphereMesh, planeMesh;

    Texture earthColor, earthBump, earthClouds, earthNight, earthNormal, earthSpec, universe;
    glm::mat4 sun, earth, clouds;

    int Tesselation = 1;
    float heightScale = 0.025f;
    float cameraSpeed = 0.02f;
    float cloudHeight = 0.02f;

    bool useColor = false;
    bool useClouds = false;
    bool translateVertices = false;
    int normalMethod = 0;
};
