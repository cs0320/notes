import { bfs } from "../bfs";
import { dijkstra } from "../dijkstra";
import { astar } from "../astar";
import type { WeightedGraph } from "../graph";
import { unweighted, weighted, type Scene } from "./scene";

export class TracedMap<V> extends Map<string, V> {
  readonly expanded: string[] = [];
  override get(key: string): V | undefined {
    this.expanded.push(key);
    return super.get(key);
  }
}

export type Run = { name: string; expanded: string[]; path: string[] | null };

function trace<V>(name: string, g: Map<string, V>, goal: string, search: (g: Map<string, V>) => string[] | null): Run {
  const traced = new TracedMap<V>(g);
  const path = search(traced);
  return { name, expanded: path ? [...traced.expanded, goal] : traced.expanded, path };
}

export const tieBreaks = {
  "oldest first": (h: (n: string) => number) => h,
  "closest to goal first": (h: (n: string) => number) => (n: string) => h(n) * 1.001,
};
export type TieBreak = keyof typeof tieBreaks;
export const isTieBreak = (k: string): k is TieBreak => k in tieBreaks;

export function runsFor(scene: Scene, tie: TieBreak): Run[] {
  const g = weighted(scene);
  const { start, goal } = scene;
  return [
    trace("BFS", unweighted(g), goal, t => bfs(t, start, goal)),
    trace("Dijkstra", g, goal, t => dijkstra(t, start, goal)),
    trace("A*", g, goal, t => astar(t, start, goal, tieBreaks[tie](scene.h))),
  ];
}

export function frontier(g: WeightedGraph, start: string, expanded: string[]): Set<string> {
  const done = new Set(expanded);
  const out = new Set(done.has(start) ? [] : [start]);
  for (const n of done) for (const [m] of g.get(n) ?? []) if (!done.has(m)) out.add(m);
  return out;
}

export function pathCost(g: WeightedGraph, path: string[]): number {
  return path.slice(1).reduce((s, n, i) => s + (g.get(path[i] ?? "")?.find(([m]) => m === n)?.[1] ?? Infinity), 0);
}
