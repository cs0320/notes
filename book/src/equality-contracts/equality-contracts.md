# sp24.3: Equality in Java, Contracts
## Logistics

* If you're finding user stories 2 and 3 challenging, that's _normal_. Many students do not obtain all badges on CSV. 
* I'm going to start the required in-class exercises sometime next week. If you're sick, traveling, etc. for a day or two, don't worry about mailing me; this is meant to be a lightweight thing. If you're out for *many* days, do reach out for accommodations. Otherwise, come to class and do the exercises.
* When you are serving as a partner in collab section, you're prioritizing _others'_ issues, but keep in mind:
  * you may (collaboratively!) work on your own issues; and
  * you can attend collab section as often as you want. 
* If you're not reading the notes or using the livecode, you're missing what might be useful advice for the sprints. For example, today I am not going to run through the full testing discussion at the start of these notes; you're responsible for reading it.

If you haven't cloned the [livecode repo](https://github.com/cs0320/class-livecode), you need to do so **NOW**. Once you've cloned it, just run `git pull` in the repository before class, and you'll get my updates. Change anything you want; you don't have permission to push, so you can't ever mess up. Just re-clone and start over if needed!

~~~admonish warning title="Opening a Maven Project in IntelliJ" 
Make sure you open the `pom.xml` file, not the directory. If you don't do this, IntelliJ will create a project without Maven. You want it to be aware that this is a Maven project so it will automatically obtain dependencies. 
~~~

