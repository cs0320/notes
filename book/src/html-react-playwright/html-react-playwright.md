# Webapps: HTML, CSS, and TypeScript

Today we're going to start learning how to write webapps. In time, you'll have a working front-end web application, which you'll use to query the backend server you're finishing up now. 

## Why now? Is this related to the homework?

There's a whole week before the front-end sprints start! So, you might wonder why I'm spending time on TypeScript now, instead of doing more in Java. Experience shows that, especially since the front-end sprints will use a language many of you won't have used before, taking time to introduce front-end more gradually is a good idea. (If you're reading this in the Spring semester, long weekend means that we only have one class to work with next week.)

Please be aware that these notes:
* cover __multiple class meetings__ (and thus may change, as I prepare for class each day);
* contain supplemental material which may not be covered in class; and
* are meant to be accompanied by the full [NYT puzzle example](https://github.com/cs0320/class-livecode/tree/main/S25/nyt), which contains many comments for your reference.


## Quick Links

```admonish note title="Read on!"
I'm putting these links at the beginning to make them easier to find, but if this is your first time reading: **skip past this section to get to the content these links refer to first!**
```

**TypeScript**: TypeScript is a programming language. You can write backend programs with it, but it is most commonly associated with web programming. We strongly suggest making use of the TypeScript documentation. In particular, ["instanceof narrowing"](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), which we'll sometimes need to use. Notice how different this is from what we're used to in Java. That doesn't make it good or bad, just different. And TypeScript can do some useful things that Java can't easily manage.

**OOP in TypeScript**: I'm deliberately _not_ using TypeScript's classes in any of my livecode examples. If you think of yourself mainly as an OO programmer, I strongly encourage you to step back from that and try something new in TypeScript. In the same way we cover some OO design ideas, I want to also cover some functional design ideas, and TypeScript is a useful language to do that. If you want to refer to documentation anyway, the [TypeScript docs on classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) are available, but keep my recommendation in mind. 

**React**: React is a web framework for JavaScript and TypeScript. We'll use it to make web development a bit easier. You will find the [React docs](https://beta.reactjs.org/) useful. This is especially true for the `useEffect` hook (not used in the NYT app) and `useState` hooks (which you'll see in the example). You may need either or both throughout the next few weeks. Hooks help you control state in your components. Remember that you are not in control of how often a component is re-evaluated; **putting state changes directly in the component function is not reliable**. Use hooks instead. 

