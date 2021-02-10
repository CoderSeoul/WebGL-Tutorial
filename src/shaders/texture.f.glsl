  precision mediump float;
  
uniform sampler2D texture;
uniform sampler2D otherTexture;
uniform vec2 resolution;

vec2 inverse(vec4 color){
  return abs(vec(color.rgb -1.0, color.a));
} 

vec4 blackAbdWhite(vec4 color){
  return vec4(vec3(1.0,1.0,1.0)*(color.r+color.g+color.b)/3.0, color.a);
}

vec4 sepia(vec4 color){
  vec3 sepiaColor = vec3(112,66,20) / 255.0;
}

varying vec2 vTexCoord;
varying float vTexIndex;

void main() {
      vec2 texCoord = vTexCoord;
      if(vTexIndex == 0.0){
        gl_FragColor = texture2D(texture, texCoord);
      }else{
        gl_FragColor = texture2D(otherTexture, texCoord);
      }

  }