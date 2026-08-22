// Atlas Visualizer Fragment
precision mediump float;
uniform float u_time;
uniform vec4 u_layers; // glyph loom array orchard
varying vec2 v_uv;

void main() {
  float pulse = 0.5 + 0.5 * sin(u_time * 1.4);
  vec3 col = vec3(
    u_layers.x * (0.5 + 0.4 * sin(v_uv.x * 9.0 + u_time)),
    u_layers.y * (0.5 + 0.4 * cos(v_uv.y * 7.0 - u_time)),
    u_layers.z * (0.4 + 0.4 * pulse) + u_layers.w * 0.2
  );
  gl_FragColor = vec4(col, 0.72);
}
