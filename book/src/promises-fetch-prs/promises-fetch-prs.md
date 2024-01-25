# sp23.11: Type/JavaScript Concurrency

**THIS IS NOT FROM FALL 23**

###### tags: `Tag(sp23)`

## Logistics

Good job on Server! My experience is that many students struggle on this sprint; that's OK! I'm going to delay the review somewhat, to make sure we can cover what we need to today.

Stay tuned for more info about final project groups. We'll be forming these quite soon!

UTA applications are open! If you care about 0320 and what we're doing here, consider applying! (If you're struggling in 0320, that **doesn't** mean you shouldn't apply; I've had great TAs in the past who struggled -- or back when the course was ABC, didn't get an A.)

## Generics Exercise (Continued)

We didn't finish the generics exercise from last time, so we'll do that in the first 15 minutes of class today. See the Mar 2 notes, and the lecture capture from today.

## JavaScript Concurrency

Today's livecode is in the repository under [mar07_ts_concurrency_fetch](https://github.com/cs0320/class-livecode/tree/main/S23/mar07_ts_concurrency_fetch). Get the code to follow along. There's also more examples in the repository than we can cover in a single class, so you might find it useful for reference as well.


On the surface, JavaScript has _really_ convenient support for concurrency. Try these in the browser console:

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

What's happening here? JavaScript -- a language built for the web -- is a language whose design is _deeply and unavoidably_ tangled with concurrency. 

And yet, JavaScript itself (barring some modern extensions) is itself _single threaded_. Rather than using threads (as in Java) we usually use callback functions instead.

**Remark:** as we discuss callbacks, think about the idea of _command registration_ from the Java REPL livecode, and the broader _strategy pattern_.

E.g., in JavaScript (and TypeScript):
* Click a button? The browser calls a registered callback for that button click event. 
* Need to request information from a login database or API server? That's a callback that's invoked when the information is fetched.

In principle, these callbacks are, well, _called_ as soon as possible. But it's not that simple.

### The Callback Queue

Because TypeScript is single threaded, it can't actually invoke a callback while it's running some other piece of code. It has to wait until that code finishes, and then it looks at its _callback queue_ to see if it has callbacks waiting to be processed.

Every time a callback is registered (as when the `setTimeout` above times out; the 0-argument function that invokes `console.log` is a callback) it is added to the queue. Crucially, these calls will only ever take place if they're popped off the queue. And they're only ever removed when the code currently being executed is finished.

This will become extremely important when you start sending web requests from your frontend to your API server. **Callbacks are not threads**. 

## Code Review Exercise

Let's look at some code and anticipate potential errors related to concurrency. (We could run this in the browser console after removing types.) What's the value that you expect to be printed by this code?

[Exercise link here!](https://forms.gle/cqqimsuDxsjdWyBf6)

```javascript
function sayHello(): number {
    let toReturn: number = 0
    setTimeout(() => {
        toReturn = 500
    }, 0)
    setTimeout(() => {
        toReturn = 100
    }, 5000)
    return toReturn
}

function main(): void {
    const num: number = sayHello()
    console.log("Num:", num)
}
```

## Fetching Data in TypeScript

In TypeScript, you can use the `fetch` function to send a web request:

```typescript
export function printGridInfo() {    
    const lat: number = 39.7456
    const lon: number = -97.0892
    const url: string = `https://api.weather.gov/points/${lat},${lon}`
    console.log(`Requesting: ${url}`)

    /* 
      Try #1
    */
    const json = fetch(`https://api.weather.gov/points/${lat},${lon}`)
    console.log(json)
```

Thinking about what we just learned about concurrency, and what we know about TypeScript, do you expect `fetch` to be synchronous or asynchronous? That is, will it "block" execution until it finishes?

If it's synchronous, then the page-load process might be delayed noticably. And slowing down page loading to the point a user notices is a cardinal sin on the web: it's "in the folklore" that [a small delay can lead to a drop in revenue](https://news.ycombinator.com/item?id=273900).

But if it's asynchronous (i.e., doesn't block) then what will be printed? Hopefully not `undefined` or `null`---the data will get here sometime! Instead, `fetch` returns a datatype whose entire purpose is to represent data that doesn't yet exist: a _promise_.

![](https://i.imgur.com/bvFibPk.png)

A promise can either be _resolved_, in which case the value exists within (but the value is still a promise object, not the data!) or _rejected_, in which case the promise contains an error. Until either of those events occurs, the promise exists in a state of potential only.

**Aside:** Many modern languages have promise libraries, and promises are a common way to manage asynchronous computation (like web requests). This is not just about TypeScript/JavaScript.

But because of how JavaScript works, the promise _cannot be resolved_ until the current code finishes running. That is, the `console.log` statement can't print the right answer until _after it executes_, because the right answer won't exist until then. Clearly, we need something different. 

### Extracting Promised Data with Callbacks

Promises can be given callback functions to run when they're resolved:

```javascript
fetch(url)
    .then(response => console.log(response)) 
```

The function passed to the `then` call will execute once a real value exists for the response. The `.json()` method returns a promise itself, so we need to provide a callback for that, too, now: 

```javascript
fetch(url)
    .then(response => response.json()) 
    .then(responseObject => {         
           console.log(responseObject)         
    }) 
```

This is called a _chain_ of promises. Once the response is received, we convert it to an object. Once that conversion process is done, we print the result. 

You can find more examples like this in the livecode repository.

### What about Types?

`Promise<T>` is a generic type in TypeScript. By default, `fetch` returns a `Promise<any>`---beware, here. The `any` type exists, at least in part, for interoperability with JavaScript, and it disables many checks involving computation "downstream" of the `any` value. 

**See the livecode for more content.** In particular, there's:
* a demo that reinforces how promises _are not threads_;
* a demo of some pitfalls when using async/await, if you choose to do so; 
* a more complete series of attempts to extract Json from a fetched response, including how to make narrowing easy.

We'll cover what we can in today's class session, but please read over the livecode too. I leave comments to try and make the livecode a good supplemental resource.