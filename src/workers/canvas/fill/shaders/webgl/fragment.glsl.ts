export default `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_point;
uniform vec4 u_fillColor;

bool isSameColor(vec4 color1, vec4 color2) {
  return all(equal(color1, color2));
}

vec4 getColor(vec2 coord){
    return texture2D(u_texture, coord / u_resolution);
}

void main(){
    vec2 texCoord = gl_FragCoord.xy / u_resolution;
    vec4 currentColor = texture2D(u_texture, texCoord);
    vec4 targetColor = texture2D(u_texture, u_point / u_resolution);

    if(isSameColor(currentColor, targetColor)){
        vec4 leftColor = getColor(texCoord + vec2(-1.0, 0.0));
        vec4 rightColor = getColor(texCoord + vec2(1.0, 0.0));
        vec4 topColor = getColor(texCoord + vec2(0.0, -1.0));
        vec4 bottomColor = getColor(texCoord + vec2(0.0, 1.0));

        if(isSameColor(leftColor, targetColor) || 
            isSameColor(rightColor, targetColor) || 
            isSameColor(topColor, targetColor) ||
            isSameColor(bottomColor, targetColor))
        {
            gl_FragColor = u_fillColor;
        } else {
            gl_FragColor = currentColor;
        }
    } else {
        gl_FragColor = currentColor;
    }
}
`;
