# Properties and Property-Based Testing

## Extra Reading

If you want more material on properties and PBT, you might read [CSCI 1710's notes](https://forge-fm.github.io/book/2026/chapters/properties/pbt.html) on the topic, as well. ScottW also has [a great in-depth series of blog posts](https://fsharpforfunandprofit.com/posts/property-based-testing-2/).

## Logistics 

* If you don't have a key yet (and you're registered and have filled the form), don't worry. Manual and slow. We will understand, but please do all setup you can. Lots of the setup guide doesn't need a key. 
* Gearups today and tomorrow! This one is a primer on Git, agent, etc. 
  * If you're in 1340, you should go to one. We understand CAB didn't list times. If you're in 1340 and can't make any, it's OK to review async. Talk with me. 
* If you decide to drop, please fill out the "why I dropped" form! (In my greeting email.)
* See my EdStem post on note-card replies.
* Sprint 1 goes out later today.

## Testing a Policy

Last time, we walked through a _grid world_ implementation in TypeScript. A grid world is just a 2-dimensional grid where cells might have specific terrain or contain objects. In our case, the world is static. A robot tries to navigate it, collecting rewards and avoiding hazards.

```typescript
export type TerrainType = "open" | "blocked" | "hazard" | "reward";
export type Position = {
  readonly x: number;
  readonly y: number;
};

export type Grid = {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly TerrainType[];
};

export type World = {
  readonly grid: Grid;
  readonly robot: Position;
};
```

The robot was controlled by a _policy_: a function that accepts a world state (i.e., grid and robot position) and returns a direction for the robot to move. We wrote two trivial policies: one that walks randomly, and another that never moves at all. But we could imagine lots of other policies, like:

* Run a DFS or BFS and then move the robot along one of the paths found to a reward.
* Ask the user for keyboard input that controls the robot.
* Create a web interface where the user directs the robot. 
* Reply a previously-recorded game. 
* ...many many more, both algorithmic and interactive.

### Testing Policies

These policies might get pretty complex, especially when they run search algorithms. Maybe we should write some tests? Here's one (I'll use `R` to represent the robot and `_` to denote empty space for readability):

```
const input = "_$_
               ___
               _R_
               ___"
```

What output do we expect? It feels like we want the robot to move up, right? So we'd write:

```typescript
describe("moveToward policy: examples", () => {
  it("moves up if reward is up 2 squares and no other factors", () => {
    // Note: the world string isn't indented to avoid splitting on newline/trimming
    const input = `
.$.
...
.R.`;
    const world = parse(input);
    expect(moveToward(world)).toBe("up");
  });
});
```

Great! Of course, neither of our existing policies will pass this test, but it's a good start. It really does feel like it's the single best move for the robot to make.

### Properties Generalize Behaviors

We might name the above test something like "the policy guides the robot directly toward the reward". This is called a _property_. We've phrased it in a very fuzzy, informal way: reasonable people could disagree about what it means! That's not great; we should do better at expressing what we want. 

Rather than sit and try to improve the property based on a single test, it's better to write more examples and refine our goal(s) based on them. Along the way, we might even understand our goals better ourselves! Here's another:

```
const input = "$_$
               ___
               _R_
               ___"
```

What is the output? 

??? note "Think, then click."
    Forward? 
    Right?
    Left?
    These are all equally good: the reward ends up distance=3 from the robot. With no single "right answer", we can't check against a single expected output. We call this kind of problem _relational_, because there are multiple answers. We could try to work around this by using `or` in each test. But in the general case, this will not scale. And it's annoying: what if we forget an answer?  

What's our new property? Perhaps something like "The robot moves in a way that strictly decreases the distance to reward". If we can't write a standard test, we really need a way to _test the property_. We'll use a library for this (later in this chapter), but we could also do everything manually. A property check is just a function that takes an input and output and returns a boolean. With access to the livecode, it might look like this:

```typescript
function movesTowardReward(world: World, output: Direction): boolean {
  const move = STEP[move];
  const next = { x: world.robot.x + move.x, y: world.robot.y + move.y };
  return distanceToReward(world.grid, next)
       < distanceToReward(world.grid, world.robot);
}
```
Then, we would just write a normal test that expects the property to hold:

```typescript
describe("moveToward policy: examples", () => {
  it("always move closer (for this particular input!)", () => {
    // Note: the world string isn't indented to avoid splitting on newline/trimming
    const input = `
.$.
...
.R.`;
    const move = moveToward(world);  // run the implementation
    expect(movesTowardReward(world, move)).toBe(true);  // check the property
  });
});
```

### Competing Properties

Here's another example.

```
const input = "$_$
               _H_
               _R_
               ___"
```

Is "The robot moves in a way that strictly decreases the distance to reward" still sufficient? Well, no: there's a hazard to the north, but moving there would strictly decrease distance. So now we need a second property:

