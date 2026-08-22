// Paradox Loom Knots Fragment
precision mediump float;
uniform float u_time;
uniform float u_tension;
varying vec2 v_uv;

void main() {
  float k = sin(v_uv.x * 14.0 + u_time) * cos(v_uv.y * 11.0 - u_time * 0.7);
  float t = u_tension * 0.6 + 0.2 * abs(k);
  vec3 col = vec3(0.5 + 0.4 * t, 0.3 + 0.3 * k, 0.6 - 0.2 * t);
  gl_FragColor = vec4(col, 0.7 + 0.2 * abs(k));
}
