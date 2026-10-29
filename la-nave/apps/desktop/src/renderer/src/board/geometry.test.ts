import { describe, expect, it } from 'vitest';
import { clampZoom, fitToPanels, moveRect, panBy, resizeRect, screenToWorld, spawnPosition, worldToScreen, zoomAt } from './geometry';

describe('geometry', () => {
  it('worldToScreen y screenToWorld son inversas', () => {
    const cam = { x: 120, y: -40, zoom: 0.5 };
    const p = { x: 300, y: 80 };
    const back = screenToWorld(cam, worldToScreen(cam, p));
    expect(back.x).toBeCloseTo(p.x);
    expect(back.y).toBeCloseTo(p.y);
  });

  it('el zoom nunca pasa del 100 % ni baja del mínimo', () => {
    expect(clampZoom(3)).toBe(1);
    expect(clampZoom(0.001)).toBe(0.1);
    expect(clampZoom(0.5)).toBe(0.5);
  });

  it('zoomAt deja fijo el punto del mundo bajo el cursor', () => {
    const cam = { x: 50, y: 70, zoom: 1 };
    const cursor = { x: 400, y: 250 };
    const before = screenToWorld(cam, cursor);
    const next = zoomAt(cam, cursor, 0.4);
    const after = screenToWorld(next, cursor);
    expect(next.zoom).toBeCloseTo(0.4);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('zoomAt no supera el 100 %', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: 1 }, { x: 10, y: 10 }, 2).zoom).toBe(1);
  });

  it('panBy mueve el contenido con el ratón, también con zoom', () => {
    const cam = panBy({ x: 0, y: 0, zoom: 0.5 }, 100, 50);
    expect(cam).toEqual({ x: -200, y: -100, zoom: 0.5 });
    // un panel en el origen del mundo queda desplazado 100,50 px en pantalla
    expect(worldToScreen(cam, { x: 0, y: 0 })).toEqual({ x: 100, y: 50 });
  });

  it('moveRect y resizeRect respetan el tamaño mínimo', () => {
    const r = { x: 0, y: 0, w: 300, h: 200 };
    expect(moveRect(r, 10, -5)).toEqual({ x: 10, y: -5, w: 300, h: 200 });
    expect(resizeRect(r, -1000, -1000)).toMatchObject({ w: 160, h: 100 });
    expect(resizeRect(r, 20, 30)).toMatchObject({ w: 320, h: 230 });
  });

  it('fitToPanels encuadra todo, nunca por encima del 100 %, y vacío da la cámara por defecto', () => {
    expect(fitToPanels([], { w: 800, h: 600 })).toEqual({ x: 0, y: 0, zoom: 1 });
    const small = fitToPanels([{ x: 0, y: 0, w: 100, h: 100 }], { w: 800, h: 600 });
    expect(small.zoom).toBe(1);
    const big = fitToPanels([{ x: 0, y: 0, w: 4000, h: 3000 }, { x: 4000, y: 3000, w: 1000, h: 1000 }], { w: 800, h: 600 });
    expect(big.zoom).toBeLessThan(0.2);
    // todos los paneles caben en la vista
    const topLeft = worldToScreen(big, { x: 0, y: 0 });
    const bottomRight = worldToScreen(big, { x: 5000, y: 4000 });
    expect(topLeft.x).toBeGreaterThanOrEqual(0);
    expect(bottomRight.x).toBeLessThanOrEqual(800);
    expect(bottomRight.y).toBeLessThanOrEqual(600);
  });

  it('spawnPosition coloca el panel nuevo en el centro de la vista y lo escalona', () => {
    const cam = { x: 100, y: 100, zoom: 1 };
    const a = spawnPosition(cam, { w: 800, h: 600 }, { w: 300, h: 200 }, 0);
    expect(a).toEqual({ x: 350, y: 300 });
    expect(spawnPosition(cam, { w: 800, h: 600 }, { w: 300, h: 200 }, 1)).toEqual({ x: 382, y: 332 });
  });
});
