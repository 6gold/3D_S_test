attribute float random_r;
attribute float random_g;
attribute float random_b;
varying vec4 vColor;

void main() {
    vColor.r = random_r;
    vColor.g = random_g;
    vColor.b = random_b;
    vColor.a = 1.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}