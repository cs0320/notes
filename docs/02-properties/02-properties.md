# Property-Based Testing

**This will be filled in.**

## Logistics 

* If you don't have a key yet (and you're registered and have filled the form), don't worry. Manual and slow. We will understand, but please do all setup you can. Lots of the setup guide doesn't need a key. 

* Gearups today and tomorrow! This one is a primer on Git, agent, etc. 
  * If you're in 1340, you should go to one. We understand CAB didn't list times. If you're in 1340 and can't make any, it's OK to review async. Talk with me. 

* If you decide to drop, please fill out the "why I dropped" form! (In my greeting email.)

* See my EdStem post on note-card replies.

* Sprint 1 goes out later today.

## Testing a Policy

Gridworld from last time

Properties and concrete examples.
Help us understand the problem we're trying to solve. 
Let's write tests for a given policy. What is "good behavior" for robot?

### A First Try

```
_$_
___
_R_
___
```

Forward! Ok, that's concrete. WHY?
  - In right direction
  - BEST direction
  - Natural language: "Policy guides robot toward the reward"

```
$_$
___
_R_
___
```

Forward! Right! Left! All equally good. All 3 from robot. 
  - No longer deterministic. We can't write a single output with ==
  - Could use `or`, but in general case this will blow up. And it's annoying.
  - And we can't move in "right direction"; not in unconstrained 3-space. 
  

### Properties Unify Examples 

"Robot moves in a way strictly decreasing distance"?
This works! Covers all 3 good moves above.

```
$_$
_H_
_R_
___
```

Left! Right! Still non-determinstic. But not up. Why? 
  - Competing properties. ALSO want to not touch a hazard. 
  - "Robot moves in a way strictly decreasing distance" is violated.
    - Allow robot to not get FURTHER away...

```
_$_
HH_
RH_
___
```

  - Oh no, but now the robot NEEDS to get further away!
    - How can we recover? Need the property to be more permissive. 
    - But now it's more expensive to check: "decreasing path distance in graph". 
      - Properties unify examples... at a cost.
      
### Trading Goals

What if "hazards" were just negative rewards? Things become much more convenient in some ways, 
and much more complicated in others. 

```
[-50_] [100_] [____] 
[____] [-INF] [-10_]
[_R__] [____] [____]
[____] [____] [____]
```

Is the goal to maximize summed reward? 
Does it cost the robot to move?

### Dynamic Environments 

What if some hazards could move? Suppose H has same move speed and we take turns:

```
_$_
_H_
_R_
```

Robot needs to always END a turn 1 or more moves away from the hazard.

Notice how our properties are getting more complex, as is reasoning about them. This suggests that the implementation of the policy will also grow in complexity.

### Takeaway

Properties generalize behaviors, at some cost. 
Usually, when we write a standard in-out test, we have some property or properties in mind.

Just like how we're better off writing a handful tests that test different things rather than a single test that tries to get them all, we're better off writing a number of small, orthogonal properties. 

## Mining for Bugs 

So far we've used properties to generalize behavior, but we're still using concrete inputs: the grids are fixed. If we want to be very general, shouldn't we try the policy on lots of different grids? 

We should absolutely think carefully about grid shapes that matter: where the hazards go, where the rewards go, which cells are blocked, ..., keeping in mind what behavior we are testing for. 

But ideally, we'd be able to check our property for ANY gridworld. There's just one problem:
  - if we don't bound size, there are infinitely many of them; and 
  - even if we bound size, with 4 possible cell types it's 4 to the number of cells. 
    - 4^9 = 262,000
    - 4^16 = 4 billion
    - ... 

There are a few directions we could go in.
  - roll a for loop (sometimes this works fine, like in the 3x3 case)
  - if bounded, throw a constraint solver at the problem (avoid enumeration)
  - if unbounded, might try to reason carefully and write a proof 
  - if we're willing to give up completeness in favor of coverage, random grids! 

"Property Based Testing" generally unifies two things:
  - expressing goals in terms of properties (as we've been learning to do); and 
  - generating random inputs and trying the implementation on them automatically. 

```
  for idx in 1...MAX:
    in = randomInput()
    out = impl(in)
    if(!prop(in, out)) return fail
  return pass
```

This is a super powerful technique. By writing properties, we've made our testing more flexible and resilient. By generating random inputs, we've made it possible for us to search for bugs while we nap.

Used all over the place. Even without properties ("fuzzing").

## How to do this in TypeScript 

We'll use `fast-check`. 

## Sprint 1

...

<!-- ## Cost to Compute vs. Cost to Validate 

It would be wonderful if the cost to validate a solution were always cheaper than the cost to compute it. But this isn't always true.  -->


<!-- * Random GRIDS vs. random MOVEMENT: two sides, one static one dynamic. (future could have >1 dynamic!)
    * But we aren't doing arbitraries for sprint 1; we GAVE it to them. 
    * So start with properties only.  -->


- gridworld TEST. What did we test for with this test? (empty grid, expect policy move DIRECT toward reward)
  - DFS vs. BFS for these properties
  - but... we really want to cap the number of moves, right? now we have another test (find WITHIN) that 
    works over game traces.




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

~~~admonish warning title="Repeating for emphasis"
**Callbacks are not threads.** Neither are promises, `async` functions, or anything else in the remainder of these notes. 
~~~

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