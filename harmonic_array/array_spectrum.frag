// Harmonic Array Spectrum Fragment
precision mediump float;
uniform float u_time;
uniform vec3 u_amps;
varying vec2 v_uv;

void main() {
  float band = floor(v_uv.x * 7.0) / 7.0;
  float wave = sin(band * 20.0 + u_time * 2.0) * u_amps.x
             + sin(band * 30.0 - u_time * 1.5) * u_amps.y
             + sin(band * 40.0 + u_time) * u_amps.z;
  vec3 col = vec3(0.3 + 0.5 * abs(wave), 0.4 + 0.3 * band, 0.6);
  gl_FragColor = vec4(col, 0.75);
}