* The robot moves in a way that strictly decreases the distance to reward.
* The robot never moves into a hazard.

Great. But here's another example:

```
const input = "_$_
               HH_
               RH_
               ___"
```

Yet another challenge. What's wrong?

??? note "Think, then click."
    The robot can't step onto a hazard, but then it can only move in a way that increases its distance from the goal. The properties are _conflicting_. It seems like we need to refine the first property once more. 

    We might first try something like "...unless the robot has no such option" to the property. But if we add that, the robot must move north after moving south, trapping it in a loop. We must be smarter. 

    How about "decreasing path distance in the graph" (where the graph has a node for every grid cell, and edges for each compass direction)? That seems correct, but it's expensive: we'd need to run something like breadth-first search to check the property. 

    Can we find a compromise? How about "If it can, the robot moves in a way that strictly decreases the distance to reward. Otherwise, it never moves into a cell it has been in before."? No, because then the robot can get trapped: consider what would happen if it started one cell down from the above example. 

Notice how we're forcing ourselves to think more carefully about _why_ we like certain moves and dislike others. We're starting to articulate what correctness means in a more precise way. 

!!! note "Trading Risk vs. Reward"
    It's not in scope for this chapter, but I can't resist pointing out that things can get even more complex. What if "hazards" were just negative rewards? Then we might see a world like the following one. Note that this won't parse in our existing code; I'm using brackets and extra underscores to make it easier to read.

    ```
    const input = "[-50_] [100_] [____] 
                   [____] [-INF] [-10_]
                   [_R__] [____] [____]
                   [____] [____] [____]
    ```

    Is the goal to maximize the summed reward and cost, or something else? Does it cost the robot to move? Can it run out of power? I'll stop here, but if you want to learn more about this setting, you'll see this kind of grid world in settings like reinforcement learning. Even there, it's important to agree on _what we want_ from the robot, and how we define victory and defeat.
  
### Dynamic Environments 

What if some hazards could move? Suppose H has same move speed and we take turns, with the robot going first:

```
const input = "_$_
               _H_
               _R_"
```

How do our properties need to change?

??? note "Think, then click."
    The robot always end its turn 1 or more moves away from the hazard.

Notice how our properties are getting more complex. There are situations where we can write the property very precisely, but checking it naively is too expensive. 

!!! note "Expensive Checking" 
    For example, consider the correctness properties for a breadth-first search (BFS). We want the path to start and end in the proper places and to _be_ a path in the input graph. But this is BFS, so we also expect the path to take the minimum number of hops. The first properties are easy (just a loop over the path) but the last one is hard. We could try to get around it by using another implementation as an oracle, but there are often many correct paths&mdash;using an oracle would overfit the check to that oracle. 


### Takeaway

Properties generalize behaviors. They can sometimes be more expensive than a unit test, but they 
can express correctness much more broadly.

* **Advantage 1:** properties can work even when a problem has multiple correct solutions. When _checking_ a single property is expensive, you can still check the others.
* **Advantage 2:** properties force us to think more carefully about what we want. This turns out to be very useful when writing specifications, whether they will be implement by a human or an AI agent. 

So whether or not you check a property, it can still be useful to _write it down_.

Try to break down correctness into multiple sub-properties. Just like how we're better off writing a handful of tests that exercise different things, rather than a single test that does it all, we're better off writing a number of small, orthogonal properties. 

## Random Testing: Mining for Bugs 

So far we've used properties to generalize behavior, but we're still using concrete inputs: the grids are fixed. If we want to be very general, shouldn't we try the policy on lots of different grids? Yes! 

Ideally, we'd be able to check our properties for _any_ gridworld. But there are two problems, broadly.

- **Exhaustivity:** Unless the world dimensions are very small, there will be too many grids to enumerate. Even a 5-by-5 grid has $4^{25}$ ($1{,}125{,}899{,}906{,}842{,}624$) possible configurations. 
- **Bias and Creativity:** If we can't check every world, we probably want to seek _interesting configurations_. Sometimes we're very good at this, but not all of the time. The human brain has limitations.

There are a few directions we could go:

