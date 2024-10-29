# Software as Hammer, MBT/PBT

## Is Software Like a Hammer?

Let's start with a short discussion.

Some have said that software is like a hammer: it's a morally neutral tool that can be used for either good or evil. You can build a house with a hammer, or you can commit murder. 

#### Discussion: What do you think about this?

It's an appealing argument! In some ways, software might indeed be viewed as morally neutral. But, personally, I think that the "hammer" analogy is too glib. 

My father was a carpenter, and we had a [table saw](https://en.wikipedia.org/wiki/Table_saw) in our garage. A table saw is a terrifying piece of machinery; it's got a large rotary blade that slices through wood as you push it along the table. It's also a _complex_ piece of machinery: there are various levers and dials to control the height of the blade and other factors, but also numerous safety features. Dad's didn't have as many as modern saws have, but there was still an emergency stop button and a blade guard.

My point is: software isn't a hammer. Software is more like a table saw. If you don't think about safety when you design a table saw, people are going to get badly hurt. Yeah, you can still hurt yourself with a hammer (I have, multiple times). But the greater the degree of potential harm, the more careful thought and added safety-features are called for. 

So don't get lured in by "software is like a hammer" statements. Something can be morally neutral in itself and still warrant careful design for safety (or a decision not to make it at all). There's a quote from Robert Oppenheimer I like, from the ["personnel hearing"](https://www.osti.gov/opennet/hearing) in which he lost his clearance:

> "When you see something that is technically sweet, you go ahead and do it and argue about what to do about it only after you’ve had your technical success. That is the way it was with the atomic bomb."

## Beyond Fuzz Testing

We previously saw *fuzz testing*, which sent randomly generated inputs to a program under test, and checked whether the program crashed. We can do a lot more with this idea of random inputs. But to do so, we need a broader view of what "testing" means. 

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

_Model-based Testing_ is using a separate artifact that _models_ the desired behavior of the system as either an oracle for correctness or a means of guiding test input generation. Today we'll look at the former: see [the livecode for today](https://github.com/cs0320/class-livecode/tree/main/F24/oct29_mbt_pbt), where we'll test my implementation of bubble sort. Concretely:
* My bubble-sort method is the *program under test*. We want to evaluate whether or not it is correct.
* Java's standard `Collections.sort` method is the *known-good* artifact. It will serve as our oracle of correctness.

**Something very important has just happened. Pay attention!**

### What just happened?

We have stopped talking about testing against _specific outputs_, and have started testing more abstract _properties_ of outputs. In fuzz testing, the property was "doesn't crash". For (this type of) model-based testing, we want to check whether the output lists are exactly the same. But we don't need to encode a specific output, which lets us use randomness to generate inputs and mine for bugs while we sleep.

Other kinds of model-based testing include using modeling languages to sketch desired behavior, or using something like a state machine model to generate traces of user interactions to test (e.g.) data structures or user interfaces.

## Property-Based Testing 

**TIM IS ACTIVELY EDITING THIS SECTION!**

Is there any reason that our properties have to be written in terms of another implementation? No! 

What makes a sorting implementation _correct_? If we can write this check as a method, we can apply the same idea, without needing a naive implementation to check against. 

Again, see the livecode for today for an exercise. **Hint: consider what you need from a sort to call it correct. Is that something you can check in a test method?**

We don't want to know whether the output lists are exactly the same, but we want to know whether they match in terms of nearness to the input goal.
