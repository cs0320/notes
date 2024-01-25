# sp23 Concurrency (Java)

###### tags: `Tag(fa23)`

The material in these notes goes deeper than we can cover in class. If you're having issues with concurrency in Java on your term project, **read these notes**! If you're having trouble with the difference between promises (coming next lecture) and threads, **read these (and the next) notes!**

## Logistics 

Your term project group forms are due today. Let's spend some time in class on group formation... 

## Livecode (Important)

Today's examples will draw from the scripts and prompts in the [`oct17_concurrent_queue_manager`](https://github.com/cs0320/class-livecode/tree/main/F23/oct17_concurrent_queue_manager) livecode project. The livecode also contains material that isn't covered in class, including:
* a more advanced used of the adapter pattern (a relative of proxy) to merge together multiple student queues; and
* a separate thread example showing how to leverage threads for performance (thread pools).

## Logistics: Reading

The reading will be in Chapter 11 of [Effective Java](https://www-oreilly-com.revproxy.brown.edu/library/view/effective-java/9780134686097/?ar). The whole chapter may be useful to you when you start to program with concurrency in Java. 
Only _Item 78_ (the first in Chapter 11) is required reading. Please do read it; concurrency bugs are some of the most frustrating and time-consuming to encounter. Note especially that there are multiple things that can go wrong in a simple data access. Even if only _one_ thread is writing (unlike our example today) synchronization may still be needed to ensure that other threads _read_ the updated value consistently.

Continue to think defensively as you use concurrency and parallelism.

### Optional Reference Materials

Save these for use later. 

[The "Gang of Four" patterns book](https://www-oreilly-com.revproxy.brown.edu/library/view/design-patterns-elements/0201633612/?ar) discusses, in detail, many more patterns than we can cover in lecture.

[Angelika Langer's Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html) is a wonderfully detailed reference for Java generics. 

## Motivating Concurrency

Let's go back to the hours queue dispatcher. You can find a more complete version of the example in the project linked at the beginning of these notes.

If we run the `main` method in the `Main` class of this new example, we'll get something like this (possibly with TAs changed from year to year):

```
Dispatcher: Welcome to TA hours! Today we're discussing Concurrency
Dispatcher: Hi Nim; you'll be seen by Galen
Galen says: Hello Nim!
Galen says: Goodbye Nim, I hope that helped!!
Dispatcher: Hi Alice; you'll be seen by Jenny
Jenny says: Hello Alice!
Jenny says: Goodbye Alice, I hope that helped!!
Dispatcher: Hi Bob; you'll be seen by Galen
Galen says: Hello Bob!
Galen says: Goodbye Bob, I hope that helped!!
Dispatcher: Hi Charli; you'll be seen by Jenny
Jenny says: Hello Charli!
Jenny says: Goodbye Charli, I hope that helped!!
Dispatcher: Hi Boatswain; you'll be seen by Galen
Galen says: Hello Boatswain!
Galen says: Goodbye Boatswain, I hope that helped!!
Dispatcher: Hi Bucky; you'll be seen by Jenny
Jenny says: Hello Bucky!
Jenny says: Goodbye Bucky, I hope that helped!!
Dispatcher: Nobody waiting in queue, will check again in three seconds.
```

By itself, this doesn't look too bad. But what happens if we watch the timing of these events? 

```
11:27:21 Dispatcher: Welcome to TA hours! Today we're discussing Concurrency
11:27:21 Dispatcher: Hi Nim; you'll be seen by Galen
11:27:21 Galen says: Hello Nim!
11:27:22 Galen says: Goodbye Nim, I hope that helped!!
11:27:22 Dispatcher: Hi Alice; you'll be seen by Jenny
11:27:22 Jenny says: Hello Alice!
11:27:24 Jenny says: Goodbye Alice, I hope that helped!!
11:27:24 Dispatcher: Hi Bob; you'll be seen by Galen
11:27:24 Galen says: Hello Bob!
11:27:25 Galen says: Goodbye Bob, I hope that helped!!
11:27:25 Dispatcher: Hi Charli; you'll be seen by Jenny
11:27:25 Jenny says: Hello Charli!
11:27:27 Jenny says: Goodbye Charli, I hope that helped!!
11:27:27 Dispatcher: Hi Boatswain; you'll be seen by Galen
11:27:27 Galen says: Hello Boatswain!
11:27:29 Galen says: Goodbye Boatswain, I hope that helped!!
11:27:29 Dispatcher: Hi Bucky; you'll be seen by Jenny
11:27:29 Jenny says: Hello Bucky!
11:27:30 Jenny says: Goodbye Bucky, I hope that helped!!
11:27:30 Dispatcher: Nobody waiting in queue, will check again in three seconds.
11:27:33 Dispatcher: Nobody waiting in queue, will check again in three seconds.
```

This doesn't look so great. We have some problems to solve. If you look at the code, you might see other problems too. Here are three:
* Challenge 1: the dispatcher is waiting for _an individual TA_ to finish helping a student before allocating the next TA. Lots of TAs will be idle, and students will wait a lot longer.
* Challenge 2: maybe we'd like to add TAs while the dispatcher is running.
* Challenge 3: how can new students join the queue?

All of these problems are related to today's topic: _concurrency_:
* We'd like TAs to be able to help students without holding up the dispatcher from allocating other students to other TAs. _We need the dispatcher to run concurrently with the TAs._
* We need a way for the `Main` class to call `dispatcher.addTA()` after the dispatcher starts running. But right now, there's no way for the `Main` class to run independently of the dispatcher. _We need the dispatcher to run concurrently with the `main()` method._
* We need a way for new students to be added to the queue. This is the same problem as above!

Concerns like these pop up all the time in engineering. (The problem isn't just that the way I've written the dispatcher library is not very realistic.)

## How does concurrency help us?

A program is _concurrent_ if it involves multiple simultaneous threads of execution. Note that this doesn't necessarily mean that these multiple threads really are running at the same time, just that they are "executing". We will make a distinction in this class between concurrency and _parallelism_, where threads really are executing at the same time, usually on multi-core hardware or in the cloud. A parallel program is always concurrent, but a concurrent program may or may not actually be parallel. 

To illustrate this idea, consider what your computer is doing right now. You're probably running more programs than you can count, even before you think about what your operating system is doing. How many CPU cores do you have? Probably not more than a dozen (and likely fewer). So not all of the concurrency that's happening can be parallelized: you'd need hundreds of cores for that! Instead, your operating system runs a _scheduler_ program which allocates slices of time to different threads of execution. 

Concurrency is more common than you might imagine. Because we're working with Java, _every_ program you write is concurrent, even a "Hello World!" program. Why?
<details>
<summary><B>Think, then click!</B></summary>

The garbage collector!

</details>

### Using concurrency to get what we want

Imagine logically splitting our big program into separate, independent "threads" of execution: one that runs the dispatcher, another that runs when a TA helps a student, and so on. We just need to separate them from each other, and help them communicate.

So far we've only had one thread: the one that starts up in our `main` method. How do we get another, and which should it correspond to?

<details>
<summary><B>Think, then click!</B></summary>

There are a few options. But let's start simply, and not try to solve _all_ the challenges at once. We'll have every TA correspond to their own thread, and have those threads woken up by the dispatcher.

</details>

### Runnables and Threads

Java has an interface called `Runnable`, which requires the implementation of a `run()` method. It's also got a class called `Thread`, which has a constructor that accepts a `Runnable` and a method called `start()`. So, as a first cut, let's make `TA` implement `Runnable`, and whenever we dispatch a student to that TA, we run the thread.

```java
public class TA implements Runnable {
    
    // ...
    
    public void seeStudent(Student student) throws TABusyException {
        if(helping != null)
            throw new TABusyException();
        helping = student;
        new Thread(this).start(); // NOT the same as .run()
    }

    // ...
    
    @Override
    public void run() {
        // help the student (simulate by pausing for 1.5 seconds -- we're VERY EFFICIENT)
        System.out.println(timestamp()+" "+name+ " says: Hello "+helping+"!");
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            System.out.println("Oops -- terminated!"); // not a great message
            System.exit(1);
        }
        System.out.println(timestamp()+" "+name+ " says: Goodbye "+helping+", I hope that helped!!");
        helping = null;

    }
}
```


Now, when we run, we'll see:

```
11:45:32 Dispatcher: Welcome to TA hours! Today we're discussing Concurrency
11:45:32 Dispatcher: Hi Nim; you'll be seen by Galen
11:45:32 Dispatcher: Hi Alice; you'll be seen by Jenny
11:45:32 Galen says: Hello Nim!
11:45:32 Jenny says: Hello Alice!
11:45:33 Jenny says: Goodbye Alice, I hope that helped!!
11:45:33 Galen says: Goodbye Nim, I hope that helped!!
11:45:33 Dispatcher: Hi Bob; you'll be seen by Jenny
11:45:33 Dispatcher: Hi Charli; you'll be seen by Galen
11:45:33 Jenny says: Hello Bob!
11:45:33 Galen says: Hello Charli!
11:45:35 Galen says: Goodbye Charli, I hope that helped!!
11:45:35 Jenny says: Goodbye Bob, I hope that helped!!
11:45:35 Dispatcher: Hi Boatswain; you'll be seen by Galen
11:45:35 Dispatcher: Hi Bucky; you'll be seen by Jenny
11:45:35 Galen says: Hello Boatswain!
11:45:35 Jenny says: Hello Bucky!
11:45:35 Dispatcher: Nobody waiting in queue, will check again in three seconds.
11:45:36 Jenny says: Goodbye Bucky, I hope that helped!!
11:45:36 Galen says: Goodbye Boatswain, I hope that helped!!
11:45:38 Dispatcher: Nobody waiting in queue, will check again in three seconds.
11:45:41 Dispatcher: Nobody waiting in queue, will check again in three seconds.
```

Much better! 

### Concurrency vs. Parallelism (Again)

The `TA` thread and the main thread really are running separately. It's not clear whether they are truly running _in parallel_, though: the operating system and Java runtime decide that, in part based on how many cores the hardware has available. 

## What Could Go Wrong?

Concurrency seems really powerful. But are there any risks associated with it? Let's investigate. 

Suppose we want to record how many students have been seen before the dispatcher terminates. One natural way to do this is by adding a `static` counter to the dispatcher class:

```java
static int studentsSeen = 0;
```

Now, every `TA` can increment this counter in its `run` method, when the student has been helped:

```java
HoursDispatcher.studentsSeen += 1;
```

If we tell the dispatcher to print this counter out, we'll see output like this at the end of the queue:

```
11:56:10 Dispatcher: Nobody waiting in queue, will check again in three seconds. So far we helped 6 students.
```

And indeed that's what we see. But let's see how this works _at scale_. Instead of using these names, we'll create a hundred TAs, and a few thousand students who need to be helped! To keep things simple, we'll just have one queue of students.

```java
List<Student> oneQueue = new ArrayList<>();
final int numStudents = 30000;
final int numTas = 1000;
for(int i = 1;i<=numStudents; i++)
    oneQueue.add(new Student("Student"+i));
HoursDispatcher dispatcher = new HoursDispatcher(oneQueue.iterator(), "Concurrency 2");
for(int i = 1;i<=numTas;i++)
    dispatcher.addTA(new TA("TA"+i), 120);
dispatcher.dispatch();
```

So that we can simulate helping so many students without waiting, let's reduce the delay time to help a student: students will be helped instantaneously! We'll also remove the printing in the `TA` class, since that slows things down. 

We might see something like this:

```12:10:52 Dispatcher: Nobody waiting in queue, will check again in three seconds. So far we helped 299993 students.```

Uh oh.

What's going on? (By the way, this issue might be less likely to happen if we left the printing in.)

<details>
<summary>Think, then click!</summary>

I've made the classic _thread safety_ mistake. Incrementing that counter isn't _atomic_: two threads might be trying to edit it at once. Suppose they both fetch the current value at once, add 1 to that value, and then write. If that sequene of operations happens, the counter will only be increased by one.
</details>
</br>

This sort of issue is _pervasive_ in multi-threaded programming. Do the reading---you'll save yourselves a lot of pain.

## How Can We Fix This?

The first approach is old-school synchronization:

```java
synchronized (HoursDispatcher.class) {
    HoursDispatcher.studentsSeen += 1;
}
```

This will tell Java that only one `TA` can be running that increment operation at a time. (The argument to `synchronized` helps disambiguate between multiple dimensions of synchronization we might have happening).

Another approach is to use _thread safe objects_ from Java's standard library. In particular, I could have used an `AtomicInteger` for the counter:

```java
static AtomicInteger studentsSeen = new AtomicInteger(0);

...
    
HoursDispatcher.studentsSeen.incrementAndGet();
```


Both of these approaches fix the problem.

## More Concurrency Tips <A name="tips"></A>

There are many, many ways to manage concurrency in Java and other languages. Next time we'll introduce the _future/promise_ approach, which is made simpler in TypeScript via the `async` and `await` keywords.

There's another file, [ThreadPoolDemo.java](https://github.com/tnelson/cs32-livecode/blob/main/src/main/java/edu/brown/cs32/fall21/Oct12Prep/ThreadPoolDemo.java), in the livecode repo that demonstrates another way of working with threads in Java that's very well suited to applications where you need to carve up a lot of work (which you hope to parallelize across multiple cores) or don't yet know how much work you have to do. We won't cover it in lecture, but it could be a useful example for you on your projects.

