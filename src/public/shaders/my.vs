attribute float color_r;
attribute float color_g;
attribute float color_b;
uniform float vAlpha;
varying vec4 vColor;

void main() {
    vColor.r = color_r;
    vColor.g = color_g;
    vColor.b = color_b;
    vColor.a = vAlpha;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}