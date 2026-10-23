export class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];
  get size(): number { return this.items.length; }
  push(item: T, priority: number): void {
    const i = this.items.findIndex(e => e.priority > priority);
    this.items.splice(i === -1 ? this.items.length : i, 0, { item, priority });
  }
  pop(): T | undefined { return this.items.shift()?.item; }
}
