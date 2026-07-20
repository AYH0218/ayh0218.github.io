// ヒーロー背景の流体シェーダー。依存ライブラリなしの生WebGL。
// マウント失敗時は false を返し、呼び出し側でCSSグラデーションにフォールバックする。

const VERT = /* glsl */ `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot(0.5) * p * 2.0 + 100.0;
    a *= 0.5;
  }
  return v;
}

// 疎な格子に1つずつ星を置き、明滅させる(銀河の星屑レイヤー)
float starLayer(vec2 uv, float density, float speed, float seed) {
  vec2 g = uv * density;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;

  float h = hash(id + seed);
  float present = step(0.9, h);
  vec2 jitter = (vec2(hash(id + seed + 12.3), hash(id + seed + 45.6)) - 0.5) * 0.8;
  float d = length(f - jitter);
  float size = mix(0.02, 0.08, hash(id + seed + 78.9));
  float core = smoothstep(size, 0.0, d);

  float phase = h * 62.83185;
  float twinkle = 0.3 + 0.7 * (0.5 + 0.5 * sin(u_time * speed + phase));
  return present * core * twinkle;
}

// 十字にきらめく大粒のスパークル(ヒーローのアクセント)
float sparkleGlint(vec2 d, float size) {
  float r2 = dot(d, d);
  float core = exp(-r2 / (size * size * 0.12));
  float beamX = exp(-(d.y * d.y) / (size * size * 0.01)) * exp(-abs(d.x) / size);
  float beamY = exp(-(d.x * d.x) / (size * size * 0.01)) * exp(-abs(d.y) / size);
  return core + 0.55 * (beamX + beamY);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float t = u_time * 0.055;

  vec2 p = uv * 1.35;
  p += 0.3 * (u_pointer - 0.5);

  // iq流のドメインワーピングで流体らしい模様を作る
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 2.2 * q + vec2(1.7, 9.2) + 0.35 * t),
    fbm(p + 2.2 * q + vec2(8.3, 2.8) - 0.25 * t)
  );
  float f = fbm(p + 2.0 * r);

  // Catppuccin Mocha: base / blue / mauve / sky
  vec3 base = vec3(0.118, 0.118, 0.180);
  vec3 deepBlue = vec3(0.28, 0.38, 0.62);
  vec3 mauve = vec3(0.796, 0.651, 0.969);
  vec3 sky = vec3(0.537, 0.863, 0.922);

  vec3 col = base;
  col = mix(col, deepBlue, smoothstep(0.35, 0.95, f));
  col = mix(col, mauve, 0.65 * smoothstep(0.55, 1.05, length(q)));
  col = mix(col, sky, 0.7 * pow(smoothstep(0.52, 1.1, f * length(r) * 2.0), 2.0));

  float vig = smoothstep(1.45, 0.3, length(uv));
  col *= mix(0.72, 1.0, vig);

  // 銀河の星屑: 雲より奥にあるように、視差を弱めに追従させる
  vec2 starUv = uv + 0.06 * (u_pointer - 0.5);
  float stars = 0.0;
  stars += starLayer(starUv, 9.0, 1.6, 3.1) * 0.85;
  stars += starLayer(starUv + 3.7, 14.0, 2.3, 19.4) * 0.6;
  stars += starLayer(starUv * 1.3 + 8.2, 22.0, 3.1, 51.0) * 0.4;
  vec3 starColor = vec3(0.804, 0.839, 0.957);
  col += stars * starColor;

  // 数個の大粒スパークル(緩やかに明滅するアクセント)
  vec3 glintColor = vec3(0.976, 0.886, 0.686);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 gp = (vec2(hash(vec2(fi, 1.0)), hash(vec2(fi, 2.0))) * 2.0 - 1.0) * 0.85;
    gp += 0.05 * (u_pointer - 0.5);
    float envPhase = hash(vec2(fi, 3.0)) * 6.2832;
    float env = pow(max(0.0, sin(u_time * 0.35 + envPhase)), 3.0);
    float size = mix(0.045, 0.075, hash(vec2(fi, 4.0)));
    col += sparkleGlint(starUv - gp, size) * env * glintColor;
  }

  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function mountFluidHero(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return false;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return false;

  const program = gl.createProgram();
  if (!program) return false;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return false;
  }
  gl.useProgram(program);

  // 画面全体を覆う1枚の三角形
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uPointer = gl.getUniformLocation(program, "u_pointer");

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener("resize", resize);

  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = e.clientX / window.innerWidth;
    pointer.ty = 1 - e.clientY / window.innerHeight;
  });

  let elapsed = Math.random() * 100;
  let last = performance.now();
  let rafId = 0;
  let visible = true;

  const frame = (now: number) => {
    elapsed += Math.min(now - last, 100) / 1000;
    last = now;
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(frame);
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uPointer, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }

  const start = () => {
    if (rafId) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      visible && !document.hidden ? start() : stop();
    },
    { threshold: 0 }
  ).observe(canvas);

  document.addEventListener("visibilitychange", () => {
    !document.hidden && visible ? start() : stop();
  });

  start();
  return true;
}
