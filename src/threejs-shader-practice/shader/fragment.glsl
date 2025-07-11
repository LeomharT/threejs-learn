precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 uSunDirection;

uniform float uDayMixEdge0;
uniform float uDayMixEdge1;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    vec3 viewDirection = normalize(vPosition - cameraPosition);

    float sunOrientation = dot(uSunDirection, normal);

    float dayMix = smoothstep(uDayMixEdge0, uDayMixEdge1, sunOrientation);

    color = vec3(dayMix);

    vec3 reflection = reflect(-uSunDirection, normal);
    
    float specular = -dot(reflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, 20.0);

    color += vec3(1.0, 0.0, 0.0) * specular;

    gl_FragColor = vec4(color, 1.0);
}
