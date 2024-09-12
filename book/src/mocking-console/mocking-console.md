# User Interfaces, Testing More Than Methods 

## Logistics 

Make sure you're up to date on reading Ed announcements. Please fill out the new collab-section form by tomorrow night. We want to make sure we can take everyone's preferences into account. 

Make an override request if you haven't already. I may have a couple seats.

## User Interfaces

In the next Sprint, 1.2, you'll be creating a _user interface_. Admittedly, it might not be what you associate with the term. It's "just" a command-line application which you'll run at your terminal prompt, meant to search the CSV files you've been parsing. For many of you, this may be the first time you've created such a thing. 

**Exercise: what makes a good user interface?** 

<details>
<summary>Think, then click!</summary>

Whatever the _user_ needs. If you can drive a car, imagine how many iterations it took to get the steering wheel right. Yes, that's a user interface. In class, I'll be passing around a slide rule&mdash;something most of us think of as an archaic tool for engineers from a bygone era. But it, too, was a carefully designed user interface: slide rules allowed a skilled user to make sophisticated calculations. 

I'm not a skilled user. But I still think they're interesting.

</details>

The point is: don't limit your view of what a user interface can be. From a certain point of view, even a programing language itself is a user interface. 

### Testing User Interfaces

Engineers test everything they can, within the bounds of their budget and time constraints. So if we're making a user interface, we ought to be able to test that interface. But how? 

If you took 0150, most of your projects had a graphical user interface. Did you test your projects? You might initially say "no", because (at least, at time of writing this) 0150 doesn't spend a lot of time on unit testing the way some other intro courses do. But I'd argue that 0150 students perhaps *test more than students in any other intro course*. You're just doing it *manually*. 

Manual testing has its place, but it's not cost effective. So we'll strive to automate our tests, even the ones that manipulate a user interface.

### Testing a Console Application 

A command-line application takes input from the keyboard and prints output to the screen.

**Exercise:** How do you think you could test a command-line application automatically?

<details>
<summary>Think, then click!</summary>

One approach would be to write a "wrapper" application that runs the program, sends actual keystroke signals, and monitors the actual screen output. It's possible to do this, usually via a shell script or other program whose first action is to run the program under test as a "child" process.

We could also do everything in a JUnit class, and overwrite `System.in`, `System.out`, and `System.err`. These are just objects like any other, and the `System` class exposes them for our use whenever we want to print output or write input. We can't _directly_ overwrite them, but the Java API provides a way to replace them with new objects of the same type. 

Both of the above techniques have their place. But they're _single-taskers_, and if I'm going to spend lecture time on a technique for testing UIs, I want a _multi-tasker_&mdash;something that will be useful again and again for many different engineering problems. And we'll invent it together, by combining two different "big ideas".

</details>

### Idea 1: Mocking Interactions

**Exercise:** How do you know you aren't a brain in a jar right now? That is, are you _sure_ you're in class (or in your room, reading these notes), and not hooked up, Matrix-style, to a system that is sending you manufactured sense inputs and receiving the outputs of your nerves?

There's no hidden answer for this exercise, because it's a deep question. If you really want to explore these issues _literally_, there are many excellent philosophy and cognitive-science courses at Brown. Take one! 

The real exercise is this. **Why is this thought-experiment important in software engineering?**

Let's run with the idea. Suppose we created fake (or "mock") versions of `System.in`, `System.out`, and `System.err`. We can do this; we just need to know a little bit about the types of those objects and how to make mocking them convenient. 

~~~admonish note title="The code is available."
You can find the end result of all this in [the livecode repository](https://github.com/cs0320/class-livecode/tree/main/F24/vignettes/mocking_input_output), under `vignettes/mocking_input_output`. 

The initial application is the `BasicCommandProcessor` class. The modified, final version is the `CommandProcessor` class. Note how it interacts with the corresponding JUnit test class. 
~~~

We'll start with a simple, toy command-line application. All it does is read data from input and match against hard-coded commands. (We can do a _lot_ better than this, but that's a topic for another time.) Here's the pertinent part of its code:

```java
public void run() {
    // This is a "try with resources"; the resource will automatically
    // be closed if necessary. Prefer this over finally blocks.
    // See: https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html
    try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
        String input;
        while ((input = br.readLine()) != null) {
            if (input.equalsIgnoreCase("EXIT")) {
                return;
            } else if (input.equalsIgnoreCase("HI")) {
                System.out.println("Hi!");
            } else if (input.equalsIgnoreCase("GREETINGS")) {
                System.out.println("Delightful to meet you, I'm sure.");
            } else {
                System.err.println("ERROR: Invalid command.");
                // Keep running, though!
            }
        }
    } catch (IOException ex) {
        System.err.println("ERROR: Error reading input.");
        System.exit(1); // exit with error status
    }
}
```

This code uses `System.in`, etc. directly. But let's set that aside for now. How can we make "fake" input and output objects? By creating what's called a _pipe_, a stream with two sides. In place of `System.in` we want a pipe where:
- one side can accept text from our test method; and 
- the other side acts indistinguishably from the actual `System.in`. 
In place of `System.out` and `System.err`, we want a pipe where:
- one side acts indistinguishably from `System.out`; and 
- the other side lets our text method read from it. 