**Playwright**: Playwright is a library for automated testing of web applications. It has a lot of useful features that I hope you'll use. [Playwright's documentation](https://playwright.dev/docs/intro), especially its [page on locators](https://playwright.dev/docs/locators#locate-by-role), will be useful for testing.

Finally, the end of this document says a few words on the keywords `await` and `async`, which you'll see in the Playwright examples, but **you should not need to use `await` outside your test files.** We'll cover `await` and `async` more for your _next_ Sprint. For now, just use them in the way we describe for testing. 

### A Word on "Talent"

I'd caution against viewing success in either 0320 or CSCI generally as related to _talent_, for a couple reasons.  We don't talk enough about how talent depends on external factors and experience. Stephen Sondheim (who I imagine knew more about talent than most) said that "everybody is talented, it's just that some people get it developed and some don't." We can often (wrongly) think of "talent" in CSCI as when some skill or concept comes easily. But the development of talent requires time, support, work, etc. And even prodigies need that&mdash;e.g., Terrence Tao (who aced the math SATs when he was 8 years old) got a lot of tutoring support growing up, and (crucially) his family was able to provide it.

## Static HTML and CSS Basics

Let's start by looking at a student's website. The site is hosted [here](https://cs.brown.edu/~tbn/nim/). Naturally, I got permission before using one of your fellow student's webpages. The style is rather outdated, but it suffices as a first intro to these concepts.

This website uses three files:
* an HTML file, which defines the _content_ of the page ([index.html](https://cs.brown.edu/~tbn/nim/index.html));
* a CSS File, which defines the _styling_ of the page ([styles.css](https://cs.brown.edu/~tbn/nim/styles.css)); and 
* an image file with a picture of the student ([nim.png](https://cs.brown.edu/~tbn/nim/nim.png)).

There's no "app" here; the site is static. Put another way, it's just unchanging content for the browser to format and present for us to see.

### HTML: The Content

Notice that the structure of HTML is _treelike_. Tags open and close elements in the document. There's some metadata, but largely the document describes visible content and the structure of that content.

If you're used to editing documents via Google Docs or MS Word, you might be wondering where the _formatting_ information comes from. Websites usually separate out content from styling, meaning that the HTML won't say that a certain word should be shown in a particular font, or aligned in a particular way. Instead, any context needed for styling to be done is specified by...

### CSS: The Styling

CSS files say how to _style_ elements of a webpage. Because the author of this page gave the `uniName` class to "Brown University", this style declaration will apply:

```css
.uniName {
    color: brown; 
    font-family: Trebuchet, sans-serif;
    font-size: 18px;
    font-weight: normal; 
}
```

The dot before `uniName` means that the style is meant to apply to any element on the page with `uniName` as its _class_. This is called a _CSS selector_; there are [lots more](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) that select elements by their `id` or other properties. 

The result of this separation is that the HTML document can focus on content and context, and leave styling aside. Yes, it's possible to embed your CSS inside the same file, and there are also frameworks that combine the two in a useful way. But the convention we'll follow to start with is to split the two into different files. 

~~~admonish warning title="Beware: styling isn't easy."
You might initially be inclined to dismiss styling as a minor part of a webapp. Don't. You will spend a surprising amount of time on styling before the semester is over. Just because CSS isn't obviously a "programming language" doesn't mean it lacks for complexity. More on this in the near future.
~~~

### Viewing HTML Source

By default, your browser will render the HTML file, rather than showing its raw form. To see the HTML itself, you'll need to _view source_. Often there's a right-click menu option for this, but if not there's usually a key combination to press:
* In Safari: `Command + Option + U`;
* In (Windows) Firefox: `Control + U`;
* In (MacOS) Firefox: `Command + U`.

### Inspecting Elements

CSS files also have significant influence over how elements are positioned on the page. It can be useful to see where boundaries between `div`s and other elements actually are. This is best done in a browser's page-inspection tool. You'll often find this under "Web Developer Tools" or "Dev Tools" or a similarly named menu. Here are some key combinations:
* In Safari: `Command + Option + I` (and click on the `Elements` tab);
* In (Windows) Firefox: `Control + Shift + I` (and click the `Inspector` tab);
* In (MacOS) Firefox: `Command + Option + I` (and click on the `Inspector` tab).

Notice that when I mouse over the first column in the table, my browser is highlighting the on-page position of that column:

![](https://i.imgur.com/TD3UYKg.png)

There are better ways of formatting this sort of data than tables. I took this from a webpage written more than a decade ago. However, HTML tables would be a great way to start displaying rows of tabular data on a webpage!

~~~admonish warning title="'Sources' isn't updated."
Make sure you're looking at `Elements` or `Inspector`, not `Sources`. Once we start working with pages that change dynamically, `Sources` only shows the starting HTML (the source loaded in the file) without updates that are actually displayed. 
~~~

## A Website I Liked

The New York Times website had a [puzzle](https://www.nytimes.com/interactive/2015/07/03/upshot/a-quick-puzzle-to-test-your-problem-solving.html) a few years back that I love to use in class. It went something like this:

![](https://i.imgur.com/EOIDbbx.png)

### The Problem

The page is paywalled. Although Brown provides access through your logins, it's kind of a pain to set up under time constraints. So, while you should definitely try the NYT's version if you can, _let's build our own_. In fact, [I've already built one!](https://tnelson.github.io/reactNYT/) 

This is an example of a webapp with both a _front end_ and a _back end_. The front-end piece is what you see on the webpage, and all the dynamic functionality is there. The backend (in this app, anyway) is just a database where I keep track of everyone's sequences, and the results the app gave you. 

Let's try it out. I didn't implement the "I'm ready to guess" part yet, but once you have a guess, **write it down** and stop.

<details>
<summary>Think, then click!</summary>
The rule is "any non-decreasing sequence of three numbers." Is that your guess?
    
Perhaps not! The NYT reports that the majority of people who've tried the puzzle made their first guess before ever receiving a _false_ response. 
    
What does that have to do with software engineering? This is an example of _confirmation bias_; we humans tend to favor examples that _meet_ our expectations. But without first seeing some `false` results, how would you really build confidence in your guess? (Maybe _any_ sequence worked!) 

By the way, this shows an example of how cognitive bias can impact our testing. It's quite easy to see a lot of `true` responses and get complacent...
</details>

#### Accessibility

This site isn't great in terms of accessibility, yet. Notice that whether the pattern matched or didn't is communicated visually by _just_ color, and not with words or other formatting. We'll talk more about that in a future class.

## Let's Build A Webapp!

We're going to write a less complex version of that web app today. Crucially, it will have _no back-end code_, and can just be run in a browser, via a local webserver. **The gearup will cover more of this setup.**

### JavaScript and TypeScript: Dynamic Behavior

Neither HTML nor CSS alone suffice to build a good web application. We need a way to add *dynamic behavior* to the page, and to do that, we probably want a programming language.

There are dozens of options (including Java) but one tends to be far more popular than others: JavaScript. In fact, many popular web programming languages actually compile to JavaScript---which means browser developers can focus on optimizing JavaScript performance in their engine, confident in a broad impact. (If you took CS 0190 or CS 0111, the language you used the most---Pyret---compiles to JavaScript.) 

### TypeScript: JavaScript with a Seatbelt

We'll be using _TypeScript_ in 0320. TypeScript is (essentially) JavaScript with types, and as you get experience you'll very quickly see why those types are a good thing. But browsers don't understand TypeScript; they generally have highly optimized engines for running *JavaScript*. TypeScript code is compiled to JavaScript by the TypeScript compiler. That's our job to run as the web developer, _not_ the client's job. Websites need to load quickly, and so we need the pre-compiled JavaScript code ready to go when a client requests the webpage.

**Remember: TypeScript is for the developer, but JavaScript is for the browser.**


### Why TypeScript, not JavaScript?

Since TypeScript compiles to JavaScript, and our browser understands JavaScript, let's set the types aside for now and just think about programming for the web. This is a good time to talk about how to learn a new programming language productively. 

Yeah, it can be useful to read books and articles and ask questions on Ed and check StackOverflow and so on. But there's a sort of deeper checklist I like to follow when learning a new language, and as we follow it for JavaScript together we'll discover a few of the nastier surprise differences.

I like to identify language features that I rely on, and experiment with them. Coming up with these facets isn't always easy, which is why we're doing it together. For instance, let's check out _equality_, a deceptively simple yet subtle idea that many languages differ on. I'll use Safari's JS console (Command-Option-C):

```javascript
> 15 == "15"
true
> 15 == true
false
> 1 == true
true
0 == false
true
```

Already we've learned a great deal. JavaScript's `==` operator performs type conversion before comparing values. It allows us to pretend that the number `1` is "true" and that the number `0` is "false", but other numbers aren't equivalent to either. 

Those of you who have programmed in Racket before: notice this is different from Racket! In Racket, every non-false value (Racket calls false `#f`) is considered true. The same is true in many other languages.

JavaScript has a second equality operator, `===`, that checks for equality _without_ type conversion. So:

```javascript
> 15 === "15"
false
```

Java also has two different types of equality (`==` and the `.equals` method), but there the difference has nothing to do with implicit type conversion, but with references vs. structural equality. JavaScript's implicit conversion adds an extra layer of complexity.

### Arithmetic

Let's try a few arithmetic operators that are often overloaded across different languages.

```javascript
> '1' + 1
'11'

> 1 + '1'
'11'

> 1 - '1'
0

> '1' - 1
0
```

JavaScript tries to "do the reasonable thing" whenever possible. When in doubt, use explicit conversion functions (e.g., `parseInt`).

In fact, let's try a couple more (Credit for these to [Gary Bernhardt](https://www.destroyallsoftware.com/talks/wat) from 2012---it's 4 minutes long; watch it.) For context, `[]` denotes an array or list in JavaScript and `{}` denotes an object.

```javascript
> [] + []
""

> {} + {}
NaN

> [] + {}
{} + {}

> {} + []
0

> typeof ""
"string"

> typeof NaN
"number"
```

"Addition" isn't even commutative in JavaScript, because addition isn't always addition. And not-a-number is a number.

~~~admonish note title="typeof"
The `typeof` operator is from _JavaScript_! Thus, it's about very coarse runtime types. The `typeof` any object or array will be `"object"`, for example. 
~~~

Do you see why TypeScript is helpful, now? JavaScript lets you throw off the constraints of the type system, but those constraints are like a safety belt on a roller coaster.

#### What's Really Happening?

The details involve how JavaScript is implicitly converting between different types. Before applying `+`, it converts to a "primitive" type, which for an object is a string. An empty array is converted to the empty string. And so on. The details would consume a full class, or more! 

### Objects

While we won't be using TypeScript _classes_ for reasons I discuss above, we can't avoid using _objects_. Objects in TypeScript are collections of fields; there's no sharp distinction between fields that are behavior and fields that are data. If you've used Python before, these may remind you of dictionaries. For example, I might have a TypeScript object that stores some data and some behavior related to my beloved cat, Charli:

```javascript
cat = {talk: function() { console.log('meow'); }, name: 'Charli'}
cat.talk()
```

**Takeaway:** In JavaScript, functions are _values_.

<!-- 
  **Not covering this, since we're strongly encouraging students to avoid JS classes for now.**

### Prototypes

Objects in Javascript don't have the same sort of inheritance as they do in Java. They have _prototypes_:

```javascript
a = {a1: 1, a2: 2}
b = Object.create(a)
b.b1 = 1
b.b1
b.a2
a.b1
```

Run these in order, and see what they produce.

I added that last one for the first time this year, after realizing I sure _hoped_ it would be `undefined` but wasn't entirely sure.


### New

Prototypes are usually set automatically by constructors. Any function can be a constructor if you use `new`:

```javascript
function point(x, y) {
  this.x = x
  this.y = y
}
```

But, be careful. Try these in order:

```javascript
pt1 = point(1, 2)
x
y
pt2 = new point(4, 5)
pt2
```

What's going on?

It turns out that `this` isn't what you think it is.

### This

```javascript
philosopher = {talk: function() { console.log(this); }}
philosopher.talk()
speech = philosopher.talk
speech()
```

The problem is that, in Javascript, `this` is more about context than identity. This can trip up functional programmers as much as OO programmers.

(By the way, you can try this experiment in Python with `self`, and in Python `self` _does_ work the way you expect.)

In JavaScript, `this` is set a few ways:   
* During object construction with `new`, `this` is a fresh object.
* Globally it begins set to some root object (`window` in browsers).
* Most Java-like: When a function is invoked "through" an object (as in the first call above).
* There are `f.apply` and `f.call`, used to invoke `f` with a specific `this`. Also, `f.bind(o)` produces a new function, like `f()`, but where `this` will be `o`. 
* When browsers invoke event handlers, `this` is set to the DOM object.

Vitally, but confusingly: `this` is NOT set to an object, `X`, just because you call a function that you got by saying: `const f = X.m;`. It's context, not "the object".
   -->

### Aside: Blank Space

I'm including this because it is a strange thing about TypeScript/JavaScript and it's caused confusion before. Let's ask: how does JavaScript handle blank space? How about the ultimate blank space: new lines?

```javascript
five = function() { return 
5; }
```

JavaScript automatically inserts semicolons where it believes they are needed. It turns out this often makes sense, but can be confusing. I found [this great StackOverflow thread](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi) that explains the policy in detail.

The language is powerful, and many of its quirks actually make perfect sense when writing web UIs. But still, beware, and treat your JavaScript programs like a science project: if you've got weird behavior, _experiment_. 


~~~admonish note title="Strict Mode"
If you absolutely must work in plain JavaScript (do not do this in 0320, you must use TypeScript), I suggest enabling _strict mode_. You'll get fewer silent failures (and more runtime errors). It won't give you protections before runtime like TypeScript does, and it won't protect you from as many problems. But it's better than nothing.
~~~

## Back to the App

I've put a draft of the puzzle in the live code repository [here](https://github.com/cs0320/class-livecode/tree/main/S24/reactNYT). 

You can find the HTML [here](https://github.com/cs0320/class-livecode/blob/main/S24/reactNYT/public/index.html). There are a couple of new tags in the HTML, but they're just more semantic grouping tags, like `section` etc. We'll focus on the code today.

One thing is worth noting: the CSS has only two declarations. These correspond to the formatting cues assigned to correct and incorrect sequences in the history:

```css
.correct-try {
    background-color: green;
}
.incorrect-try {
    background-color: red;
}
```

We could make the page a lot better-looking by doing more with CSS styling. But this is meant to be an example focused on the dynamic behavior only.

### Adding Dynamic Behavior

Let's start by writing a function that recognizes sequences matching our rule. 

```typescript
function pattern(guess: string[]): boolean {
    if(guess.length !== 3) return false;
    if(guess[0].length < 1 || 
       guess[1].length < 1 ||
       guess[2].length < 1) return false;
    if(parseInt(guess[0]) >= parseInt(guess[1])) return false;
    if(parseInt(guess[1]) >= parseInt(guess[2])) return false;
    return true;
}
```

#### What Do You Notice?

What do you notice about this TypeScript syntax, or about the style of coding in the function? 

<details>
<summary>Think, then click!</summary>

You might notice:
* functions doesn't have to be methods in a class, like they would need to be in Java;
* the function has type annotations on its parameters and return value, like methods in Java;
* the function uses a strange `!==` operator;
* ...
    
</details>

#### Unit Testing TypeScript

This doesn't get called anywhere yet, but it's something we can unit test. To do that, we'll export it for use in other modules:

```typescript!
export {pattern};
```

How do we write unit tests for TypeScript? Very similarly to how we write unit tests for Java. I'll make a new file called `pattern.test.ts` to hold tests for the pattern checking code:

```typescript!
import { test, expect } from '@playwright/test';
import { pattern } from '../src/pattern'

test('pattern false if all empty', () => {
    const input = ['','','']
    const output = pattern(input)    
    expect(output).toBe(false);
  });

test('pattern true for 1,2,3', () => {
    const input = ['1','2','3']
    const output = pattern(input)    
    expect(output).toBe(true);
  });

```

The `test` construct defines a test case, which takes the form of an anonymous function (also called an "arrow function" or a "lambda"). The syntax means a function that takes no arguments (`() =>`) whose body defines two constants and runs an assertion.

We'd like to write a _lot_ more of these. For now, we'll just run the test suite with this single test in it. (If you haven't yet, you'll first need to run `npm install` to download all the dependencies for this application. You might get some deprecation warnings; ignore those for today.) Then run: `npm test`. This will run our tests via the testing library we're using, which is called Playwright.


~~~admonish note title="Playwright"
Playwright allows a _lot_ more than what we've seen so far. It's built for front-end testing, so it makes a lot of things easy that JUnit doesn't. 

Depending on how you install, you might need to run `npx playwright install` when you first run tests. This is normal; just run the command. Where `npm` manages your TypeScript and JavaScript packages, `npx` runs programs within packages. So `npx playwright install` runs an `install` command defined by Playwright. (It downloads various browser emulators.)
~~~

## Adding Behavior on the Page

We should add some behavior on the webpage. There are two ways we could go about this.
* Option 1: Write the application in plain ("vanilla") TypeScript. This would have the advantage of showing how web programming works at a low level (in short: callback functions and events: lots of overlap with the strategy pattern!) But this would require us to manage program state and update the state of the webpage all by ourselves, which can be complex. 
* Option 2: Set up the application using a framework like React which helps manage state, update the page, and much more. 

I like Option 2, where I can trust the framework to re-render the page when needed. That way I can focus exclusively on how and where state is used and updated. 

## React and Reactivity

### Most Languages

Consider what happens when I assign a value in JavaScript (or Java, or C, or most programming languages):

```javascript
x = 10;
y = x + 1;
```

At this point, `x` contains the value `10` and `y` contains the value `11`. But suppose I then update the value of `x` to `50`:

```javascript
x = 50;
```

_What happens to the value of `y`_? 

In most languages, it remains set to `11`. That `x + 1` is only computed once, at the time the line executes. And, at that time, the value of `x` was 10. So what if it's now `50`? It was `10` when the assignment to `y` happened.

### Another philosophy

Let's set up something similar in Google Sheets:

![](https://i.imgur.com/Uc6DO5N.png)

The cell `A1` is set to 10, and the cell `B1` has been assigned `A1+1`. Like before `B1` has the value `11`.

But in this setting, if I go and change `A1` to `50`, the value of `B1` automatically updates to `51`:

![](https://i.imgur.com/aaMMjcf.png)

Languages where assignment works like it does in Google Sheets are called _reactive_, because values change _in reaction to_ changes in their dependencies. 

At this point, you may have two questions:

_Q: Is reactivity fundamental to the language, or can you build reactivity atop normal assignment?_ 
A: You can, with effort, implement reactivity in languages where it's not the default behavior. 

_Q: Where is reactivity natural, outside of a spreadsheet program?_ 
A: Reactivity makes sense in more domains than you might think.

### Using Reactivity

Here are a few examples.
* Signal propagation in electrical engineering
* Updating a database view in real time
* Monitoring a system (either in production or for debugging)
* *Physical* interfaces like a steering wheel or thermostat

Here are two more examples in a bit more detail:
  
#### Updating a UI when data changes

In a networked chess application, the state of the board on screen should automatically reflect the programmatic board state as it changes based on moves made. (This is straightforward to implement in React.)

#### Updating a cache when UI changes

In Google maps, if I zoom out and then drag my view from Rhode Island to New York, it would be wise for them to automatically update some locally-cached information in anticipation of needing to get more data about New York.

### How do we get reactivity?

All of the above are something we could, in principle, build ourselves in vanilla JavaScript (or some other language). Unfortunately, as the application grows in complexity, this becomes tougher to do, and there are efficiency challenges.

For example, if we wanted to use reactivity in our web frontend applications, it would be good to avoid updating the _entire webpage_ every time a small value changed. We'd like to update only the places in the DOM that _really need_ updating. Making updates accurate and efficient is hard work. Fortunately, many web frameworks give us (an approximation of) reactivity for free. 

I say "approximation" because there is some nuance that we'll get to in time. 

<!-- ~~~admonish note ="Wait, what does "approximation" mean here?"
    
As with everything real, there is nuance. In React (which is introduced in the next section; sorry!), state updates are _asynchronous_: you don't _make_ a state update, you _queue_ a state update to be made. This gives the library control over when updates happen, which can improve performance, but means that React is not, strictly speaking, "reactive". 
    
The [React docs](https://reactjs.org/docs/design-principles.html) say:    

> There is an internal joke in the team that React should have been called "Schedule" because React does not want to be fully "reactive".

In other words, React is a UI-building framework that borrows concepts from reactivity. If you want to learn more about "true" reactivity, check out libraries like [RxJS](https://rxjs.dev) which focus on dataflow via an abstraction called "observables".
~~~ -->
 
## React

React provides two useful features (among others):
* React manages your front-end app's state centrally, and when it detects a state change it propagates that change to a _virtual copy_ of the page. The actual page then only gets updated when it actually needs to be changed. This can improve efficiency of complex apps. To make this work, **you usually want to manage all state through React**.
* React gives us a nice way to align the *visual layout* of the app with the program. Concretely, **a React component is a TypeScript function** that returns a special kind of object that resembles HTML: a **JSX** expression. In effect, JSX is HTML **with holes in it** where we can plug in the result of running TypeScript code.

~~~admonish tip title="JSX" 
Always keep in mind that **a React function component must return a JSX expression**. This might be plain HTML, but almost always it's got some JavaScript being evaluated inside squiggle-braces. 
~~~

We're also using Vite, a development server for React applications. This makes it easier to get started. Notice that we're using a lot of helper libraries! This is normal in much of web development, and we want to get more practice managing this.

~~~admonish tip title="Components"    
React components will either be classes or functions.  We don't use "class components". They are outdated, from the early days of React. You'll still see them referenced online, though. The React team strongly suggests that new development use functional components instead, though. We follow their advice, and so should you. **Use function components.**
~~~

### What are our components for this application?

After you ignore all of the extraneous content, the NYT puzzle is pretty simple: 
* 3 input boxes invite you to enter a trio of numbers. 
* Once you've entered numbers, you click a button to check whether those numbers are in the hidden set of sequences. 
* The 3 input boxes become read-only and get colored red or green depending on success or failure.
* A new trio of inputs appears.

So, for our graphical components, we probably need:
* input boxes and a submission button; and
* a notion of "attempt": one current attempt, and 0 or more past attempts.

That's enough to get a very rough approximation of the puzzle, which is good enough for me!

I like to draw out a prototype UI, and circle different regions that represent important grouping in the application. E.g.:

![](https://i.imgur.com/3cIg553.png)


### A starting template

The complete livecode is available in [the repository](https://github.com/cs0320/class-livecode/tree/main/F24/reactNYT). I'll call out a few points about the code here.

#### JSX 

React component functions return **JSX**, rather than standard TypeScript, which is why the file extension is now `.tsx` rather than `.ts`. React automatically renders whatever these functions return into HTML.

All these components except `App` take _properties_. This is either a single argument, `props`, that represents information passed down from parent components, or a collection of variables that do the same.

### Running

From the console, I'll run `npm run start`. Because I'm using React with Vite, it will give me output like this:

```
  VITE v4.4.9  ready in 1240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

If I then go to `http://localhost:5173/reactNYT`, I can view the app. (By default, it would be served at `localhost:3000`, but I've configured it to add `reactNYT` so that I could deploy it where I did, rather than the root of my Github pages page. We won't be doing deployment today.)

### Configuration

We've got a file called `package.json` and another called `tsconfig.json`. These respectively control:
* the project's metadata and dependencies, rather than `pom.xml` did in Java; and
* how TypeScript should compile (e.g., which version of JavaScript it should emit, whether it should interoperate with raw JavaScript, etc.).

There's also a very large file, `package-lock.json`. This gives the low-level details of how dependencies were resolved, even implicit ones, and helps ensure a consistent build. *All three of these should be pushed to Github*.

On the other hand, `node_modules` is where the dependencies have been downloaded. These are often large, and *should not be pushed to Github*.

You may notice some other configuration:
* `vite.config.js` configures Vite (which is how we're running React).
* `jest.config.js` configures Jest (the library we'll use for *unit* testing in TypeScript).

That's a lot of moving parts! Front-end development tends to have more pieces, but just keep in mind: 
* Browsers understand JavaScript;
* TypeScript adds types, and gets compiled to JavaScript;
* React is a framework that makes building applications easier; and
* Vite is a development server meant to make building React apps easier.
 
### Application state

The `App` component is the entry point into a `create-react-app` program. Let's start by adding a `NewRound` component:

```javascript
function App() {
  return (
    <div>
      <NewRound/>      
    </div>
  );
}
```

This changes nothing, but it raises the question: how do we get the `NewRound` component to do what we want? Our application has some state. What does the state look like? 

We'll need at least:
* the state of each text input;
* some record of past guesses; and (if we want to get fancy)
* maybe some text state for showing error messages and so on.

Let's focus on the record of past guesses. What's the right component for that record to be kept in? If we keep the record in one big array, it's the `App` component. We don't just want to add a global variable for this, though; we want to enable React to register our updates so it can efficiently flow those updates into the UI. For this, we'll use a hook (see this week's lab for more information), and we'll pass both the value and the setter function to the `NewRound` component. We'll also tell the `NewRound` component about how to update the notification text

```javascript
function App() {
  const [guesses, setGuesses] = useState([]);
  const [notification, setNotification] = useState('');
  return (
    <div>
      <NewRound setGuesses={setGuesses}
                setNotification={setNotification} />      
      {notification}
    </div>
  );
}
```

The squiggly braces contain JavaScript; the result of evaluating that JavaScript gets substituted into the JSX. As a result, the `NewRound` component will have access to the setter for `guesses`, and thus have the ability to _update_ the record.

Having referred to a _NewRound_ component, we probably ought to do something in the corresponding function (which is, at the moment, empty except for a `<div>`). We've got to do a few things:
* We need a place for the state of those 3 text inputs to go. We'll use another `useState` hook for this.
* We need a place for the inputs to go, and the guess button.
* We need to _take in_ some props---at minimum, a way to change the notification message.

See the completed livecode for details. Much of class will be a code-dive exercise with an opportunity to ask questions. Pay special attention to...
* ...how state is declared, updated, and accessed. Never modify a state variable directly; always use the setter provided by React, and don't expect the setter to execute right away.
* ...how the components refer to each other, forming a nested structure. The structure of the program echoes the graphical structure. If you're ever feeling "lost" in React, draw the picture of how the components should relate to each other. 


~~~admonish warning title="React state updates are asynchronous!"
Try adding a `console` write immediately after a state update (here's a snippet modified from the full code below):

```javascript=function ControlledInput(props) {
  return (
    <input value={props.value} onChange={(ev) => {
      props.setValue(ev.target.value);
      console.log(props.value);
   }
  }></input>);
}
```

The `console.log` will print the old value, because React hasn't yet had a chance to run the update. In general, don't expect React state updates to take effect until after the currently running code has ended. (We'll talk more about this in preparation for your _next_ sprint.)
~~~

 
## More Testing in React

We'll be using and requiring _Playwright_ for Mock and future sprints. You're strongly encouraged to use it on your term projects as well, since that's what we can best support. Playwright is a great library for scripting front-end tests. There's a [guiding principle](https://testing-library.com/docs/guiding-principles/) (quoted from a different testing library) that we'll follow for front-end testing:

> The more your tests resemble the way your software is used, the more confidence they can give you.
 
Broadly, we're going to focus on a more heavy-weight kind of testing on the front end that resembles the integration tests you wrote for Server. We'll call this *end-to-end* testing, because it can potentially test the entire application. You might think of it as a kind of user-focused system testing.
 
### Contrasting vs. Unit Testing 
 
Unit testing still has a (major) place in our testing lives. It's still useful to test narrow units of code. But _why_ do we unit test? It isn't because of some crude rule like "we should test every line!" but rather because it's important to have confidence about _interface boundaries_ in your application. These boundaries exist at many different levels:
* individual public helper functions used throughout an application that developers (often you) invoke elsewhere, relying on their specific behavior when doing so;
* the behavior of frontend-backend communication (like your API server in Sprint 2) and other connections between large components that developers (often _not_ you) rely on; 
* the behavior of actual _user_ interface(s) that end users rely on; 
* ...

It's _always_ about the behavior! 

My view is that testing should always be rooted in the requirements that specific kinds of users have---whether they're developers or end-users. Hence the way we've framed the user stories in your sprints to reflect the needs of both.

Kent Dodds writes more about this philosophy in the context of a *different testing library* [here](https://kentcdodds.com/blog/testing-implementation-details). If you read the post, you'll see that he also frames testing in terms of both developers and end-users. Dodds also writes that if a test suite is brittle to low-level changes, it is a timesink to maintain. 

If that doesn't seem counter-intuitive, give it more thought. Tests _specify behavior_ at whatever level they operate. And isn't it a good thing whenever we know what our software should do? If so, it must also be a good thing for our software to be _completely specified_; you'd know exactly what the software does (or, even better, exactly what you should be implementing). **No room for ambiguity, no chance of missing any rubric points or making any users unhappy.**

That's good, right? ...Right? 

Maybe. But there's a price to pay in managing that specification and the effects of change. The more completely the tests specify your application, the less you'll be able to change without breaking tests.

<!-- (Since tests really do specify what correct behavior is, we'll use "specification" and "testing" interchangeably in this specific chapter of notes.) -->

## Using Playwright to Test

You can find some example uses of Playwright in the `reactNYT` livecode repository. In particular, look at the [`app.spec.tsx` file](https://github.com/cs0320/class-livecode/blob/main/F23/reactNYT/tests/app.spec.ts). Here's an example:

```typescript
test('renders guess input fields', async ({ page }) => {
  await page.goto(url);    
  // Leverage accessibility tags we ought to be providing anyway  
  const guess0 = await page.getByRole("textbox", {name: TEXT_number_1_accessible_name})
  const guess1 = await page.getByRole("textbox", {name: TEXT_number_2_accessible_name})
  const guess2 = await page.getByRole("textbox", {name: TEXT_number_3_accessible_name})
  await expect(guess0).toBeVisible()
  await expect(guess1).toBeVisible()
  await expect(guess2).toBeVisible()
});
```

First, the test calls `page.goto` to load the page. This works because of [how Playwright is configured](https://github.com/cs0320/class-livecode/blob/main/F23/reactNYT/playwright.config.ts) in the project: when run, Playwright will automatically start up the development server for the project. 

Then, the test creates *locators* for textbox elements with specific labels (in this case, accessibility metadata). Rather than hard-coding the specific string, the module imports an identifier from the app itself in the `constants.ts` file:
```typescript
export const TEXT_number_1_accessible_name = 'first number in sequence'
```

The advantage of this approach is that, assuming that the application also uses `TEXT_number_1_accessible_name` for the accessible label of the input boxes, simple changes to their text _won't break our tests_. 

Notice how we're identifying the three "guess" input boxes based on their _accessible role_ and _accessible name_. This is less brittle than just getting all elements with that role; we don't need to filter out old-round information, or worry about ordering. Instead, `NewRound.tsx` sets up the `NewRound` component so that these text boxes all have distinct accessible names. 

You'll see this a lot in modern front-end testing. Rather than requesting elements from `document` or some other HTML node, we'll use library support for accessibility metadata. Using Playwright it's easy to enter values into the input boxes:

```typescript
await guess0.fill('100');    
await guess1.fill('200');    
await guess2.fill('300');
```
and even script clicking the button, after we find it by its accessibility data:
```typescript
await submitButton.click();
```

#### What's up with `await`?

We'll talk more about `await` soon. For now, just know it's a way to tell TypeScript to *stop here* until a value is generated. 

**You shouldn't need to use `await` in your actual application yet!** But it's very important when testing with Playwright, because some actions take time. Loading the page, for example, or clicking a button. If you don't `await` those actions, the script will continue to the next line before the page is ready. 

<!-- If you want to skip ahead to what is *actually* going on, unhide this text (and remember that you shouldn't need to use this knowledge, yet, except in Playwright tests): 

<details>
<summary>What's really going on? (Optional Information)</summary>
    
In TypeScript, a `Promise` is a generic type that represents an *eventual* value (or error). The `await` keyword pauses execution until a `Promise` resolves, but only in certain contexts. 

For more information, see these [docs on `Promise`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and these [docs on `async` and `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). 
    
If you find yourself tempted to use `await` within your code (not your tests), ask a staff member first. 

</details>-->
    
We are deliberately delaying this topic to avoid adding more conceptual overhead. For now, please await more information; we promise to provide it.    

#### Why aren't you adding types in these test files?

While you must fill in types in your application files, we're **not** requiring you to fill in explicit type values within your test files. These files _are_ TypeScript; we're just letting TypeScript infer types on its own. 

