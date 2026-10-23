import type { Graph, WeightedGraph } from "../graph";

export type Point = { x: number; y: number };
export type Edge = [string, string, number];
export type Scene = {
  kind: "grid" | "graph";
  nodes: Map<string, Point>;
  edges: Edge[];
  blocked: Point[];
  start: string;
  goal: string;
  h: (n: string) => number;
};

export function weighted(scene: Scene): WeightedGraph {
  const g: WeightedGraph = new Map([...scene.nodes.keys()].map((n): [string, [string, number][]] => [n, []]));
  for (const [a, b, w] of scene.edges) {
    g.get(a)?.push([b, w]);
    g.get(b)?.push([a, w]);
  }
  return g;
}

export const unweighted = (g: WeightedGraph): Graph => new Map([...g].map(([n, es]) => [n, es.map(([m]) => m)]));

const at = (nodes: Map<string, Point>, n: string): Point => nodes.get(n) ?? { x: 0, y: 0 };

export function grid(rows: string[]): Scene {
  const nodes = new Map<string, Point>();
  const blocked: Point[] = [];
  const mud = new Set<string>();
  let start = "", goal = "";
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const id = `${x},${y}`;
    if (ch === "#") return void blocked.push({ x, y });
    nodes.set(id, { x, y });
    if (ch === "~") mud.add(id);
    if (ch === "S") start = id;
    if (ch === "G") goal = id;
  }));
  const edges: Edge[] = [];
  for (const [id, { x, y }] of nodes) {
    for (const n of [`${x + 1},${y}`, `${x},${y + 1}`]) {
      if (nodes.has(n)) edges.push([id, n, mud.has(id) || mud.has(n) ? 5 : 1]);
    }
  }
  const g = at(nodes, goal);
  return { kind: "grid", nodes, edges, blocked, start, goal, h: n => Math.abs(at(nodes, n).x - g.x) + Math.abs(at(nodes, n).y - g.y) };
}

export function graph(points: Record<string, [number, number]>, edges: Edge[], start: string, goal: string): Scene {
  const nodes = new Map(Object.entries(points).map(([n, [x, y]]) => [n, { x, y }]));
  const dist = (a: string, b: string) => Math.hypot(at(nodes, a).x - at(nodes, b).x, at(nodes, a).y - at(nodes, b).y);
  const k = Math.min(1, ...edges.map(([a, b, w]) => w / dist(a, b)));
  return { kind: "graph", nodes, edges, blocked: [], start, goal, h: n => k * dist(n, goal) };
}
