export const PANEL_KINDS = ['terminal', 'claude', 'sticky', 'browser'] as const;
export type PanelKind = (typeof PANEL_KINDS)[number];

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  rootPath: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Panel {
  id: string;
  boardId: string;
  projectId: string;
  kind: PanelKind;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  config: Record<string, unknown>;
  hostId: string | null;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface Board {
  id: string;
  projectId: string;
  camera: Camera;
  panels: Panel[];
}

/** El zoom máximo es 100 %: xterm falla bajo scale. */
export const ZOOM_MIN = 0.1;
export const ZOOM_MAX = 1;
export const PANEL_MIN_W = 160;
export const PANEL_MIN_H = 100;
