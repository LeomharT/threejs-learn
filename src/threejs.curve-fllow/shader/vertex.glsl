varying vec2 vUv;
varying vec3 vNormal;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Varying
    vUv = uv;
    vNormal = normal;
}