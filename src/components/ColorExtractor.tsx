import { useEffect, type MutableRefObject } from "react";
import * as THREE from "three";

interface ShaderUniforms {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uColor3: { value: THREE.Color };
  uColor4: { value: THREE.Color };
}

interface ColorExtractorProps {
  imageUrl: string;
  uniformsRef: MutableRefObject<ShaderUniforms | null>;
  isVisible: boolean;
  projectId?: string;
}

/**
 * Extracts dominant colors from an image and updates shader uniforms
 * Uses canvas image analysis to detect colors from the image
 */
export default function ColorExtractor({
  imageUrl,
  uniformsRef,
  isVisible,
  projectId,
}: ColorExtractorProps) {

  useEffect(() => {
    if (!isVisible || !imageUrl || !uniformsRef.current) {
      console.log("ColorExtractor conditions not met:", {
        isVisible,
        imageUrl: !!imageUrl,
        uniformsCurrent: !!uniformsRef.current,
      });
      return;
    }

    console.log("Extracting colors from:", imageUrl);

    const extractColors = async () => {
      try {
        const img = new Image();
        
        // Try to load from assets folder first using projectId
        let imageSource = imageUrl;
        if (projectId) {
          // Try loading from assets/projects/{projectId}.png
          imageSource = `/assets/projects/${projectId}.png`;
          console.log("Trying to load from assets:", imageSource);
        }
        
        // Don't set crossOrigin for Firebase Storage URLs - they have access tokens
        // Only set it for external CORS-enabled domains
        if (!imageSource.includes("firebasestorage") && !imageSource.startsWith("/")) {
          img.crossOrigin = "Anonymous";
        }
        
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);

            const imageData = ctx.getImageData(0, 0, 100, 100);
            const data = imageData.data;

            // Extract dominant colors using simple color clustering
            const colors = extractDominantColors(data);
            console.log("Extracted colors:", colors);

            // Update shader uniforms with extracted colors
            if (uniformsRef.current && colors.length >= 4) {
              const hexValue1 = parseInt(colors[0].replace("0x", ""), 16);
              const hexValue2 = parseInt(colors[1].replace("0x", ""), 16);
              const hexValue3 = parseInt(colors[2].replace("0x", ""), 16);
              const hexValue4 = parseInt(colors[3].replace("0x", ""), 16);

              console.log("Setting hex values:", {
                hexValue1: hexValue1.toString(16),
                hexValue2: hexValue2.toString(16),
                hexValue3: hexValue3.toString(16),
                hexValue4: hexValue4.toString(16),
              });

              uniformsRef.current.uColor1.value.setHex(hexValue1);
              uniformsRef.current.uColor2.value.setHex(hexValue2);
              uniformsRef.current.uColor3.value.setHex(hexValue3);
              uniformsRef.current.uColor4.value.setHex(hexValue4);
            }
          } catch (error) {
            console.warn("Could not extract colors from image (CORS or processing error):", error);
          }
        };

        img.onerror = (error) => {
          console.error(
            "Image load failed. Error details:",
            error
          );
          console.warn(
            "Could not load image from assets or due to CORS policy. Using default colors.",
            imageSource
          );
        };

        img.src = imageSource;
      } catch (error) {
        console.error("Error setting up color extraction:", error);
      }
    };

    extractColors();
  }, [imageUrl, isVisible, uniformsRef, projectId]);

  return null; // This component doesn't render anything
}

/**
 * Extracts 4 dominant colors from image pixel data
 * Uses a simplified algorithm to identify distinct colors
 */
function extractDominantColors(
  imageData: Uint8ClampedArray,
  numColors: number = 4
): string[] {
  const colorMap = new Map<string, number>();

  // Sample every 4th pixel for performance
  for (let i = 0; i < imageData.length; i += 16) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const a = imageData[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Quantize colors to reduce variations
    const quantR = Math.round(r / 32) * 32;
    const quantG = Math.round(g / 32) * 32;
    const quantB = Math.round(b / 32) * 32;

    const colorKey = `${quantR},${quantG},${quantB}`;
    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
  }

  // Sort by frequency and convert to hex
  const sorted = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors)
    .map(([color]) => {
      const [r, g, b] = color.split(",").map(Number);
      return rgbToHex(r, g, b);
    });

  // Pad with default colors if we don't have enough
  const defaults = ["0x2094C5", "0xb4532a", "0xd7c8a2", "0x05060a"];
  while (sorted.length < numColors) {
    sorted.push(defaults[sorted.length]);
  }

  return sorted;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "0x" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
