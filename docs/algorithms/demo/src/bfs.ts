import { type Graph, pathTo } from "./graph";

export function bfs(graph: Graph, start: string, goal: string): string[] | null {
  const parent = new Map<string, string | null>([[start, null]]);
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === goal) return pathTo(parent, goal);
    for (const next of graph.get(node) ?? []) {
      if (!parent.has(next)) {
        parent.set(next, node);
        queue.push(next);
      }
    }
  }
  return null;
}
