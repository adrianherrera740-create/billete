import { PANEL_MIN_H, PANEL_MIN_W, ZOOM_MAX, ZOOM_MIN } from '@nave/shared';
import type { Camera, Panel } from '@nave/shared';

/**
 * Lógica pura de la pizarra (sin React ni DOM, con tests).
 * Convención: `camera.x/y` es el punto del mundo que está en la esquina superior izquierda de la vista.
 * pantalla = (mundo - cámara) * zoom
 */
export interface Point {
  x: number;
  y: number;
}
export interface Rect extends Point {
  w: number;
  h: number;
}

export const clampZoom = (zoom: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom));

export const worldToScreen = (camera: Camera, p: Point): Point => ({ x: (p.x - camera.x) * camera.zoom, y: (p.y - camera.y) * camera.zoom });
export const screenToWorld = (camera: Camera, p: Point): Point => ({ x: p.x / camera.zoom + camera.x, y: p.y / camera.zoom + camera.y });

/** Desplaza la vista: arrastrar `dx,dy` píxeles de pantalla mueve el contenido en ese sentido. */
export const panBy = (camera: Camera, dx: number, dy: number): Camera => ({
  x: camera.x - dx / camera.zoom,
  y: camera.y - dy / camera.zoom,
  zoom: camera.zoom
});

/** Cambia el zoom manteniendo fijo el punto del mundo que hay bajo `cursor` (en pantalla). */
export function zoomAt(camera: Camera, cursor: Point, nextZoom: number): Camera {
  const zoom = clampZoom(nextZoom);
  const world = screenToWorld(camera, cursor);
  return { x: world.x - cursor.x / zoom, y: world.y - cursor.y / zoom, zoom };
}

export const moveRect = (rect: Rect, dxWorld: number, dyWorld: number): Rect => ({ ...rect, x: rect.x + dxWorld, y: rect.y + dyWorld });

/** Redimensiona desde la esquina inferior derecha respetando el tamaño mínimo. */
export const resizeRect = (rect: Rect, dwWorld: number, dhWorld: number): Rect => ({
  ...rect,
  w: Math.max(PANEL_MIN_W, rect.w + dwWorld),
  h: Math.max(PANEL_MIN_H, rect.h + dhWorld)
});

/** Cámara que encuadra todos los paneles en la vista (visión general). Nunca supera el 100 %. */
export function fitToPanels(panels: Pick<Panel, 'x' | 'y' | 'w' | 'h'>[], viewport: { w: number; h: number }, margin = 48): Camera {
  if (panels.length === 0) return { x: 0, y: 0, zoom: 1 };
  const minX = Math.min(...panels.map((p) => p.x));
  const minY = Math.min(...panels.map((p) => p.y));
  const maxX = Math.max(...panels.map((p) => p.x + p.w));
  const maxY = Math.max(...panels.map((p) => p.y + p.h));
  const zoom = clampZoom(Math.min((viewport.w - margin * 2) / (maxX - minX), (viewport.h - margin * 2) / (maxY - minY)));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  return { x: centerX - viewport.w / 2 / zoom, y: centerY - viewport.h / 2 / zoom, zoom };
}

/** Posición libre para un panel nuevo: junto al centro de la vista, escalonada para no tapar los anteriores. */
export function spawnPosition(camera: Camera, viewport: { w: number; h: number }, size: { w: number; h: number }, existing: number): Point {
  const center = screenToWorld(camera, { x: viewport.w / 2, y: viewport.h / 2 });
  const step = 32 * (existing % 8);
  return { x: Math.round(center.x - size.w / 2 + step), y: Math.round(center.y - size.h / 2 + step) };
}
