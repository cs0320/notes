import type { CSSProperties } from "react";
import type { Scene } from "./scene";

export type Status = "open" | "frontier" | "seen" | "current" | "path";

const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

type Props = { scene: Scene; status: (n: string) => Status; fill: (n: string) => string | undefined; path: string[] };

export function GraphView({ scene, status, fill, path }: Props) {
  const pts = [...scene.nodes.values(), ...scene.blocked];
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const pad = 0.6;
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  const [w, h] = [Math.max(...xs) - x0 + pad, Math.max(...ys) - y0 + pad];
  const onPath = new Set(path.slice(1).map((n, i) => edgeKey(path[i] ?? "", n)));
  const grid = scene.kind === "grid";
  const r = grid ? 0.3 : 0.38;
  return (
    <svg className={`graph ${scene.kind}`} viewBox={`${x0} ${y0} ${w} ${h}`} role="img">
      {scene.blocked.map(({ x, y }) => <rect key={`${x},${y}`} className="blocked" x={x - 0.5} y={y - 0.5} width={1} height={1} />)}
      {scene.edges.map(([a, b, wt]) => {
        const p = scene.nodes.get(a), q = scene.nodes.get(b);
        if (!p || !q) return null;
        const label = !grid || wt !== 1;
        return (
          <g key={edgeKey(a, b)} className={`edge${onPath.has(edgeKey(a, b)) ? " on-path" : ""}${wt !== 1 && grid ? " heavy" : ""}`}>
            <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} />
            {label && <text x={(p.x + q.x) / 2} y={(p.y + q.y) / 2}>{wt}</text>}
          </g>
        );
      })}
      {[...scene.nodes].map(([n, { x, y }]) => {
        const style: CSSProperties | undefined = fill(n) ? { fill: fill(n) } : undefined;
        const ends = n === scene.start ? " start" : n === scene.goal ? " goal" : "";
        return (
          <g key={n} className={`node ${status(n)}${ends}`}>
            {grid
              ? <rect x={x - r} y={y - r} width={2 * r} height={2 * r} rx={0.07} style={style} />
              : <circle cx={x} cy={y} r={r} style={style} />}
            {!grid && <text x={x} y={y}>{n}</text>}
          </g>
        );
      })}
    </svg>
  );
}