* If the number of configurations is reasonably small, just loop. This often isn't as inefficient as you might think. 
* If you really care about correctness, you might write a proof. If you take an algorithms class, you'll get practice with this technique. You might also use a proof assistant that can help you verify your proofs (e.g., [CSCI 1715 at Brown](https://browncs1951x.github.io)).
* You might throw a constraint solver at the problem. Solvers are much smarter than a naive enumeration, and can be shockingly effective. If you take [CSCI 1710 at Brown](https://csci1710.github.io/2026/), you'll use solvers to reason about data structures, distributed systems, etc.
* If we're willing to sacrifice completeness in the interest of time, we could _generate random inputs_. 

The _Property-Based Testing_ (PBT) technique adds random generation to what we did in the previous sections:

- **Step 1:** express goals in terms of properties that can be checked with a library or even just a boolean-valued function.
- **Step 2:** generate random inputs. 
- **Step 3:** Run the implementation on the input, and check the property on the output.

Then put these steps into a loop. Naively, we might write:

```
  // impl: implementation under test
  // prop: our property-checker function
  for idx in 1...MAX:
    in = randomInput()
    out = impl(in)
    if(!prop(in, out)) return fail
  return pass
```

This is a super powerful technique, and it's used heavily in industry. The random-testing idea is used heavily in industry.

**Advantage 3:** After generating random inputs, properties have made it possible for us to search for bugs while we nap.

!!! note "I don't love the name."
    When people talk about PBT, they usually combine _properties_ with _random inputs_. But even without the random inputs, we already have multiple advantages! Really, we should have called this _random property-based testing_ or something similar.

## How to do this in TypeScript 

We'll use `fast-check`. See the live code for more specifics, but here's an example of the kind of test we can write. Notice that fast-check properties take two arguments:

* an "arbitrary" (their term for a generator of random inputs); and 
* a function that takes a random input and returns true (good output) or false (bad output). 

```typescript
describe("moveToward policy: single step", () => {
  it("distance to reward must be monotonically non-increasing", () => {
    // fast-check assertion
    fc.assert(
      // this property should hold, on values produced by this generator:
      fc.property(worldArb, (world) => {
        // Invoke the implementation under test
        const move = moveToward(world);
        if (move === undefined) return; // nothing happened, nothing to check

        // Now validate the output
        const goals = rewardPositions(world.grid);
        const before = distanceToNearest(world.robot, goals);
        const after = distanceToNearest(step(world, move).robot, goals);
        expect(after).toBeLessThanOrEqual(before);
      }),
    );
  });
});
```


<!-- ## Cost to Compute vs. Cost to Validate 

It would be wonderful if the cost to validate a solution were always cheaper than the cost to compute it. But this isn't always true.  -->


<!-- * Random GRIDS vs. random MOVEMENT: two sides, one static one dynamic. (future could have >1 dynamic!)
    * But we aren't doing arbitraries for sprint 1; we GAVE it to them. 
    * So start with properties only.  -->




<!-- ## Asynchronous Execution



TypeScript has _really_ convenient support for concurrency. Try these in the browser console:

```
console.log('1')
setTimeout(() => console.log('2'), 5000)
console.log('3')
```

But just under that surface, complexity lurks:

```
console.log('1')
setTimeout(() => console.log('2'), 5000)
console.log('3')
while(true) {}
```

What's happening here? JavaScript&mdash;a language built for the web&mdash;is a language whose design is _deeply and unavoidably_ tangled with concurrency. 

And yet, JavaScript itself (barring [some modern extensions](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), which are best used for expensive tasks that would block important things like UI interactivity) is **only single-threaded**.  We don't create a new thread to wait for a web request to finish. Instead, we create a callback, like we would for a button being clicked. 

In principle, callbacks are _called_ as soon as possible. But the definition of "as soon as possible" is complicated. The browser is in charge (or Node is, if you're running a backend server).

### The Callback Queue

Because TypeScript is single threaded, it can't actually invoke a callback while it's running some other piece of code. It has to wait until that code finishes, and then it looks at its _callback queue_ to see if it has callbacks waiting to be processed.

Every time a callback is registered (in the `setTimeout` example above, the 0-argument function that invokes `console.log` is a callback) it is added to the queue. Crucially, these calls will only ever take place if they're popped off the queue. And they're only ever removed when the code currently being executed is finished. 

This will become extremely important when you start sending web requests from your frontend to your API server. **Callbacks are not threads**. Asynchronous execution is very closely related to concurrency, however. 

!!! warning "Repeating for emphasis"
    **Callbacks are not threads.** Neither are promises, `async` functions, or anything else in the remainder of these notes. 

## Code Review Exercise

Let's look at some code and anticipate potential errors related to concurrency. (I've removed the types so that we can run this in the browser console.) What's the value that you expect to be printed by each block of code below, after its respective call is uncommented?

```javascript
function example0() {
  let toReturn = 0
  setTimeout(() => {toReturn = 100}, 5000)
  return toReturn
}
//console.log(example0())

function example1(){
    let toReturn = 0
    setTimeout(() => {toReturn = 500}, 0)
    setTimeout(() => {toReturn = 100}, 5000)
    return toReturn
}
// console.log(example1())

function example2(){
    setTimeout(() => {console.log('A')}, 0)
    setTimeout(() => {console.log('B')}, 5000)
    console.log('C')
    while(0 == 0) {}
    console.log('D')
}
// example2()
``` -->