# sp24.2: Testing, Strategies, and the Debugging Recipe

**Reminder:** Notes in 0320 often cover topics in more detail than we have time for. Thus, we expect you to at least skim the notes! Likewise, the class livecode repository includes marked up versions of the livecode meant for your reference and *experimentation*.

<!-- ## Logistics

* 1340 and 0320 should both have access to the same EdStem and the same lecture capture. The cap is shared between them -- I hope to increase the cap next semester.
* I'm working each day to manage overrides. CAB is not always accurate in reporting seats available, and doesn't count "pending" overrides. If you have an override, **accept it!** If you're still waiting for an override and have already made the request (or received a mail from me this morning), I hope to be able to get most of you in.
* **If you don't have the course in your cart, you will not receive an override because you won't get communications from us.**
* You must serve as a debugging partner once every 2 weeks. But you can attend as many collab sections, startup, and conceptual hours as you wish! The "once every 2 weeks" is a requirement for participation, not a limit on getting help. -->

## Note on CSV

Many questions are being answered in Ed already. You might benefit from skimming the topics, or searching. **Look at the endorsed threads!** We are trying to promote discussion and thought, not give "the answer". If you ask "Is this right?" we might not answer with a boolean.

Keep in mind, you should not need to use `instanceof` or typecasting outside of methods like overriding `.equals` or `.hashCode` in a new class.

<!-- #### Optional: Course Design Motivation

