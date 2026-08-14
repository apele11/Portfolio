export interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'gif' | 'iframe';
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
  liveUrl: string;
  tags: string[];
  height?: string; // height of the item container (e.g. "300px", "450px")
}

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "shader-three",
    title: "Displacement Map Shader",
    description: "An interactive WebGL/GLSL shader simulation using Three.js.",
    type: "iframe",
    embedUrl: "https://apele11.github.io/shaderTHREE/?embed=true",
    liveUrl: "https://apele11.github.io/shaderTHREE/",
    tags: ["Three.js", "GLSL", "WebGL", "Shader"],
    height: "400px"
  }
];
