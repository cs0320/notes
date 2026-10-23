import { useEffect, useMemo, useState } from "react";
import { GraphView, type Status } from "./GraphView";
import { weighted, type Scene } from "./scene";
import { scenes } from "./scenes";
import { frontier, isTieBreak, pathCost, runsFor, tieBreaks, type Run, type TieBreak } from "./trace";
import type { WeightedGraph } from "../graph";

const shade = (i: number, total: number) => `color-mix(in oklab, var(--seen-late) ${Math.round((100 * i) / total)}%, var(--seen-early))`;

function Panel({ scene, g, run, step, total }: { scene: Scene; g: WeightedGraph; run: Run; step: number; total: number }) {
  const seen = run.expanded.slice(0, step);
  const order = new Map<string, number>();
  seen.forEach((n, i) => order.has(n) || order.set(n, i));
  const done = step >= run.expanded.length;
  const path = done ? run.path ?? [] : [];
  const onPath = new Set(path);
  const current = done ? undefined : seen.at(-1);
  const front = done ? new Set<string>() : frontier(g, scene.start, seen);
  const status = (n: string): Status =>
    onPath.has(n) ? "path" : n === current ? "current" : order.has(n) ? "seen" : front.has(n) ? "frontier" : "open";
  const fill = (n: string) => {
    const i = order.get(n);
    return status(n) === "seen" && i !== undefined ? shade(i, total) : undefined;
  };
  return (
    <section className="panel">
      <header>
        <h2>{run.name}</h2>
        <dl>
          <div><dt>expanded</dt><dd>{order.size}</dd></div>
          <div><dt>frontier</dt><dd>{front.size}</dd></div>
          <div><dt>hops</dt><dd>{done && run.path ? run.path.length - 1 : "–"}</dd></div>
          <div><dt>cost</dt><dd>{done && run.path ? pathCost(g, run.path) : "–"}</dd></div>
        </dl>
      </header>
      <GraphView scene={scene} status={status} fill={fill} path={path} />
    </section>
  );
}

export function App() {
  const [sceneName, setSceneName] = useState(Object.keys(scenes)[0] ?? "");
  const [tie, setTie] = useState<TieBreak>("oldest first");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scene = scenes[sceneName];
  const g = useMemo(() => (scene ? weighted(scene) : new Map()), [scene]);
  const runs = useMemo(() => (scene ? runsFor(scene, tie) : []), [scene, tie]);
  const total = Math.max(0, ...runs.map(r => r.expanded.length));
  const speed = scene?.kind === "graph" ? 500 : 90;
  useEffect(() => {
    if (!playing) return;
    if (step >= total) return setPlaying(false);
    const t = setTimeout(() => setStep(s => s + 1), speed);
    return () => clearTimeout(t);
  }, [playing, step, total, speed]);
  const go = (s: number) => setStep(Math.max(0, Math.min(total, s)));
  const restart = () => { setPlaying(false); setStep(0); };
  return (
    <main>
      <h1>BFS · Dijkstra · A*</h1>
      <div className="controls">
        <div className="group">
          <label htmlFor="scene">scene</label>
          <select id="scene" value={sceneName} onChange={e => { setSceneName(e.target.value); restart(); }}>
            {Object.keys(scenes).map(k => <option key={k}>{k}</option>)}
          </select>
          <label htmlFor="tie">A* ties</label>
          <select id="tie" value={tie} onChange={e => { if (isTieBreak(e.target.value)) { setTie(e.target.value); restart(); } }}>
            {Object.keys(tieBreaks).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="group grow">
          <button id="reset" onClick={restart}>⏮</button>
          <button id="back" onClick={() => go(step - 1)}>◀</button>
          <button id="play" className="primary" onClick={() => setPlaying(p => step < total && !p)}>{playing ? "Pause" : "Play"}</button>
          <button id="fwd" onClick={() => go(step + 1)}>▶</button>
          <button id="end" onClick={() => { setPlaying(false); go(total); }}>⏭</button>
          <input id="step" type="range" min={0} max={total} value={step} onChange={e => go(Number(e.target.value))} />
          <output>{step} / {total}</output>
        </div>
      </div>
      {scene && <div className="panels">{runs.map(r => <Panel key={r.name} scene={scene} g={g} run={r} step={step} total={total} />)}</div>}
      <ul className="legend">
        {[["start", "start"], ["goal", "goal"], ["frontier", "frontier"], ["seen", "expanded"], ["current", "current"], ["path", "path"]].map(([k, l]) => (
          <li key={k}><span className={`swatch ${k}`} />{l}</li>
        ))}
      </ul>
    </main>
  );
}
