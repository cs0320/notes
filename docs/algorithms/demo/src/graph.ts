export type Graph = Map<string, string[]>;
export type WeightedGraph = Map<string, [string, number][]>;

export function pathTo(parent: Map<string, string | null>, goal: string): string[] {
  const path: string[] = [];
  for (let n: string | null = goal; n !== null; n = parent.get(n) ?? null) path.unshift(n);
  return path;
}
