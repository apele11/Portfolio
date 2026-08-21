import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Shader uniform variables for the hero background animation
 * @interface ShaderUniforms
 * @property {Object} uTime - Elapsed time in seconds
 * @property {Object} uFlowTime - Flow animation time
 * @property {Object} uRes - Canvas resolution
 * @property {Object} uMouse - Normalized mouse position
 * @property {Object} uColor1 - Primary color
 * @property {Object} uColor2 - Secondary color
 * @property {Object} uColor3 - Tertiary color
 * @property {Object} uColor4 - Quaternary color
 */
interface ShaderUniforms {
  uTime: { value: number };
  uFlowTime: { value: number };
  uRes: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
  uColorOffset?: { value: THREE.Vector2 };
}

/**
 * HeroBackground component renders an animated WebGL shader background
 * 
 * This component creates an interactive animated background using Three.js and custom shaders.
 * The animation responds to mouse movement and respects prefers-reduced-motion preferences.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.Ref<ShaderUniforms | null>} [props.uniformsRef] - Optional reference to access shader uniforms
 * @returns {React.ReactElement} Canvas element with fixed positioning for full viewport coverage
 * 
 * @example
 * const uniformsRef = useRef<ShaderUniforms | null>(null);
 * return <HeroBackground uniformsRef={uniformsRef} />;
 */
/** The shader's own default stops, reused by the no-WebGL gradient fallback. */
const FALLBACK_COLORS = ["#260b54", "#095f75", "#2b716b", "#a9a2d7"] as const;

export interface HeroBackgroundProps {
  uniformsRef?: React.Ref<ShaderUniforms | null>;
  fixed?: boolean;
  className?: string;
  colors?: [string, string, string, string];
}

