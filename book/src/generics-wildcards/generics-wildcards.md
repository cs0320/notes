# Generics with Wildcards, Typecasting, and Narrowing

I responded at length to [an Ed post about typecasting](https://edstem.org/us/courses/59996/discussion/5394626) yesterday, and I'd like to spend today talking about related issues. We'll break this down into 3 parts:
* Subtleties with generics in Java 
* Typecasting isn't always bad
* Narrowing in TypeScript 

## Making Sense of Generics: the LSP

Let's start with a puzzle about subtyping. We know that `Object` is a supertype of `Number`, which is a supertype of `Integer`. One thing this buys us is that we can plug in something with `Number` type anywhere an `Object` is expected, or pass an `Integer` to a method that accepts `Numbers`. 

How does this work with generic types? Here's a method: 

```java
static Number sumAll(Collection<Number> numbers) {
        int sum = 0;
        for(Number num : numbers) {
            sum += num.intValue(); // "may involve rounding or truncation"
        }
        return sum;
}
```

### Which types work to store the result of `sumAll`?

The method by itself typechecks just fine. Now let's call `sumAll`. We'll start by giving it an empty collection of numbers, and saving the result to a variable. _What types of variable can we store the return value of `sumAll` in?_ Concretely, which of the 3 assignments below do you expect to produce a type error?


```java
    Collection<Number> someNums = new HashSet<>();
    Number aNumber = sumAll(someNums);    // ?
    Integer anInteger = sumAll(someNums); // ?
    Object anObject = sumAll(someNums);   // ?

```

<details>
<summary><B>Think, then click!</B></summary>

`Number` and `Object` both work OK, but `Integer` produces a type error. This is perhaps what we expected: after all, that's how subtyping works in languages like Java! The type system doesn't have enough info to know that the return value is always an `Integer` (although it _is_), and so it forces us to use variables of a less-specific type.

</details>
<BR/>

### Which types work as arguments to `sumAll`?

Now suppose we have 3 `Collection` objects we could pass in to `sumAll`. Keeping in mind the result of the last experiment, which of these do you expect to work?

```java
    Collection<Number> someNums = new HashSet<>();
    Collection<Integer> someInts = new HashSet<>();
    Collection<Object> someObjects = new HashSet<>();
    
    sumAll(someNums);     // ?
    sumAll(someInts);     // ?
    sumAll(someObjects);  // ?
```

<details>
<summary><B>Think, then click!</B></summary>

Only `someNums`, the `Collection<Number>`, works. Both of the others produce a type error. 

In spite of the fact that `Integer` _is_ a subtype of `Number`, `Collection<Integer>` is not a subtype of `Collection<Number>`. The same goes for `List`, `Set`, and so on. 

</details>
<BR/>


### Wait, what?

Why do you think this is the case? Is Java's type checker just bad? 

One way to explore whether or not this behavior is reasonable is to experiment. Suppose that Java had let us use a `Collection<Integer>` as a subtype of `Collection<Number>`. Can you write a program that would then produce a run-time type error? (Hint: you don't need more than a 2 or 3 lines; you don't even need to use the `someAll` function.)

<details>
<summary><B>Think, then click!</B></summary>

Here's one: 

```java
someNums = someInts; // the problematic line
someNums.add(Math.PI); // adding a Number to a collection of Numbers
for(int i : someInts) {
    System.out.println(Integer.numberOfLeadingZeros(i));
}
```

</details>
<BR/>

This is why Java does what it does. But sometimes we really do want to accept "a set of any kind of number" without knowing in advance exactly which type it is. And this is where generics become a little bit more complex. Before we start, I want to cover a rule that can _really_ help clear up confusion about generic types. It's called the Liskov Substitution Principle or LSP. You can look up the full LSP if you want, but here I'm going to put a particular spin on it:

> If you're able to safely use an object of type $T$ someplace, you should also be able to safely use an object of type $S$, where $S$ is a subtype of $T$. 

This is the guiding principle that the above example violates, and it's worth keeping in mind as you work with generics in the future.   


### Type variables and Wildcards

Let's get more concrete. What if we were trying to write the type for a sorting function? All we'd like to depend on is that elements of the type are comparable to other elements of that type:

```java
public static <T extends Comparable<T>> void sortSomeRecords(List<T> lst)
```

Hopefully the above example motivates why we needed the type variable: _any_ kind of `Comparable` will do, so long as it can compare against its own type.

Java also allows 
_wildcard_ type variables, which are written `?`. A wildcard represents a type variable that won't be used elsewhere, so doesn't require a unique name. But we couldn't have used a wildcard here, since we needed `T` both to say what type to compare against, and to label the argument.

Java's standard library sorting function, however, uses both a type variable and a wildcard:

```java
public static <T extends Comparable<? super T>> void sort(List<T> list)
```

This allows `T` to implement comparisons against any of its supertypes. (By the way, the bit declaring `T` isn't part of the return type; it's just a note to the type checker.)

### What a variable means

Here are some things to try:

```java
someNums.add(1);    // setup (works)
someNums.add(1.5);  // setup (works)

Collection< ? extends Number> someNums2 = new HashSet<>();  // ?
someNums2.add(1);       // ?
someNums2.add(1.5);     // ?
someNums2.add(null);    // ?
someNums2 = someNums;   // ?
```

What's going on?

<details>
<summary><B>Think, then click!</B></summary>

`? extends Number` does not mean "a list of objects which all extend `Number`". It means "a list of objects of _one single type_, where that type extends number".

We can assign `someNums` to `someNums2` because `someNums` is a collection of `Number` (which fits into the wildcard). But we cannot add an `Integer` to `someNums2`, not even if we try to typecast. 

Why? Because we could have assigned `someInts` to `someNums2` instead, or `someDoubles` or `someFloats`! Java has no guarantee (at least, not without a far more sophisticated and time-consuming code-crawl) that it will be safe to add an integer to whatever `someNums2` references. 


</details>
<BR/>

## Typecasting 

You may have learned in the past that "typecasting is bad". To be clear, there are two operators involved in this general sentiment, each of which do different things:

**Actual typecasting, sometimes called "downcasting", e.g.:**

```java
List<Integer> lst = new ArrayList<>();
ArrayList<Integer> alist = (ArrayList<Integer>) lst; 
```

Here we are telling Java that _we know_ what type `lst` is, and to trust us when we try to put a reference of type `List` into a reference of type `ArrayList`. In this example, we have a good reason to be confident. But in general, it's a somewhat dangerous thing to do. 

**Checking the type of an object, e.g.:**

```java 
if(lst instanceof ArrayList) {
    System.out.println("It's an array list!")
}
```

Both of these are often frowned on in intro courses, outside of places like defining `equals()` and `hashCode()` for a new class. But what makes those uses OK, and other uses not OK? Let's first identify a few reasons why these might cause trouble. 

* Typecasting is forcing the type system to believe something, even if it's not true. *So you'd better be sure it's true!* Usually we'd do this with an `instanceof` check right before the cast.
* Using `instanceof` with typecasting isn't exhaustive by default; you can write tests using `instanceof` and cast within an `if`, but it's easy for the `else` case to gloss over new possibilities that get added later, causing silent bugs. 
* Typecasting can sometimes indicate bad issues with design, especially OO design. E.g., if you aren't properly using polymorphism with interfaces or superclasses, you might need to know the implementation class so you can call specific methods. This would have been the case if you'd needed to typecast in your CSV parser on Sprint 1.1, because generics and polymorphism should be enough there. But such situations aren't the entirety of all use cases for casting. Many are valid (and again, Java's library uses it more than you'd expect). 

You have enough experience now to ask yourself: do I _need_ to typecast here? Are there any alternatives? This doesn't mean that we won't give you feedback or say "needs improvement" if you decide to use typecasting. Quite the opposite; I hope we can give you feedback if you're using it incorrectly! But sometimes casting and `instanceof` are what you need to get the job done. Let's look at an example. 

Suppose you're calling an external library method, which might throw either of two different exceptions. If the library doesn't give you any help in disambiguating them, and you need to treat them differently, what else can you do but use `instanceof`? 

```java
abstract class SpecialException extends Exception {}
/** This exception type should be translated to different abstraction */
class SomeExceptionToChange extends SpecialException {}
/** This exception type should be logged and execution should continue */
class SomeExceptionToLog extends SpecialException {}

public class CastingExample {

    /** Which will it throw? Who knows! */
    static void doSomething() throws SpecialException {
        if(Math.random() > 0.5) {
            throw new SomeExceptionToChange();
        } else {
            throw new SomeExceptionToLog();
        }
    }

    public static void main(String[] args) {
        try {
            doSomething();
        } catch(SpecialException e) {
            // What can we do here?
        }
    }
}
```

## Narrowing 

(See the lecture capture; we demoed narrowing in the union-types example from last time.)

## (Supplemental / to be moved) Fuzz Testing

Let's think about unit-testing on your CSV sprint. 

### Generating Test Inputs

What do you think is harder to think of: test _inputs_ or the corresponding _outputs_?

Usually it's the inputs that are harder, because they require clever thinking about the space of inputs. Outputs are often (although not always) an exercise in running the program in your mind.

Where else might we find test inputs, and what problems might occur with each source?

- someone else's tests? (same human biases, but ok, could help)
- monitor a real system (good idea; possibly different biases? overfitting to their use-case? may be ok, may not. could be expensive or affect performance.)
- random generation? (possibly a lot of weird values that aren't really reflective of reality, what's the distribution...?)

Let's build on the "random test generation" idea. Suppose we could randomly generate inputs. What could we do with them? 

The simplest, but still incredibly powerful, technique is to probe for crashes. Just keep feeding the system random inputs and, if your generator is good, you're likely to eventually find those bizarre corner cases that lead to surprising exceptions. 

You don't need to do this in JUnit, or have a `Test` annotation or anything like that. We're just experimenting with the idea of fuzzing.

### What's a "surprising exception"?

There's a bit of a caveat here. Sometimes programs are _supposed_ to throw an exception on certain inputs. Maybe the specification says that, "for input integers less than zero, the method throws `UnsupportedOperationException`". Then fuzzing is a bit more involved than trying to provoke _any_ exception. Instead, you might only look for exceptions like `NullPointerException` or other signals that indicate a bug, rather than a legitimate specified result.

### Takeaway

This might seem like a strange technique. But, in truth, it's used pretty commonly in industry where crash bugs are expensive, highly impactful, or affect many people. (Think: operating systems, device drivers, and cloud infrastructure, to name a few.)

And, by the way: **not all the inputs need to be random!** You can still have deviously crafted inputs hard-coded; just include them at the beginning before you start random generation. This is true of everything else we do with random inputs.

Here's an example from my solution to CSV.  

```java
final static int NUM_TRIALS = 100;
final static int MAX_STARS = 100;

/**
 * The throws clause for this method is immaterial; JUnit will 
 * fail the test if any exception is thrown unless it's marked 
 * *expected* inside the @Test annotation or it's explicitly 
 * part of an assertion.
 */

@Test
public void fuzzTestStars() throws EndOfCSVException {
    for(int counter=0;counter<NUM_TRIALS;counter++) {
        // This helper produces a random CSV-formatted string
        // that contains a set of encoded Star objects
        String csvString = TestHelpers.getRandomStarCSV(MAX_STARS);
       
        // Note use of StringReader here, not FileReader
        // Allowing /any/ Reader makes testing easier.
        Reader csv = new StringReader(csvString);
        List<Star> stars = GenericCSVParser.parseFrom(csv, new StarFactory());

        // Fuzz testing -- just expect no exceptions, termination, ...
    }
}
```

We could improve this code in at least one big way. It's fixated on producing random CSV data for `Star` objects, and so we're not testing other kinds of random data. Still, **this actually found a bug in my parser while I was developing it: I wasn't properly handling the behavior of my parser iterator if the file was empty**.

<!-- NOTE: removed MBT and kd-tree context, see Spring 2022 notes for this -->

### Aside on Implementing Random Generators

In Java, I like to use `java.util.concurrent.ThreadLocalRandom`, since it lets me produce many different random types. E.g.:

```java
final ThreadLocalRandom r = ThreadLocalRandom.current();
long id = r.nextLong();
double x = r.nextDouble(Double.MIN_VALUE, Double.MAX_VALUE);
```

To generate random strings, we can generate a random array of bytes, and convert that to a string. E.g.:

```java
byte[] bytes = new byte[length];
r.nextBytes(bytes);
String name = new String(bytes, Charset.forName("UTF-8"));    
```

There's a limitation here. This does not guarantee an alpha-numeric string, or anything even remotely readable. Beware, since it might also contain control characters that will mess up some terminals if you print them! 

Moreover, since this string is UTF-8 encoded, it won't be able to contain most unicode characters, so we're focusing heavily on Latin characters. Fortunately, you can get more wide-ranging character sets with some quick changes. 

There's a "random testing" badge in 0320, so we'll be talking about this idea much more in the future. For now, keep in mind that not all tests need to be input-output pairs.

**QUICK DISCUSSION**: What's something you've written in _another_ class here at Brown that would be well-suited to fuzz testing?
