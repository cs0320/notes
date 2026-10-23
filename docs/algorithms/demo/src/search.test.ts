import { describe, expect, test } from "vitest";
import fc from "fast-check";
import { bfs } from "./bfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";
import type { Graph, WeightedGraph } from "./graph";

const unweighted: Graph = new Map([
  ["A", ["B", "C"]], ["B", ["D"]], ["C", ["D", "E"]], ["D", ["F"]], ["E", ["F"]], ["F", []],
]);

const weighted: WeightedGraph = new Map([
  ["A", [["B", 1], ["C", 4]]], ["B", [["C", 1], ["D", 5]]], ["C", [["D", 1]]], ["D", []],
]);

function grid(w: number, h: number, walls: Set<string>): WeightedGraph {
  const g: WeightedGraph = new Map();
  for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) {
    if (walls.has(`${x},${y}`)) continue;
    const ns: [string, number][] = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && !walls.has(`${nx},${ny}`)) ns.push([`${nx},${ny}`, 1]);
    }
    g.set(`${x},${y}`, ns);
  }
  return g;
}

const manhattan = (goal: string) => (n: string) => {
  const [x1, y1] = n.split(",").map(Number) as [number, number];
  const [x2, y2] = goal.split(",").map(Number) as [number, number];
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

function cost(g: WeightedGraph, path: string[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += g.get(path[i - 1]!)!.find(([n]) => n === path[i])![1];
  return total;
}

describe("bfs", () => {
  test("fewest hops", () => expect(bfs(unweighted, "A", "F")).toHaveLength(4));
  test("start is goal", () => expect(bfs(unweighted, "A", "A")).toEqual(["A"]));
  test("unreachable", () => expect(bfs(unweighted, "F", "A")).toBeNull());
});

describe("dijkstra", () => {
  test("cheapest, not fewest hops", () => expect(dijkstra(weighted, "A", "D")).toEqual(["A", "B", "C", "D"]));
  test("unreachable", () => expect(dijkstra(weighted, "D", "A")).toBeNull());
});

describe("astar", () => {
  test("h = 0 is dijkstra", () => expect(astar(weighted, "A", "D", () => 0)).toEqual(["A", "B", "C", "D"]));
  test("grid around a wall", () => {
    const g = grid(5, 5, new Set(["2,0", "2,1", "2,2", "2,3"]));
    expect(astar(g, "0,0", "4,0", manhattan("4,0"))).toHaveLength(13);
  });
  test("same cost as dijkstra on random grids", () => {
    fc.assert(fc.property(fc.uniqueArray(fc.tuple(fc.nat(7), fc.nat(7))), cells => {
      const walls = new Set(cells.map(([x, y]) => `${x},${y}`).filter(c => c !== "0,0" && c !== "7,7"));
      const g = grid(8, 8, walls);
      const d = dijkstra(g, "0,0", "7,7");
      const a = astar(g, "0,0", "7,7", manhattan("7,7"));
      expect(a === null).toBe(d === null);
      if (a && d) expect(cost(g, a)).toBe(cost(g, d));
    }));
  });
});