export default function HeroBackground({
  uniformsRef,
  fixed = true,
  className,
  colors,
}: HeroBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // This is one full-screen quad of soft gradient plus grain. MSAA has no
    // polygon edge to smooth here, and the depth and stencil buffers are never
    // read, so all three only ever cost memory bandwidth — the scarce resource
    // on a phone GPU. The context was asking for 4x MSAA and getting it.
    //
    // The try/catch is load-bearing. three.js asks for a "webgl2" context and
    // has no WebGL1 fallback since r163, so on a device without WebGL2 this
    // constructor throws — and thrown from an effect with no error boundary
    // above it, that unmounts the whole app. The site rendered a blank page:
    // no heading, no nav, no projects. Losing the background is acceptable;
    // losing the portfolio is not, so fall back to a static gradient in the
    // same palette and leave the rest of the page alone.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        depth: false,
        stencil: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      const [c1, c2, c3, c4] = colors ?? FALLBACK_COLORS;
      canvas.style.background =
        `linear-gradient(160deg, ${c1} 0%, ${c2} 38%, ${c3} 68%, ${c4} 100%)`;
      return;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    // A 375pt phone at the old flat cap of 2 shaded 1.2M fragments a frame, each
    // one running the warp loop's two dozen trig calls. Dropping to 1.5 costs
    // about 45% of those and is invisible on a gradient this soft — the only
    // detail near pixel scale is the grain, which just gets slightly coarser.
    // Resolved per resize rather than once at mount, so a window dragged across
    // the breakpoint doesn't keep the tier it happened to load at.
    const pixelRatioFor = (width: number) =>
      Math.min(window.devicePixelRatio, isCoarsePointer || width <= 768 ? 1.5 : 2);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const targetColors = {
      uColor1: new THREE.Color(colors?.[0] ?? FALLBACK_COLORS[0]),
      uColor2: new THREE.Color(colors?.[1] ?? FALLBACK_COLORS[1]),
      uColor3: new THREE.Color(colors?.[2] ?? FALLBACK_COLORS[2]),
      uColor4: new THREE.Color(colors?.[3] ?? FALLBACK_COLORS[3]),
    };

    const uniforms = {
      uTime: { value: 0 },
      uFlowTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: targetColors.uColor1.clone() },
      uColor2: { value: targetColors.uColor2.clone() },
      uColor3: { value: targetColors.uColor3.clone() },
      uColor4: { value: targetColors.uColor4.clone() },
      uColorOffset: { value: new THREE.Vector2(0, 0) },
    };

    if (uniformsRef && typeof uniformsRef === 'object' && 'current' in uniformsRef) {
      uniformsRef.current = {
        uTime: uniforms.uTime,
        uFlowTime: uniforms.uFlowTime,
        uRes: uniforms.uRes,
        uMouse: uniforms.uMouse,
        uColor1: { value: targetColors.uColor1 },
        uColor2: { value: targetColors.uColor2 },
        uColor3: { value: targetColors.uColor3 },
        uColor4: { value: targetColors.uColor4 },
      } as any;
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uFlowTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec2 uColorOffset;

float rand(vec2 p){
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rot(float a){
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 bound01(vec2 p){
  return fract((p + 1.0) * 0.5) * 2.0 - 1.0;
}

// Sine feedback warp
vec2 warpSineFeedback(vec2 p, float t, vec2 mouse01){
  float scale = 2.5;
  float freq  = 2.5;
  float gain  = 1.23;

  vec2 phase = (mouse01 - 0.5) * 3.14159265
             + vec2(0.15 * sin(t * 0.4), 0.15 * cos(t * 0.4));

  p = (p + 3.0) * scale;

  for (int i = 0; i < 3; i++){
    p += cos(p.yx * freq + vec2(t, 1.57) + phase) / 3.0;
    p += sin(p.yx + t + vec2(1.57, 0.0) - phase.yx) / 2.0;
    p *= gain;
  }

  return bound01(p);
}

void main(){
  vec2 p = vUv - 0.5;
  float aspect = uRes.x / uRes.y;
  p.x *= aspect;

  // Hardcoded zoom
  float z = 7.0;
  p /= z;

  float t = uFlowTime;
  vec2 mouse01 = mix(vec2(0.5), uMouse, 0.2);

  // Apply sine feedback warp
  vec2 w = warpSineFeedback(p + uColorOffset, t, mouse01);

  // Create color field
  float field = length(w) / 1.41421356;
  
  // Contrast ramp
  float contrast_low = 0.12;
  float contrast_high = 0.95;
  field = smoothstep(contrast_low, contrast_high, field);

  // Color palette - using 4 stops
  float s1 = 0.28;
  float s2 = 0.58;
  float s3 = 0.82;
  float blend = 0.15;

  float k1 = smoothstep(s1 - blend, s1 + blend, field);
  float k2 = smoothstep(s2 - blend, s2 + blend, field);
  float k3 = smoothstep(s3 - blend, s3 + blend, field);

  float w1 = 1.0 - k1;
  float w2 = k1 * (1.0 - k2);
  float w3 = k2 * (1.0 - k3);
  float w4 = k3;

  vec3 col = uColor1 * w1 + uColor2 * w2 + uColor3 * w3 + uColor4 * w4;

  // Subtle grain
  float g = rand(vUv * uRes);
  col += (g - 0.5) * 0.08;

  gl_FragColor = vec4(col, 1.0);
}
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let lastW = 0;
    let lastH = 0;

    // Set by anything that changes the image. The frame loop skips its draw
    // call while this is false and nothing is in motion — see tick().
    let needsRender = true;

    const resize = () => {
      /**
       * Handles canvas resize events and updates shader uniforms
       * Maintains proper aspect ratio and pixel ratio for high DPI displays
       * @private
       */
      const parent = canvas.parentElement;
      const w = fixed ? window.innerWidth : (parent?.clientWidth ?? window.innerWidth);
      let h = fixed ? window.innerHeight : (parent?.clientHeight ?? window.innerHeight);

      // A mobile URL bar sliding away changes innerHeight mid-scroll, and
      // reallocating the drawing buffer at that exact moment is a visible hitch
      // every time the user starts scrolling. Only a width change (a rotation)
      // is allowed to shrink the canvas; until then it keeps the tallest height
      // it has seen and the few extra rows sit harmlessly behind the bar.
      if (fixed && isCoarsePointer && w === lastW && h < lastH) h = lastH;

      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;

      // Before setSize — three.js multiplies the size by the current ratio.
      renderer.setPixelRatio(pixelRatioFor(w));
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
      needsRender = true;
    };

    resize();
    window.addEventListener("resize", resize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouseSmooth = new THREE.Vector2(0.5, 0.5);
    const lastMouse = new THREE.Vector2(0.5, 0.5);

    let drive = 0;
    let flowTime = 0;
    let raf = 0;

    const onPointerMove = (e: PointerEvent) => {
      /**
       * Updates target mouse position based on pointer events
       * Normalizes coordinates to 0-1 range with y-axis inverted
       * @param {PointerEvent} e - Pointer event from mouse/touch movement
       * @private
       */
      if (fixed) {
        mouseTarget.set(
          e.clientX / window.innerWidth,
          1 - e.clientY / window.innerHeight
        );
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouseTarget.set(
        Math.min(Math.max(x, 0), 1),
        1 - Math.min(Math.max(y, 0), 1)
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let last = performance.now();

    const tauMouse = 0.12;
    const tauDrive = 0.20;
    const driveGain = 1.2;
    const flowSpeed = 0.5;

    const colorOffset = new THREE.Vector2(0, 0);
    const colorOffsetVelocity = new THREE.Vector2(0, 0);

    const colorDistSq = (c1: THREE.Color, c2: THREE.Color) => {
      const dr = c1.r - c2.r;
      const dg = c1.g - c2.g;
      const db = c1.b - c2.b;
      return dr * dr + dg * dg + db * db;
    };

    const tick = () => {
      /**
       * Main animation loop executed every frame
       * 
       * Handles:
       * - Mouse position smoothing with exponential decay
       * - Drive velocity calculation based on mouse movement
       * - Flow time animation driven by user interaction
       * - Shader uniform updates
       * - Renderer frame updates
       * 
       * @private
       * @returns {void}
       */
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1); // Cap dt to avoid spikes on tab focus
      last = now;

      const alphaMouse = 1 - Math.exp(-dt / tauMouse);
      mouseSmooth.lerp(mouseTarget, alphaMouse);
      uniforms.uMouse.value.copy(mouseSmooth);

      const v = mouseSmooth.distanceTo(lastMouse) / Math.max(dt, 1e-4);
      lastMouse.copy(mouseSmooth);

      const driveTarget = Math.min(1, v * driveGain);

      const alphaDrive = 1 - Math.exp(-dt / tauDrive);
      drive += (driveTarget - drive) * alphaDrive;

      // Calculate color difference between current shader colors and target colors
      let colorDiff = 0;
      colorDiff += colorDistSq(uniforms.uColor1.value, targetColors.uColor1);
      colorDiff += colorDistSq(uniforms.uColor2.value, targetColors.uColor2);
      colorDiff += colorDistSq(uniforms.uColor3.value, targetColors.uColor3);
      colorDiff += colorDistSq(uniforms.uColor4.value, targetColors.uColor4);

      // Smoothly lerp the shader colors to target colors
      const colorLerpSpeed = 2.5; // Smooth transition rate
      const alphaColor = 1 - Math.exp(-dt * colorLerpSpeed);
      uniforms.uColor1.value.lerp(targetColors.uColor1, alphaColor);
      uniforms.uColor2.value.lerp(targetColors.uColor2, alphaColor);
      uniforms.uColor3.value.lerp(targetColors.uColor3, alphaColor);
      uniforms.uColor4.value.lerp(targetColors.uColor4, alphaColor);

      // Boost the flow animation slightly during color transitions
      if (!reduceMotion) {
        const transitionBoost = Math.min(2.0, colorDiff * 4.0);
        flowTime += dt * flowSpeed * (drive + transitionBoost);
      }

      // Spring physics for the position offset
      // Push force is proportional to the color difference
      const k = 10.0;     // stiffness
      const c = 3.5;     // damping
      
      // Push in a diagonal direction when color shifts
      const pushX = colorDiff * 0.15;
      const pushY = colorDiff * 0.08;
      
      const ax = pushX - k * colorOffset.x - c * colorOffsetVelocity.x;
      const ay = pushY - k * colorOffset.y - c * colorOffsetVelocity.y;
      
      colorOffsetVelocity.x += ax * dt;
      colorOffsetVelocity.y += ay * dt;
      
      colorOffset.x += colorOffsetVelocity.x * dt;
      colorOffset.y += colorOffsetVelocity.y * dt;
      
      uniforms.uColorOffset.value.copy(colorOffset);

      uniforms.uFlowTime.value = flowTime;
      uniforms.uTime.value = now / 1000;

      // Nothing here animates on its own. uFlowTime only advances while the
      // pointer is moving or a colour is in transit, and uTime is declared but
      // unused by the fragment shader — so an untouched page was re-drawing a
      // pixel-identical frame sixty times a second. That is every frame on a
      // phone, which has no pointermove at all: the whole cost, none of the
      // motion. Draw only when something actually moved. The look is unchanged;
      // the palette transitions between projects still animate, because a
      // colour in flight keeps this true until it lands.
      const inMotion =
        mouseSmooth.distanceToSquared(mouseTarget) > 1e-8 ||
        drive > 1e-4 ||
        colorDiff > 1e-6 ||
        colorOffset.lengthSq() > 1e-10 ||
        colorOffsetVelocity.lengthSq() > 1e-10;

      if (inMotion || needsRender) {
        renderer.render(scene, camera);
        needsRender = false;
      }

      raf = requestAnimationFrame(tick);
    };

    // Coming back from a hidden tab, the drawing buffer may have been dropped
    // (preserveDrawingBuffer is false) and there may be nothing in motion to
    // trigger a repaint, so ask for one explicitly.
    const onVisibility = () => {
      if (!document.hidden) {
        last = performance.now();
        needsRender = true;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // iOS drops WebGL contexts under memory pressure and hands them back later.
    // three.js already calls preventDefault on the loss and rebuilds its GL
    // state on restore, but it does not draw — it assumes an every-frame render
    // loop will paint the next one. This one only paints when something moves,
    // and a restore moves nothing, so without this the background comes back
    // blank and stays blank until a colour transition happens to wake it.
    const onContextRestored = () => {
      needsRender = true;
    };
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [uniformsRef, fixed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "bg-canvas"}
      style={{
        position: fixed ? "fixed" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
