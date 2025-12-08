#include "fps_camera.h"

using namespace glm;


FPSCamera::FPSCamera() {
    currentTransformation.orientation = Quaternion();
    projectionMatrix = glm::perspective(glm::radians(70.0f), 16.0f / 9.0f, 0.1f, 100.0f);
    currentTransformation.position = glm::vec3(0.0f, 2.0f, 8.0f);
    startY = currentTransformation.position.y;
}

void FPSCamera::translate(float dx, float dz, float dt) {

    // TODO 7.4 a)
    // Compute the correct velocity vector and integrate the position with it.
    // The parameters dx and dz give the motion along the local x and z axis.
    // Make sure that the final velocity is parallel to the x-z plane.
	// Take cameraSpeed into account.

    if(dx == 0 && dz == 0){
        return;
    }

    // this vector is in camera space, we need to transform it to world space
    vec3 v = vec3(dx, 0, dz);
    vec3 v_world = currentTransformation.orientation * v; //apparently one can just write "*" and the compiler gets it? 

    //to prevent flying, set y component to 0
    v_world[1] = 0;

    //normalize bc we are flattening the y component 
    v_world = normalize(v_world);

    //multiply by camera speed to get velocity
    vec3 velocity = v_world * cameraSpeed;

    //finally update the position
    currentTransformation.position += velocity * dt;
}

void FPSCamera::turn(vec2 relMouseMovement) {
	float dx = sensitivity * relMouseMovement.x;
	float dy = sensitivity * relMouseMovement.y;

    // TODO 7.4 b)
    // Implement the camera turning with the mouse.jjk
    // - Create the quaternions representing the x and y axis rotation.
    // - The local x axis of the camera must always be parallel to the ground!
    // - Forbid upside-down turning: (newOrientation * vec3(0,1,0)).y should be > 0.
	//	 Otherwise, only use the rotation around the y axis.

    // compute newOrientation from currentTransformation.orientation
    Quaternion newOrientation;

    // When you are done, set current transformation and last transformation so that we do not interpolate mouse motion
    // (Don't change these two lines!).
    currentTransformation.orientation = newOrientation;
    lastTransformation.orientation = currentTransformation.orientation;
}

void FPSCamera::updatePosition(float dt) {
    Object::update();
    const Uint8 *keyBoardState = SDL_GetKeyboardState(NULL);

    // TODO 7.4 a)
    // Read the keyboard state and call the translate function with the correct parameters.
    // Keys - Action
    // W - Forward
    // S - Backward
    // A - Left
    // D - Right
    bool wPressed = keyBoardState[SDL_SCANCODE_W]; //forward
    bool sPressed = keyBoardState[SDL_SCANCODE_S]; //backward 
    bool aPressed = keyBoardState[SDL_SCANCODE_A]; // left
    bool dPressed = keyBoardState[SDL_SCANCODE_D]; // exa of how to get the keystate

    float dx = 0.0;
    float dz = 0.0;

    if(wPressed){
        dz -=1;
    }
    if(sPressed){

        dz+=1;
    }
    if(aPressed){

        dx -= 1;
    }
    if(dPressed){

        dx += 1;
    }
    translate(dx, dz, dt);

    // TODO 7.4 c)
    // Implement a simple jumping behaviour when pressing "space" (= SDL_SCANCODE_SPACE).
    // - Use the member variables "vy" and "startY".
    // - vy is the vertical current velocity.
    // - startY is the height of the camera when it is on the ground.
	// - Change y according to vy.
	// - Change vy according to the earth acceleration.
    // - y should not drop below startY.
    float& y = currentTransformation.position.y;
}

void FPSCamera::updateOrientation(bool capture) {
    int mouseX, mouseY;
    Uint32 buttons = SDL_GetMouseState(&mouseX, &mouseY);

    glm::vec2 newMousePos = glm::vec2(mouseX,mouseY);
    glm::vec2 relMovement = prevMousePosition - newMousePos;

    if (capture || SDL_BUTTON(SDL_BUTTON_LEFT) & buttons) {
        turn(relMovement);
    }
    prevMousePosition = newMousePos;
}