Doing this requires a bit of careful weaving objects together, but here's how we can create the mock `System.in`: 

```java
// This is an *output* stream from the *caller's* perspective...
PipedOutputStream out = new PipedOutputStream();
// ...but an *input* stream from the *callee's* perspective. Connect them!
PipedInputStream in = new PipedInputStream(out);
OutputStreamWriter keyboard = new OutputStreamWriter(out, UTF_8);
```

The `keyboard` object can accept input just like `System.out` can. But, because we've connected it to the `out` object in its constructor, and `out` is connected to `in`, anything we write to `keyboard` can be read from `in`. The fake `System.out` and `System.in` work similarly (see the repository for the code). 

There are a couple potential snags. I'll list them in order of anticipated increasing annoyance for you:
- You need to remember to call `keyboard.flush()` after writing text to it, or it won't be visible immediately on the other side of the pipe. 
- You need to remember to send line-separators! Our application reads _lines_, and if you don't send a complete line... the application may wait forever. Just use `System.lineSeparator()` for this. 
- You probably wonder where these strange classes came from. Or rather, where did I learn about them? Am I just a magical Java wizard? Well, maybe, but in this case I got them from Copilot. Learning how to do obscure things in very common languages is a great application for generative AI. If there's a big problem, I find out right away and refine my prompt. If there's a small problem (there's at least one, and there might be more!) I'm only using this to prototype testing my UI. 

~~~admonish note title="Lacking a diagram..."
Ideally there would be an image here, diagramming how the pipes are connected. But the word pipe really is well-chosen. Follow the flow of object names in the above 3 lines, and if you wonder how it all works, try experimenting in the livecode repository; that's what it's for!
~~~


One question remains. How do we actually make sure these mock objects are _used_ by the application? 

### Dependency Injection 

Consider what you are doing for Sprint 1.1: your parser constructor takes a strategy object that tells the parser how to post-process each row. In essence, the parser has a "hole" in it: it doesn't actually know how to do this post-processing. That makes the parser simpler to write, and allows another developer to configure the parser fairly deeply when creating it. Maybe we can build on that idea, here. 

More concretely, what if the strategy object provided to the application wasn't just a method for creating data, like in Sprint 1.1, or a method for ordering objects, like the comparators in the last class, but our mock objects? That is, what if creating the application went from this:

```java
BasicCommandProcessor proc = new BasicCommandProcessor();
```
to something like this:
```java
CommandProcessor proc = new CommandProcessor(mockIn, mockOut, mockErr);
```

We could then save these objects like any other field, and use them in place of the originals. For example, instead of 
```java
System.err.println("ERROR: Error reading input.");
```
we could write:
```java
mockErr.println("ERROR: Error reading input.");
```

It turns out this works perfectly. We just have to remember to inject the right dependencies:
- For a real application interacting with a real user, we'll pass in the actual Java objects `System.in`, etc. 
- When in our test class, we'll create and pass in mocked versions. 
and to very carefully pre-arrange our input and process our output. Here's code from an example test case in the repository. Notice how we need to print the input commands _before running_, and we need to make sure to end with `exit`&mdash;or else the application will never stop, and we'll never be able to reach the assertions! 

```java
// Once we start the application, this test method will be unable to add anything else. So we must pre-populate
// a fixed series of commands. Then run the application.
mockIn.println("hi");
mockIn.println("greetings");
mockIn.println("notacommand");
mockIn.println("exit");

proc.run();

// Now read from the output and error streams, line by line. But: be careful. If we call readLine() for one of
// the streams and there's nothing there, the program will freeze, because the call will *wait* for something
// to appear in the stream... and that will not happen. So we test before every line we ready to make sure the
// stream has something for us first. (This is a way to protect us from a buggy _test method_.)
// To see why this is important, try commenting out one of the commands above!
assertTrue(mockOut.terminal().ready());
String out1 = mockOut.terminal().readLine();
assertTrue(mockOut.terminal().ready());
String out2 = mockOut.terminal().readLine();
assertTrue(mockErr.terminal().ready());
String err1 = mockErr.terminal().readLine();

assertEquals("Hi!", out1);
assertEquals("Delightful to meet you, I'm sure.", out2);
assertEquals("ERROR: Invalid command.", err1);
```

I strongly encourage you to _experiment with this example_ for yourself. Keep in mind the above warnings: sending a newline character, always stopping the application as the last command queued up, etc. It's easy to get this wrong at first, and that's OK. Debug with print statements (versus the real `System.out` since you'll be in a test method) and diagnose where the problem is happening.

There's a third big idea, which we'll get to soon, called _threads_. Threads will solve many of these problems and make the technique even more powerful.

~~~admonish note title="Why the name 'dependency injection'?"
The object being provided in the constructor is a _dependency_: the class needs it to function. And the object isn't created in that class, but rather passed in ("injected") from outside. 
~~~
