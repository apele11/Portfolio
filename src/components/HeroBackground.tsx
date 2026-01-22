import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderUniforms {
  uTime: { value: number };
  uFlowTime: { value: number };
  uRes: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

export default function HeroBackground({
  uniformsRef,
}: {
  uniformsRef?: React.MutableRefObject<ShaderUniforms | null>;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uFlowTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color("#05060a").convertSRGBToLinear() },
      uColor2: { value: new THREE.Color("#2094C5").convertSRGBToLinear() },
      uColor3: { value: new THREE.Color("#b4532a").convertSRGBToLinear() },
      uColor4: { value: new THREE.Color("#d7c8a2").convertSRGBToLinear() },
    };

    if (uniformsRef) {
      uniformsRef.current = uniforms;
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
  vec2 w = warpSineFeedback(p, t, mouse01);

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

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
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
      mouseTarget.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let last = performance.now();

    const tauMouse = 0.22;
    const tauDrive = 0.30;
    const driveGain = 2.2;
    const flowSpeed = 0.7;

    const tick = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      const alphaMouse = 1 - Math.exp(-dt / tauMouse);
      mouseSmooth.lerp(mouseTarget, alphaMouse);
      uniforms.uMouse.value.copy(mouseSmooth);

      const v = mouseSmooth.distanceTo(lastMouse) / Math.max(dt, 1e-4);
      lastMouse.copy(mouseSmooth);

      const driveTarget = Math.min(1, v * driveGain);

      const alphaDrive = 1 - Math.exp(-dt / tauDrive);
      drive += (driveTarget - drive) * alphaDrive;

      if (!reduceMotion) {
        flowTime += dt * flowSpeed * drive;
      }

      uniforms.uFlowTime.value = flowTime;
      uniforms.uTime.value = now / 1000;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);

      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [uniformsRef]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
