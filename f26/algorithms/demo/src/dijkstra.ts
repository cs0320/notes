import { type WeightedGraph, pathTo } from "./graph";
import { PriorityQueue } from "./pq";

export function dijkstra(graph: WeightedGraph, start: string, goal: string): string[] | null {
  const parent = new Map<string, string | null>([[start, null]]);
  const dist = new Map([[start, 0]]);
  const frontier = new PriorityQueue<string>();
  frontier.push(start, 0);
  while (frontier.size > 0) {
    const node = frontier.pop()!;
    if (node === goal) return pathTo(parent, goal);
    for (const [next, w] of graph.get(node) ?? []) {
      const d = dist.get(node)! + w;
      if (d < (dist.get(next) ?? Infinity)) {
        dist.set(next, d);
        parent.set(next, node);
        frontier.push(next, d);
      }
    }
  }
  return null;
}
