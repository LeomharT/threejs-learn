precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 uSunDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    vec3 viewDirection = normalize(vPosition - cameraPosition);

    float sunOrientation = dot(uSunDirection, normal);

    color = vec3(sunOrientation);

   
    gl_FragColor = vec4(color, 1.0);
}
