import { useEffect, useState, type MutableRefObject } from "react";
import * as THREE from "three";

interface ColorUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

interface ColorPickerProps {
  uniformsRef: MutableRefObject<ColorUniforms | null>;
  colors?: {
    c1: string;
    c2: string;
    c3: string;
    c4: string;
  };
}

export default function ColorPicker({
  uniformsRef,
  colors: propsColors,
}: ColorPickerProps) {
  const [c1, setC1] = useState(propsColors?.c1 || "#05060a");
  const [c2, setC2] = useState(propsColors?.c2 || "#2094C5");
  const [c3, setC3] = useState(propsColors?.c3 || "#b4532a");
  const [c4, setC4] = useState(propsColors?.c4 || "#d7c8a2");

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;

    u.uColor1.value.set(c1).convertSRGBToLinear();
    u.uColor2.value.set(c2).convertSRGBToLinear();
    u.uColor3.value.set(c3).convertSRGBToLinear();
    u.uColor4.value.set(c4).convertSRGBToLinear();
  }, [uniformsRef, c1, c2, c3, c4]);

  return (
    <div style={panel}>
      <div style={header}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Palette</h2>
      </div>

      <div style={palettePreview}>
        <div
          style={{
            height: 16,
            borderRadius: 6,
            background: `linear-gradient(90deg, ${c1}, ${c2}, ${c3}, ${c4})`,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />
      </div>

      <div style={colorsGrid}>
        <ColorInput
          label="Color 1"
          value={c1}
          onChange={setC1}
        />
        <ColorInput
          label="Color 2"
          value={c2}
          onChange={setC2}
        />
        <ColorInput
          label="Color 3"
          value={c3}
          onChange={setC3}
        />
        <ColorInput
          label="Color 4"
          value={c4}
          onChange={setC4}
        />
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={colorRow}>
      <span style={{ flex: 1, fontSize: 12 }}>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 40,
          height: 28,
          padding: 0,
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 6,
          cursor: "pointer",
        }}
      />
      <span style={{ width: 65, fontSize: 11, opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>
        {value.toUpperCase()}
      </span>
    </label>
  );
}

const panel: React.CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  width: 240,
  padding: 14,
  borderRadius: 12,
  background: "rgba(10,10,12,0.8)",
  color: "white",
  fontFamily: "system-ui, sans-serif",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.1)",
  zIndex: 1000,
};

const header: React.CSSProperties = {
  paddingBottom: 10,
  marginBottom: 10,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const palettePreview: React.CSSProperties = {
  marginBottom: 14,
};

const colorsGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const colorRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};
