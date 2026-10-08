/// <reference types="vite/client" />

declare module '*.jpg' {
  const content: string | { src: string; height?: number; width?: number };
  export default content;
}

declare module '*.jpeg' {
  const content: string | { src: string; height?: number; width?: number };
  export default content;
}

declare module '*.png' {
  const content: string | { src: string; height?: number; width?: number };
  export default content;
}

declare module '*.webp' {
  const content: string | { src: string; height?: number; width?: number };
  export default content;
}
