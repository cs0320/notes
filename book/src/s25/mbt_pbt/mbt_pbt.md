# Software as Hammer, MBT/PBT

~~~admonish warning title="Spring 2025"
While these notes are still useful, and contain similar content to what we'll do in class this semester, they were the Fall 2024 version. For Spring, I wanted to provide this resource _and also_ a more "real", live version of the ideas in TypeScript, using LLMs some. You can find Spring 2025's livecode here:
* [March 13](https://github.com/cs0320/class-livecode/tree/main/S25/mar13_mbt_llm): "nearest neighbor", naive reference version and (buggy) LLM-generated version.
* [March 18](): hasn't happened yet!
~~~

## Is Software Like a Hammer?

Let's start with a short discussion.

Some have said that software is like a hammer: it's a morally neutral tool that can be used for either good or evil. You can build a house with a hammer, or you can commit murder. 

#### Discussion: What do you think about this?

It's an appealing argument! In some ways, software might indeed be viewed as morally neutral. But, personally, I think that the "hammer" analogy is too glib. 

My father was a carpenter, and we had a [table saw](https://en.wikipedia.org/wiki/Table_saw) in our garage. A table saw is a terrifying piece of machinery; it's got a large rotary blade that slices through wood as you push it along the table. It's also a _complex_ piece of machinery: there are various levers and dials to control the height of the blade and other factors, but also numerous safety features. Dad's didn't have as many as modern saws have, but there was still an emergency stop button and a blade guard.

My point is: software isn't a hammer. Software is more like a table saw. If you don't think about safety when you design a table saw, people are going to get badly hurt. Yeah, you can still hurt yourself with a hammer (I have, multiple times). But the greater the degree of potential harm, the more careful thought and added safety-features are called for. 

So don't get lured in by "software is like a hammer" statements. Something can be morally neutral in itself and still warrant careful design for safety (or a decision not to make it at all). There's a quote from Robert Oppenheimer I like, from the ["personnel hearing"](https://www.osti.gov/opennet/hearing) in which he lost his clearance:

> "When you see something that is technically sweet, you go ahead and do it and argue about what to do about it only after you’ve had your technical success. That is the way it was with the atomic bomb."




## Fuzz Testing

Let's think about unit-testing something like your CSV parser or searcher.

### Generating Test Inputs

What do you think is harder to think of: test _inputs_ or the corresponding _outputs_?

Usually it's the inputs that are harder, because they require clever thinking about the space of inputs. Outputs are often (although not always) an exercise in running the program in your mind.

Where else might we find test inputs, and what problems might occur with each source?

- someone else's tests? (same human biases, but ok, could help)
- monitor a real system (good idea; possibly different biases? overfitting to their use-case? may be ok, may not. could be expensive or affect performance.)
- random generation? (possibly a lot of weird values that aren't really reflective of reality, what's the distribution...?)

Let's build on the "random test generation" idea. Suppose we could randomly generate inputs. What could we do with them? 

The simplest, but still incredibly powerful, technique is to probe for crashes. Just keep feeding the system random inputs and, if your generator is good, you're likely to eventually find those bizarre corner cases that lead to surprising exceptions. 

You don't need to do this in JUnit, or have a `Test` annotation or anything like that. We're just experimenting with the idea of fuzzing. And, of course, this isn't about Java; you can do the same in any language!

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
 
## Beyond Fuzz Testing

We can do a lot more with this idea of random inputs. But to do so, we need a broader view of what "testing" means. 

In fuzz testing, we didn't pay much attention to the _output_ of the program. We just checked that it didn't raise an exception. The problem with doing more is that, if we've got *randomly*-generated inputs, we can't pair them with *manually*-generated outputs. So now the question is: where can we get "correct" outputs from?

What if we had a known-good baseline implementation we were trying to optimize? 
Consider building one of those clever, super-optimized implementations of a basic arithmetic function. These matter in a lot of domains (e.g. graphics). Suppose you're testing:

```java=
float fastFloor(float value) {
    // ...
}
```

How long do you think it would take to loop through every possible primitive 32-bit `float` value, and check whether or not `fastFloor` returns the same value as `Math.floor`?

<details>
<summary>Think, then click!</summary>

About 90 seconds, and that's on a computer from several years ago. [Several years ago.](https://randomascii.wordpress.com/2014/01/27/theres-only-four-billion-floatsso-test-them-all/)

</details>

Here, we don't even need random inputs! Of course, if the function took 64-bit `double` values, the story would be different, because there are too many of those to loop through exhaustively in a reasonable timeframe. So, in that case, we'd fall back to checking random inputs.

### Model Based Testing

_Model-based Testing_ uses a separate artifact as either an "oracle of correctness" or a means of guiding random input generation. 

To see what we did in Java last semester (Fall 2024) see [the livecode](https://github.com/cs0320/class-livecode/tree/main/F24/oct29_mbt_pbt), where we'll test my implementation of bubble sort. Concretely:
* My bubble-sort method is the *program under test*. We want to evaluate whether or not it is correct.
* Java's standard `Collections.sort` method is the *known-good* artifact. It will serve as our oracle of correctness.

**Something very important has just happened. Pay attention!**

### What just happened?

We have stopped talking about testing against _specific outputs_, and have started testing more abstract _properties_ of outputs. In fuzz testing, the property was "doesn't crash". For (this type of) model-based testing, we want to check whether the output lists are exactly the same. But we don't need to encode a specific output, which lets us use randomness to generate inputs and mine for bugs while we sleep.

Other kinds of model-based testing include using modeling languages to sketch desired behavior, or using something like a state machine model to generate traces of user interactions to test (e.g.) data structures or user interfaces.

### Be Careful!

How you choose to use the oracle matters. Using _equality_ to compare a result from the oracle and a result from the implementation under test is great sometimes, but not always. To see why, try randomly generating more than just integers&mdash;in particular, try records. The code is in the repository. What happens, and why? 

<details>
<summary>Think, then click!</summary>

Our comparison fails! The Java-library `sort` and my bubble sort implementation disagree on something. But this disagreement can only happen for more complicated data than integers. Here's an example:

```
org.opentest4j.AssertionFailedError: 
Expected :[Student[id=-4, credits=0], Student[id=5, credits=5], Student[id=5, credits=-4]]
Actual   :[Student[id=-4, credits=0], Student[id=5, credits=-4], Student[id=5, credits=5]]
```

We have two students who, by the definition of our `compare` method, ought to be considered equal: they have the same student ID! (Note that this is regardless of whether we implemented `.equal` for the record type.) But the two sorts produced different _sub_-orderings for those students. One of these sorts is a _stable_ sort: it preserves the original order of equal elements. The other is not, and may re-order equal elements. 

And yet, both sorts are correct (assuming we didn't require the sort to be stable). 

This problem comes up frequently. Whenever you have a problem that has more than one correct answer, direct comparison of results is perilous. Consider basically every graph or optimization problem: shortest path, change-making, graph coloring, optimal scheduling, ... They all often have multiple correct answers. We'll call these _relational_ problems, because one input can correspond to more than one correct output.

</details>

So how do we deal with this issue? By broadening the way we think about correctness.

## Property-Based Testing 

What makes a sorting implementation _correct_? Let's set aside oracles like alternative implementations and models. What makes us look at an output and say "yes, that's right" given an input? 

<details>
<summary>Think, then click!</summary>

Here are some properties: 
* the output is sorted;
* the output has the same elements as the input. 

We touched on this briefly before, but let's be more concrete about what we mean by "the same elements". Really, we mean that the input is a permutation of the output. We need to be precise, since we're about to write a Java method that checks for these properties!

</details>

If we can write a set of properties as a method, we can just use that as our oracle! Try filling this in, reflecting the properties we want from a correct sort.  

```java 
// uncomment the test annotation to enable the test
    // @Test
    public void pbtSortStudentRecords() {
        long numIterations = 10000;

        for(int trial=0;trial<numIterations;trial++) {
            List<Student> input = randomStudentList(3, -5, 5);
            List<Student> output = new ArrayList<>(items);
            ExampleSort.bubbleSort(output);    

            // What makes a sort _correct_?
            // EXERCISE: Write some code that compares `input` and `output` in a 
            // property-focused way, not via direct comparison.
        }
    }
```

This powerful technique is called _property-based testing_. 

~~~admonish note title="Further Reading"
Tim has a paper about teaching PBT, which you can check out [here](https://cs.brown.edu/~tbn/publications/wnk-pj20-pbt.pdf) if you're interested.

There are also many, many PBT libraries that help with random input generation. For example, if you use Python, [Hypothesis](https://hypothesis.readthedocs.io/en/latest/) is great. For other languages, look for the phrase "QuickCheck", which is the name of the original PBT library, which was written for Haskell. For better or worse, Java has _multiple_ such libraries.
~~~

## What's the takeaway?

Two things:

First, randomly generating test inputs is practical and, if done well, powerful. You can use this to mine for bugs while doing other things. 

Second, in situations where there are _multiple correct answers_ a program might give, the traditional, `actual_output == expected_output` mode of testing is risky at best. You'll be over-fitting your test suite to whatever your implementation produces today. Then someone comes along and makes a small change, and the program remains correct but a bunch of test cases suddenly break. We can use model-based and property-based testing to avoid that problem. 

Broaden your perspective on testing, and you become a better developer.

