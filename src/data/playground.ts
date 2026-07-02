export interface PlaygroundItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'gif' | 'iframe';
  mediaUrl?: string;
  embedUrl?: string;
  liveUrl: string;
  tags: string[];
  height?: string; // height of the item container (e.g. "300px", "450px")
}

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "shader-three",
    title: "Shader THREE",
    description: "An interactive WebGL/GLSL shader simulation using Three.js.",
    type: "iframe",
    embedUrl: "https://apele11.github.io/shaderTHREE/?embed=true",
    liveUrl: "https://apele11.github.io/shaderTHREE/",
    tags: ["Three.js", "GLSL", "WebGL", "Shader"],
    height: "400px"
  }
];
