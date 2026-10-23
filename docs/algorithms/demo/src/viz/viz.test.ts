import { describe, expect, test } from "vitest";
import { dijkstra } from "../dijkstra";
import { grid, weighted } from "./scene";
import { scenes } from "./scenes";
import { frontier, pathCost, runsFor, tieBreaks, type TieBreak } from "./trace";

describe("grid", () => {
  const s = grid(["S.~", ".#.", "..G"]);
  test("parses cells", () => {
    expect(s.start).toBe("0,0");
    expect(s.goal).toBe("2,2");
    expect(s.nodes.size).toBe(8);
    expect(s.blocked).toEqual([{ x: 1, y: 1 }]);
  });
  test("mud edges are heavy", () => {
    expect(s.edges.filter(([, , w]) => w === 5)).toHaveLength(2);
  });
});

describe.each(Object.entries(scenes))("%s", (_, scene) => {
  const g = weighted(scene);
  test("heuristic is consistent", () => {
    for (const [a, b, w] of scene.edges) expect(Math.abs(scene.h(a) - scene.h(b))).toBeLessThanOrEqual(w);
    expect(scene.h(scene.goal)).toBe(0);
  });
  test.each(Object.keys(tieBreaks))("A* (%s) is optimal", tie => {
    const [, d, a] = runsFor(scene, tie as TieBreak);
    expect(a?.path && pathCost(g, a.path)).toBe(d?.path && pathCost(g, d.path));
  });
  test("traced runs match untraced search", () => {
    expect(runsFor(scene, "oldest first")[1]?.path).toEqual(dijkstra(g, scene.start, scene.goal));
  });
  test("frontier starts at start", () => {
    expect(frontier(g, scene.start, [])).toEqual(new Set([scene.start]));
  });
});

test("road map separates BFS from Dijkstra", () => {
  const scene = scenes["graph: road map"]!;
  const g = weighted(scene);
  const [b, d] = runsFor(scene, "oldest first");
  expect(b?.path).toHaveLength(5);
  expect(pathCost(g, d!.path!)).toBe(19);
  expect(pathCost(g, b!.path!)).toBeGreaterThan(19);
});