If you're curious about the motivation for 0320's changes since the pandemic, I encourage you to read [this series of blog posts](https://computinged.wordpress.com/2020/07/20/proposal-1-to-change-cs-education-to-reduce-inequity-teach-computer-science-to-advantage-the-students-with-less-background/). Collab section draws on ideas from [subgoal learning](https://computinged.wordpress.com/2020/06/29/subgoal-labelling-influences-student-success-and-retention-in-cs/), and the open collaboration policy is meant to [improve equity](https://computinged.wordpress.com/2020/07/27/proposal-2-to-change-cs-education-to-reduce-inequity-stop-allocating-rationing-or-curving-down-grades/) by removing barriers and let students focus more on *practice* prior to the term project. -->

## Clever Manka 

Your pre-class reading was Clever Manka, from a 1920's compilation called The Shoemaker's Apron, available on Project Gutenburg [here](https://www.gutenberg.org/files/33002/33002-h/33002-h.htm#Page_165).

What in the world does a fairy tale have to do with testing?

<B>If you're reading these notes without having been in lecture</B>: think about these questions first, before you read the answer! If you don't, you'll be robbing yourself of a chance to participate and learn. (These collapsible sections are meant to help you avoid spoilers while you think.)

Don't worry about whether your answer is the same as mine. Especially in 0320, there are often many different good answers, even to technical questions.

<details>
<summary><B>Think, then click!</B></summary>

Stories like Clever Manka appear in numerous places throughout the world. For example, India has the story of [Hiranyakashipu](https://en.wikipedia.org/wiki/Hiranyakashipu), a king with a boon protecting him from death "by day or by night", "indoors and out", etc. Narasimha, an avatar of Vishnu, finds a way around the riddle. 

There is something special about boundary conditions and how they challenge our preconceptions. **As testers, we should give boundaries the respect they deserve.**
    
(Are you aware of more mythological or literary settings for this sort of boundary-condition riddle? Share them with Tim!)
</details>

## Boundary Conditions: Testing and Defensive Programming

Here's an example: "I have tested a positive number, and I have tested a negative number." Surely all numbers are positive or negative. (Is this true?)

Here's another example: "I have tested this function, which accepts a Java `Boolean`, on both values: true and false." (What's missing?)

Never assume that the obvious partition of the space actually covers the space; be on the lookout for special cases, outliers, and even new dimensions about which to think. This isn't only about testing, either---see, for example, the [Falsehoods Programmers Believe About Time](https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca). Part of programming defensively is trying to avoid making unnecessary assumptions, while still allowing for extensibility.

**Keep this in mind as we start to code (and test) together.**

## Live Coding: Seating Order

You can follow along with today's live coding in [this Github repo](https://github.com/cs0320/class-livecode), in the `S24/jan30-seatingsorting` directory. **Open the `pom.xml` "as a project" in IntelliJ.**

International diplomacy is complicated. Countries host a diplomatic corps of various ambassadors, envoys, etc. from other nations, and there is an elaborate protocol around order of precedence. Who gets the good seats? Who among a group is the one a new arrival will present papers to? 

There are historical reasons for all this. Before communication was instantaneous and reliable, ambassadors had significant power to make decisions for their country, and so being an ambassador was a big deal. This isn't a history class, though, so let's focus on the engineering. 

### Diplomats: Records and Enums

I've written a `Diplomat.java` file, containing a _record_. I like records for reasons I've recorded in the file:

```java
/**
 * NOTE: records are a modern Java feature that make defining dataclasses convenient.
 * A record is immutable, and toString(), equals(), etc. are automatically defined.
 *
 * If you like Python, this is similar to @dataclass
 */
public record Diplomat(Rank rank, String name) {

    /**
     *  (Simplified) ambassadorial ranks c. 1961
     *  See: https://en.wikipedia.org/wiki/Diplomatic_rank#Ranks
     */
    public enum Rank {
        NUNCIO, AMBASSADOR, HIGH_COMMISSIONER,
        MINISTER, ENVOY, CHARGE_DAFFAIRES
    }

}
```

Enumerations (`enum`) are a nice way to limit possibilities. If we'd used numbers or strings as the type of a diplomat's rank, we'd have to worry about what our program would do if someone had a strange rank like `-172653` or `"242RT#$#GR@@@#"`. This is an example of **defensive programming**: we've limited room for unexpected errors.

Speaking of defensive programming, there's one more issue here. Do you see it? (Remember our conversation about `null` from last time...)

<details>
<summary>Think, then click!</summary>

The value `null` can be used as a `Rank`, and so we could create a `Diplomat` object without a rank. Similarly, we could pass `null` for their name. We can fix this by adding some _validation_ to the record. Records make this easy via "compact" constructors:
    
    
```java
    public Diplomat {
        // Values are initialized by the record infrastructure. But we want extra validation:
        if (rank == null || name == null)
            throw new IllegalArgumentException("A diplomat must have non-null rank and name.");
    }    
```
    
Notice that there are no `()` after `Diplomat`. The record still initializes its fields, but we get to provide additional computation. In this case, we'll forbid diplomats that lack either a rank or name. This is another kind of **defensive programming**, because our library isn't meant to work if diplomats have no rank.
    
</details>
</br>

**Exercise:** Make sure you can get this code from the livecode repository. Then make this change (the code is commented out, later in the file). Try creating a nameless or rankless `Diplomat` in the `Main` class (i.e., one with `null` as its name or rank). Print it out. 

### Determining Order of Precedence

Let's write code that can sort a list of `Diplomat` objects in their order of diplomatic predecence. Since this isn't a history or international-relations class, we'll simplify things. Let's say that for _our_ fictional country, the order goes in three levels:
* `NUNCIO`, `AMBASSADOR`, and `HIGH_COMMISSIONER`; then
* `MINISTER` and `ENVOY`; then
* `CHARGE_DAFFAIRES`.

So we'd put an ambassador ahead of a minister, but it would be ok to put a high commissioner above or below an ambassador, since they're at the same tier of ranks.

We're not done though. The order of precedence is complicated by some real-life norms that any *real* software would need to address. When we come back from the break, we'll look at a small challenge and a bigger challenge. 

## Design Challenges

#### Small Challenge: countries may give precedence to Nuncios, at their discretion

[Nuncios](https://en.wikipedia.org/wiki/Nuncio) are ambassadors from the Holy See, that is from the Pope, separately from the country of Vatican City. Some traditionally Catholic countries will always list their nuncio first in any order of precedence. 

This means that we need some way of adjusting the _comparison_ used for sorting. Maybe nuncios are before anything else, or maybe they're considered equal to ambassadors. It depends on the country. 

#### Larger challenge: conventions change over time

New titles get added (or removed), treaties get revised, and the world changes. Ideally, we'd like our program to allow countries some flexibility in how they order their diplomats, _beyond_ the nuncio question above. 

This means that we probably don't want to write a sort that hard-codes in the above ordering, or even a sort that takes a boolean to resolve the nuncio question. We want a sort that uses the **strategy pattern**.

## Comparators

A `Comparator` is an object that implements a `compare` method that tells a caller whether its two arguments are `<`, `>`, or `equal`. It's one of the most common uses of the strategy pattern in Java, and it's perfect for our needs. I wrote a `PrecedenceComparator` below. I've left comments that touch on some of the features used, and raise some design questions we'll go over in lecture.

```java
package edu.brown.cs32.live.diplomacy;

import java.util.Comparator;

// Avoid the need to precede ranks with "Diplomat.Rank."
import edu.brown.cs32.live.diplomacy.Diplomat.Rank;

/**
 * Comparator that implements the order of precedence for members of a diplomatic corps.
 * This can determine (e.g.) seating order, or who among a group is spoken to first.
 *
 * The rules vary by country, and this isn't a faithful implementation; don't use this code
 * to seat real diplomats at a real banquet!
 */

public class PrecedenceComparator implements Comparator<Diplomat> {

    /**
     * If present, a diplomatic rank to always give precedence over others.
     *
     * NOTE: We could have just used "null" to represent the case where this isn't present.
     *   What are the plusses and minuses of this design choice?
     *   Could it be that there are multiple "OK" answers?
     */
    private final Rank givePrecedence;

    /**
     *  Create an order of precedence where a certain diplomatic rank is given precedence over all others.
     *  When this rank is not involved, the standard precedence is used.
     *
     *  Real world example:
     *  According to the Vienna Convention, nuncios (ecclesiastical diplomats from the Holy See), have equal
     *  rank to ambassadors. However, the host country is allowed to grant seniority to a nuncio over others.
     * @param givePrecedence diplomatic title that should always be treated as senior
     */
    public PrecedenceComparator(Diplomat.RANK givePrecedence) {
        if(givePrecedence == null)
            throw new IllegalArgumentException("givePrecedence field of 1-argument constructor must be non-null; use" +
                    " the 0-argument constructor to not automatically prefer any rank.");
        this.givePrecedence = givePrecedence;
    }

    /**
     * Create an order of precedence where the standard precedence is used.
     *
     * NOTE: we may come to regret using null for this.
     */
    public PrecedenceComparator() {
        this.givePrecedence = null;
    }

    @Override
    public int compare(Diplomat o1, Diplomat o2) {
        // By documentation (see mouseover): Negative if o1 < o2; zero if o1 == o2; positive if o1 > o2
        //   the sign of compare(x,y) must be the same as compare(y,x), and compare must be transitive.

        if(o1.rank() == this.givePrecedence) return -1;
        if(o2.rank() == this.givePrecedence) return 1;

        // NOTE: I personally like Java 17's pattern-matching switch expressions for these situations.
        // I find them easier to read than complicated if-statements, and I will get a warning if I don't give a case
        // for every possibile enum value. That means I can *LEAVE OUT* the "default" case and trust the compiler to
        // warn me if I ever add a new value to this enum. "Default" cases check at runtime, and can lie around for
        // years and cause subtle bugs when new values get added.

        return switch(o1.rank()) {
            case NUNCIO, AMBASSADOR, HIGH_COMMISSIONER ->
                    switch(o2.rank()) {
                        case NUNCIO, AMBASSADOR, HIGH_COMMISSIONER -> 0;
                        case ENVOY, MINISTER, CHARGE_DAFFAIRES -> -1;
                    };
            case MINISTER, ENVOY ->
                    switch(o2.rank()) {
                        case NUNCIO, AMBASSADOR, HIGH_COMMISSIONER -> 1;
                        case ENVOY, MINISTER -> 0;
                        case CHARGE_DAFFAIRES -> -1;
                    };
            case CHARGE_DAFFAIRES ->
                    switch(o2.rank()) {
                        case NUNCIO, AMBASSADOR, HIGH_COMMISSIONER, ENVOY, MINISTER -> 1;
                        case CHARGE_DAFFAIRES -> 0;
                    };
        };
    }
}
```

I've also written a little sorting algorithm of my own. The method takes the list to sort _and_ a comparator. 

**Exercise: what happens if we allow `Diplomat` object with `null` rank? Do we get a noisy failure, or a silent failure?**

### Making `Diplomat` Resilient

It's **both**! There's a noisy failure for one constructor, and silent failure for the other---where the `null`-ranked `Diplomat` gets precedence!

Let's inject a check into the constructor of `Diplomat`. That's a better place for it.

```java
/**
 * Define the constructor ourselves (don't use the one that "record" gives
 * us) so that we can validate input values. This is called a *compact*
 * constructor, and works only for records. Note that it's _not_ the same
 * as a 0-argument constructor Diplomat().
 */
//    public Diplomat {
//        // Values are initialized by the record infrastructure. But we want extra validation:
//        if (rank == null || name == null)
//            throw new IllegalArgumentException("A diplomat must have non-null rank and name.");
//    }
```

There are other things we could (or should) do, too. For example, making our comparator not treat a _lack_ of precedence rank the same as giving predecence to `null`.

That went by pretty quickly---clone or pull the livecode repository, and try this out!

## Testing Sorting

I've got a JUnit test class written to test my sorting method. Note that we're _not_ testing sorting of diplomats yet. That would tangle the functionality of the two methods. Instead, let's try to focus on testing _my implementation of bubblesort_.

```java
package edu.brown.cs32.live.sorting;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Test the bubble-sort implementation in the Sorts class.
 * Note that we are *NOT* testing how bubble sort works with the diplomatic ordering.
 * Instead, we'll just use the natural ordering that exists on naturally comparable objects.
 */
public class TestSorts {

    @Test
    public void testBubbleEmpty() {
        List<Integer> lst = new ArrayList<>(List.of());
        // NOTE: Comparator.naturalOrder() saves us from having to write a comparator strategy for integers.
        // If you mouse over it, you'll see a fairly complex generic type. We'll cover that in a future class.
        Sorts.bubbleSort(lst, Comparator.naturalOrder());
        assertEquals(0, lst.size());
    }

    // NOTE: Run "with coverage" to see line-coverage info.
    // Are there any pieces of the code that I haven't yet exercised?
    // (We're looking for at least 50% line coverage for this sprint, but
    //  only for *your* classes, not the kd-tree stuff.)
}
```

If we run this, all tests pass. 

![](https://i.imgur.com/nZS5USG.png)
![](https://i.imgur.com/MI6C2c2.png)

But do you notice something missing about the test suite? Is there important stuff I'm not exercising (keeping in mind we're interested only in the _sort_ so far, not in the diplomat comparator.) We can get a hint by running _with coverage_. (You might need to run once without coverage before this option is enabled.)

![](https://i.imgur.com/9Wo9c35.png)

Here's the result:

![](https://i.imgur.com/ZmpnmuN.png)

Notice the **20%** under "line" coverage. My suite has only exercises a fifth of the lines in the `edu.brown.cs32.live.sorting` package. Since this contains only my sorting method, I'm worried---the method's hardly being tested at all! If we click into the method, we'll see green and red bars shown to the left of the code:

![](https://i.imgur.com/vaoVmpv.png)

We've only tested the empty list input, and so none of those later lines ran at all. We should fix this.

**Exercise:** Add a test of your own!

Let's add this test:

```java
    @Test
    public void testBubbleFiveDifferentReverse() {
        List<Integer> lst = new ArrayList<>(List.of(5,4,3,2,1));
        // NOTE: Comparator.naturalOrder() saves us from having to write a comparator strategy for integers.
        // If you mouse over it, you'll see a fairly complex generic type. We'll cover that in a future class.
        Sorts.bubbleSort(lst, Comparator.naturalOrder());
        assertEquals(List.of(1,2,3,4,5), lst);
    }

```

Unfortunately, this test _fails_. We do get up to 60% coverage, though. (We're looking for at least 50% from you on this sprint.)

```
Expected :[1, 2, 3, 4, 5]
Actual   :[5, 4, 3, 2, 1]
```
Our sorting code seems to be sorting in _reverse_ order, rather than increasing order. Let's write another test to help us triangulate the behavior.

```java
    @Test
    public void testBubbleFiveMixedOneDuplicate() {
        List<Integer> lst = new ArrayList<>(List.of(5,1,3,2,3));
        // NOTE: Comparator.naturalOrder() saves us from having to write a comparator strategy for integers.
        // If you mouse over it, you'll see a fairly complex generic type. We'll cover that in a future class.
        Sorts.bubbleSort(lst, Comparator.naturalOrder());
        assertEquals(List.of(1,2,3,3,5), lst);
    }
```

Notice how we've slowly widened the scope of assumptions we're violating in the tests. First, we pass something non-sorted, and then we pass something with duplicates and partial sortedness. We're now at 100% line coverage! Unfortunately, the result is even more confusing. My method is _not_ sorting in reverse order; it's just plain wrong:

```
Expected :[1, 2, 3, 3, 5]
Actual   :[5, 3, 3, 3, 3]
```

## Debugging: Breadth-First vs. Depth-First

Good debugging involves balancing two equally important instincts:
* breadth-first exploration to rule out potential causes and maintain productive focus; and
* depth-first exploration, narrowly focused on a specific _idea_ about the cause. 

If you skip to depth-first too quickly, you may waste a lot of time. Our debugging recipe is meant to scaffold this process. Let's follow it in this case. 

### What Do We Know?

I'm trying to write an implementation of bubblesort. It should sort the given list in increasing order, according to the comparator provided.

Run `testBubbleFiveMixedOneDuplicate` to reproduce the bug. 

```
Expected :[1, 2, 3, 3, 5]
Actual   :[5, 3, 3, 3, 3]
```

This is wrong because the _2_ and _1_ are both dropped from the input list. 

### What Computational Steps Happen?

* The input list `[5,1,3,2,3]` is created
* The input list is passed to `bubbleSort` along with the natural ordering (increasing) for integers.
* The sorting method loops through every index of the list (`ii`)
* then it loops through every index greater than `ii` (`jj`)
* If the value at `ii` is greater than the value at `jj`, the values are swapped in the list. 
* The list is modified in-place, so there's no return value. 

### Localization

Either my expectations are wrong, or my story is. In this case, I'm pretty sure the sort is modifying the list incorrectly---the result needs to include all the same elements! So there's a problem with my story somewhere. Either one of the steps isn't true, or one of the steps is not detailed enough to _be_ untrue. Let's run some experiments! 

#### Is the correct input list being received by `bubbleSort?`

We'll test this via `System.out.println`. Looks correct. We can now ignore the possibility that the list isn't created properly, or isn't be passed correctly. 

#### Is the loop working as expected? 

We'll test this via `System.out.println`, too. Looks correct: we see `ii` increasing and `jj` starting and stopping at the correct indexes.

#### Is the swap working as expected?

We'll test this via `System.out.println`, too. But something's going wrong: we don't see the value at `ii` preserved by the swap. We now have a _more specific location_ for the bug. 

### Fixing The Bug 

At this point, we know which lines of code to focus on. We can step through them with a debugger or with more print statements, to discover how to fix the issue. 

### Some Notes

I've been programming a long time and I still catch myself failing to follow the debugging recipe. I think I know what's going on and I turn out to be _wrong_, and spend a lot of time deep-diving into a location that isn't actually the source of the issue. In fact, last year I was working on a demo for React programming, and spent _2 hours_ debugging something (the wrong thing) because I jumped ahead before thinking carefully.

