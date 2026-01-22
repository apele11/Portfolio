import * as THREE from "three";

export type ShaderUniforms = {
  uTime: { value: number };
  uFlowTime: { value: number };
  uRes: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };

  uMorphAmt: { value: number };
  uSwirlStrength: { value: number };
  uSwirlExp: { value: number };
  uContrast: { value: THREE.Vector2 };
  uGrain: { value: number };
  
  uColor1: { value: THREE.Color };
uColor2: { value: THREE.Color };
uColor3: { value: THREE.Color };
uColor4: { value: THREE.Color };
uStops: { value: THREE.Vector3 };   // (s1, s2, s3)
uBlend: { value: number };          // edge softness
uZoom: { value: number };
uWarpMode: { value: number };
uLavaBlobCount: { value: number };
uLavaRadiusMin: { value: number };
uLavaRadiusMax: { value: number };

uLavaXLo: { value: number };
uLavaXHi: { value: number };
uLavaZLo: { value: number };
uLavaZHi: { value: number };

uLavaPeriodMin: { value: number };
uLavaPeriodMax: { value: number };
uLavaSubcycle: { value: number };

uLavaSminK: { value: number };
uLavaWarpAmp: { value: number };
uLavaWarpScale: { value: number };

uLavaHeatStrength: { value: number };
uLavaHeatExp: { value: number };
uLavaSpawnBoost: { value: number };
uLavaWarpBoost: { value: number };

uLavaMouseBlob: { value: number };
uLavaMouseBlobRadius: { value: number };

uLavaSteps: { value: number };
uLavaFSAA: { value: number };


};

