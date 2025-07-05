varying vec2 vUv;
varying vec3 vNormal;

void main()
{
    vec2 uv = vUv;
    vec3 normal = vNormal;

    gl_FragColor = vec4(normal, 1.0);
}