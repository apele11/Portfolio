export interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'gif' | 'iframe' | 'video';
  /** Image source, or the .mp4 for a `video` item. */
  mediaUrl?: string;
  embedUrl?: string;
  /**
   * Still frame shown instantly over an `iframe` embed until the live demo has
   * booted, then swapped out. The embeds are third-party pages that re-run their
   * own JS and WebGL init on every mount — roughly 1.4s even with a warm HTTP
   * cache — so this is the only thing that removes the wait from what the user
   * sees. Optional: without it the embed simply appears when it is ready.
   */
  poster?: string;
  /**
   * Hosted demo. Optional: a sketch that only ever existed as a capture has
   * nothing to link to, and the card drops its link row rather than pointing
   * the visitor at a dead end.
   */
  liveUrl?: string;
  tags: string[];
  /**
   * `feature` is the large captioned card; `tile` (the default) is bare media on
   * the page ground, captioned only on hover/focus. The grid is editorial rather
   * than uniform — a feature earns its size by carrying the writing, and the
   * tiles around it read as a contact sheet.
   */
  variant?: 'feature' | 'tile';
  /** Grid columns to occupy, out of 4. Defaults to 2 for a feature, 1 for a tile. */
  span?: 1 | 2;
  /**
   * Tile shape, as a CSS aspect-ratio. Defaults to a square, and squares are
   * what let the tiles form an even block the feature can align its bottom
   * edge to — override this only if you are willing to give that up.
   */
  aspect?: string;
}

const ASSETS = "/assets/compressed/Playground";

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "shader-three",
    title: "Displacement Map Shader",
    description: "An interactive WebGL/GLSL shader simulation using Three.js.",
    type: "iframe",
    embedUrl: "https://apele11.github.io/shaderTHREE/?embed=true",
    liveUrl: "https://apele11.github.io/shaderTHREE/",
    tags: ["Three.js", "GLSL", "WebGL", "Shader"],
    variant: "feature"
  },
  {
    id: "raymarched-sphere",
    title: "Raymarched Sphere",
    description:
      "A sphere rendered without geometry: a signed distance function marched per pixel in a fragment shader, lit from the surface normal recovered out of the distance field's gradient.",
    type: "video",
    mediaUrl: `${ASSETS}/RaymarchedSphere.mp4`,
    tags: ["GLSL", "Raymarching", "SDF", "WebGL"]
  },
  {
    id: "heart-sdf",
    title: "Heart SDF",
    description:
      "A heart built by folding and combining primitive distance fields, then animated by driving the blend between them over time.",
    type: "video",
    mediaUrl: `${ASSETS}/HeartSDF.mp4`,
    tags: ["GLSL", "SDF", "Shader"]
  },
  {
    id: "linear-sdf",
    title: "Linear SDF",
    description:
      "Distance fields laid out on a line, exploring how smooth-minimum blending makes separate shapes read as one continuous surface.",
    type: "video",
    mediaUrl: `${ASSETS}/LinearSDF.mp4`,
    tags: ["GLSL", "SDF", "Shader"]
  },
  {
    id: "spatial-repetition-circles",
    title: "Spatial Repetition",
    description:
      "One circle, repeated across space by wrapping the coordinate system back on itself — the field is drawn once and the domain does the tiling.",
    type: "video",
    mediaUrl: `${ASSETS}/SpatialRepetitionCircles.mp4`,
    tags: ["GLSL", "Domain Repetition", "Shader"]
  }
];
