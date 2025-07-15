uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

uniform vec3 uSunDirection;

uniform sampler2D uEarthDayMapTexture;
uniform sampler2D uEarthNightMapTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 color = vec3(0.0);

    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec4 dayMapColor = texture2D(uEarthDayMapTexture, uv);
    vec4 nightMapColor = texture2D(uEarthNightMapTexture, uv);

    float sunOrientation = dot(uSunDirection, normal);
    
    // Daymix
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);

    color = mix(
        nightMapColor,
        dayMapColor,
        dayMix
    ).rgb;

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = max(0.0, fresnel);
    fresnel = pow(fresnel, 2.0);
   

 
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}