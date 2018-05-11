attribute float displacement;
attribute float theta;
attribute float phi;
varying vec4 vColor;

void main() {
    vColor.r = displacement;
    vColor.g = theta;
    vColor.b = phi;
    vColor.a = 1.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}