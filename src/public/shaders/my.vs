attribute float color_r;
attribute float color_g;
attribute float color_b;
varying vec4 vColor;

void main() {
    vColor.r = color_r;
    vColor.g = color_g;
    vColor.b = color_b;
    vColor.a = 1.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}