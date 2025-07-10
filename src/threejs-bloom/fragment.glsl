uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    gl_FragColor = vec4(
        texture2D(baseTexture, uv) + 
        vec4(1.0) * texture2D(bloomTexture, uv));
}