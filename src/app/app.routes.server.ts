// Server routes used when rendering on the server (Angular SSR).
// Beginners: these files are only relevant if you run server-side rendering.
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