## Today's Testing Lesson: Representation vs. Domain 
Back in 2019, engineers at Apple had to deal with a major security bug in Facetime, the video-chat app that many iOS users use. It seems to have been reported earliest on  [Twitter](https://twitter.com/MGT7500/status/1087171594756083713), but Apple didn't immediately (appear to) take the problem seriously. This isn't a class on PR or management, so we won't follow that line of discussion much further. 

The bug worked like this: suppose you wanted to spy on one of your Facetime contacts. You could start a video call with that contact, and then use "add a person" to invite your own number to the call. Now, even though your contact would see the invite, their microphone would be on, and sending you everything.  It turns out that, depending on whether and how the contact dismissed the call, their video could end up on as well!

Ouch. 

How did Apple miss this? We don't know, but we can speculate on the kinds of tests they didn't have in place. 

Suppose that you were responsible for testing "add a person" in an app like Facetime. Concretely, you might try to add any arbitrary phone number. What kinds of phone-number inputs should you test? Keep in mind both the domain and boundary conditions.

<details>
<summary><B>Think, then click!</B></summary>

* toll-free numbers;
* premium numbers (there are scams that trick people into dialing these);
* the operator (0); 
* emergency services (are these always the same in every country?);
* information and other special services;
* reserved phone numbers;
* in the U.S., same exchange vs. same area code vs. long-distance;
* local numbers outside the U.S. standard format;
* international connections; and even
* **this device's number!**
</details>
<br/>

Again, this list isn't anywhere near exhaustive. But do you notice something important here? 

<details>
<summary><B>Think, then click!</B></summary>
The inputs are numbers, and so if they happen to be represented internally as a number, you should also test the usual things you'd test for numbers (zero, something positive, MAXINT, ...). If they are represented as a String, perhaps there are similar things to test. 
        
But the added domain, that is, the fact that these are <i>phone</i> numbers, adds a lot more structure to the problem that you should exploit when writing tests.
</details>
<br/>

Don't forget that your inputs have both an internal <i>representation</i> and a <i>domain-specific meaning</i>. Keep both in mind while you're testing.

Now I'd like to do some live-coding!

## Equality in Java, Contracts

One of the first things you should do when learning a new programming language is figure out the rules of _equality_. Many languages even have multiple notions of equality (e.g., `==` vs. `equals` in Java, or `==` vs. `===` in TypeScript). 

Today we're going to dive into a few reasons why equality is complex in Java. The lessons here will affect work you do in future sprints, especially where defensive programming is concerned.

Start by pulling the livecode repository, and opening the `S24/feb01-equality/pom.xml` file as a project in IntelliJ.

### Reviewing Equality in Java (with some new insights)

Let's proceed with a series of experiments. We'll record them in the `Main` class, so we can see the demo progressing. Each of these blocks can go in its own method, or we can just paste each into `main`. To make this easier to follow, I've defined a helper method called `print`.

#### String Equality

```java
String s1 = "hi";
String s2 = "hi";
print("s1 == s2", s1 == s2);
```

IntelliJ complains about this, telling us to use `.equals` to compare Strings. But why? ``==`` seems to work fine in this example. 

Both strings here are "literals": they're given to the compiler as part of the source code, directly. What if we tried constructing some strings?


```java
String h = "h";
String i = "i";
String hi = h + i;
print("s1 == hi", s1 == hi);
```

What's going on? The JVM automatically ensures there is only ever one copy of any string literal in memory. A string literal is a quote-delimited string constant like "hi", "h", and "i" above. So the variables `s1` and `s2` refer to the same object in memory, because of this hidden work by the JVM.

But the String object that `hi` refers to is constructed from two string literals; it is not itself a string literal. Put another way, the String object that `hi` refers to comes from computation, rather than just being a constant in this source file. It's a _different object_, and so it's not `==` to `s1.`

**Lesson:** It's just not safe to compare Java strings using `==`, because the JVM can and will allow multiple equivalent strings to exist simultaneously, and `==` checks whether the objects *are the same object*. Fortunately, `.equals` gives us what we need automatically:
    
```java    
print("s1.equals(hi)", s1.equals(hi));
```

This is because the `String` class in Java defines its own `equals` method that checks for equivalent contents, rather than identical objects. 

Here's an example I like using. I've got a copy of Effective Java in my office. Suppose I ask you the question: "Do you have this book?" To answer, you need to know what I mean:
* do I just want to make sure you have an equivalent book---same title, same author, edition, etc.?
* do I want to make sure you give me back the book I've lent you?

One of these is best implemented via `.equals` in a `Book` class that implements it. The other, where I'm really interested in _this book_, we would use `==`.

#### Integer Equality

Types like `int` are _primitive_ in Java; they aren't objects. This means we can compare primitive types, like `int`, using `==` safely: 

```java
int five = 5;
int six = 6;
int elevenA = five + six;
int elevenB = 11;
// 11 is always 11
print("elevenA == elevenB", elevenA == elevenB);
```

This becomes more complicated for "wrapper" classes, like `Integer`. IntelliJ will complain about this also, but it's useful as a demonstration:

```java
Integer fiveI = Integer.valueOf(5);
Integer sixI = Integer.valueOf(6);
Integer elevenObjectA = fiveI + sixI;
Integer elevenObjectB = Integer.valueOf(11);
print("elevenObjectA == elevenObjectB", elevenObjectA == elevenObjectB);
```

What do you think might be happening here?

<details>
<summary>Think, then click!</summary>

These are `==` because the JVM does another hidden thing: for values between `-128` and `127` inclusive, `Integer.valueOf(v)` always returns a single canonical Integer object reference. Even if we switch to implicit conversion, and write something like `Integer fiveI = 5`, this calls `Integer.valueOf` under the hood.
    
</details>

To see this in effect, let's change the values:

```java
Integer twoHundredObject = Integer.valueOf(200);
Integer twoHundredElevenObjectA = twoHundredObject + elevenObjectA;
Integer twoHundredElevenObjectB = Integer.valueOf(211);
print("twoHundredElevenObjectA == twoHundredElevenObjectB", twoHundredElevenObjectA == twoHundredElevenObjectB);
```

And, again, `.equals` gives us what we need, because it's been defined by the `Integer` wrapper class:
        
```java
print("twoHundredElevenObjectA.equals(twoHundredElevenObjectB)", twoHundredElevenObjectA.equals(twoHundredElevenObjectB));
```

*Don't* confuse the primitive datatypes with their wrapper classes. You'll often need to use wrappers---e.g., if you want a `Map` with integer keys and values, you'll need to use `Map<Integer, Integer>`; `Map<int,int>` won't work. The `Map` interface is defined in terms of _objects_!

#### What Can Go Wrong: Lists Example

Let's say we have a class meant to store X-Y coordinates:

```java

/**
 * A point in 2-dimensional space.
 */
public class Point {
    final double x;
    final double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double x() { return x; }
    public double y() { return y; }
}
```

Notice that we haven't overridden `equals` in this class. The method will still be defined, but it will come from the parent class: `Object`.  Thus, because `equals` is doing object comparison, two different `Point` objects containing identical data aren't `==``:

```java    
Point originA = new Point(0, 0);
Point originB = new Point(0, 0);
print("originA == originB", originA == originB);
```

We can write code that checks all their fields---assuming they're accessible, either directly or via getters:

```java
print("originA vs. originB fields", originA.x() == originB.x() && originA.y() == originB.y());
```

This becomes a huge bother when there are many fields, and it relies on their values being accessible, reliable, consistent, etc. Worse, many built-in data structures rely on `equals` to decide (among other things) membership:

```java
List<Point> points = List.of(originA);
// They are different objects! originB *isn't in the set*.
print("points.contains(originB)", points.contains(originB));
```

Collections like `List` tend to use `.equal`, not `==`, but because we didn't override `equal`, the data structure ends up using object equality anyway. 

Ok, so let's make a new class, `PointWithEquals`, that actually overrides the `equal` method:

```java
PointWithEquals originC = new PointWithEquals(0, 0);
PointWithEquals originD = new PointWithEquals(0, 0);

// Now that we've defined .equals() properly...
print("originD.equals(originC)", originD.equals(originC));
List<PointWithEquals> betterPoints = List.of(originC);
print("betterPoints.contains(originD)", betterPoints.contains(originD));
```

#### What Can Go Wrong: Sets and Maps Example

Let's try to use this new, more robust class---except with a `HashSet` this time:


```java
Set<PointWithEquals> betterPoints = new HashSet<>();
PointWithEquals originC = new PointWithEquals(0, 0);
PointWithEquals originD = new PointWithEquals(0, 0);
betterPoints.add(originC);
print("betterPoints.contains(originD)", betterPoints.contains(originD));
```

Why is this `HashMap` returning `false`, when the `List` in the previous example returned true? Let's investigate...

```java
betterPoints.add(originD);
System.out.println("betterPoints.size(): "+betterPoints.size());
```

The set is treating them as different objects, even though they are `.equal`! What's going on?

<details>
<summary>Think, then click!</summary>

Checking for membership in a HashSet happens in two stages:
* what is in the set with the same hash value as the object we're searching for?
* are any of them `.equals` to the object we're searching for?

We didn't redefine `hashCode` for our second point class, just `equals`.    
</details>

If we make a third class, `PointWithBoth`, that overrides both methods, the set will report the results we expect:

```java
Set<PointWithBoth> evenBetterPoints = new HashSet<>();
PointWithBoth originE = new PointWithBoth(0, 0);
PointWithBoth originF = new PointWithBoth(0, 0);
evenBetterPoints.add(originE);
print("evenBetterPoints.contains(originF)", evenBetterPoints.contains(originF));
```

### What Makes An `equals()` Method "Good"?

Consider the (IntelliJ-generated!) methods in the 2nd and 3rd point classes. How do we know they are correct? What could have gone wrong? In short: what do you think should be true of _any_ `equals` method we write?

Here's one example to get us started: `a.equals(a)` should return `true` for any object `a`. What else is there?

Rather than trusting _me_ to get it right, let's go straight to the authority. Open up [the JavaDocs for Object.equals](https://docs.oracle.com/javase/7/docs/api/java/lang/Object.html#equals(java.lang.Object)) in Java. You'll see:

>The equals method implements an equivalence relation on non-null object references:
>
>It is reflexive: for any non-null reference value x, x.equals(x) should return true.
>It is symmetric: for any non-null reference values x and y, x.equals(y) should return true if and only if y.equals(x) returns true.
>It is transitive: for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) should return true.
>It is consistent: for any non-null reference values x and y, multiple invocations of x.equals(y) consistently return true or consistently return false, provided no information used in equals comparisons on the objects is modified.
>For any non-null reference value x, x.equals(null) should return false.
>The equals method for class Object implements the most discriminating possible equivalence relation on objects; that is, for any non-null reference values x and y, this method returns true if and only if x and y refer to the same object (x == y has the value true).
>
>Note that it is generally necessary to override the hashCode method whenever this method is overridden, so as to maintain the general contract for the hashCode method, which states that equal objects must have equal hash codes.

This is called a _contract_ on the method. The documentation for `Object` is saying: if you extend this class, and you wrote your own `equals` method, you'd better make sure the following is true.

**Exercise:** try to come up with a situation where breaking one of these requirements would result in buggy behavior. You may use built-in data structures for these examples, or not, as you wish. 

## Takeaways

Java's `record`s automatically define `equals` and `hashCode` for you---assuming that you wanted all fields of the record to be included in calculating these. This is one of many ways they are convenient. (Unfortunately, you can't have a `record` extend another to add more fields.)

**Documenting the expectations** you have for anyone using, or extending, your classes is not just best practice; it will save real time and frustration. Similarly, be willing to glance at the documentation for methods you're using---you might be surprised what you find.

All of this will be important for how we evaluate your work in future sprints.



