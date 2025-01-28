# Testing, Strategies, and the Debugging Recipe

## Expectations

This chapter is designed to support your work on sprints 1.1 and 1.2. In it, you'll find:
* a quick intro to some technical terms from agile development; 
* a conceptual discussion on unit testing; 
* a worked example using the strategy pattern; and 
* a concrete discussion and on unit testing.

You'll be able to follow along and experiment with the end result by cloning the [class livecode repository](https://github.com/cs0320/class-livecode). 

```admonish warning title="Do this now!"
Now is a good time to clone the livecode repository if you haven't already. We will be using it for in-class exercises soon, and it's also meant to be a reference for the sprints. 
```

## Note on CSV

Many questions are being answered in Ed already. You might benefit from skimming the topics, or searching. We are trying to promote discussion and thought, not give "the answer". If you ask "Is this right?" we might not answer with a boolean. That's just life.

Keep in mind, you should not need to use `instanceof` or typecasting outside of methods like overriding `.equals` or `.hashCode` in a new class. We'll also be understanding if you must typecast in your test suites, although you should not need to do this for the first 2 sprints.

## Agile Terminology

We're going to be using a few terms of art in 0320. While we do put a bit of our own spin on these (largely because this is a class, and not a full-time job) it's important to understand what's going on. 

### Agile Development 

We say that a development methodology is _agile_ if, broadly speaking, it prioritizes sthe ability to change plans in response to regularly-sought feedback. Once we try to define it more precisely, you'll find multiple competing definitions, and many competing methodologies that purport to be "agile". Usually, you'll see the term used in contrast to "waterfall" development, where the software project proceeds along a linear path, like this:
* Requirements 
* Specifications
* Design 
* Implementation
* Testing
* Maintenance

Of course, all of these "phases" still exist in an agile project! The difference is that (e.g.) customer feedback on an early demo might result in changes to the requirements, or some trouble with testing an early prototype might mean changing the design to make testing easier. To make this possible, agile projects usually start development early, expecting that some, or even most, of that prototype code will be replaced later. But **something must be possible to demo at every stage**, or feedback is hard to obtain.

### Sprints

Agile development is often divided into short periods of development effort: _sprints_. The duration of a sprint varies depending on the project and company. In 0320, we've organized development into one-week sprints with relatively small requirements for each. Each sprint builds on the last. 

Organizing sprints is an important skill for project managers. Timelines need estimates (and the ability to alter those estimates when needed), tickets need to be managed, and so on. We'll gloss over most of this in 0320, although your term project will need some attention to project-management tasks like these.

### User Stories 

A _user story_ is a short description of desired behavior. You'll often find these used in requirements documents for agile projects. There are a few templates, but we (mostly) follow the "As a USER-ROLE I can NEEDED-BEHAVIOR so that TASK-OR-BENEFIT" pattern. Look at the user stories in sprint 1.1, and you should see this pattern. 

It's important to remember that, although they follow a template, user stories are _informal_: they may not be enough by themselves to really describe what the customer needs. To help bridge this gap, they are often accompanied by _acceptance criteria_, which give additional lower-level requirements. But these are still fairly informal, and there's often a need for more precise specification to be agreed upon between developers! 

But what makes a good user story? A user story describes a narrow, _demoable_ piece of functionality that can reasonably be accomplished in a single sprint. Often, you might start with a rough user story and realize that it's too big, and then split it into multiple stories. If users request an enhancement to an existing story, commonly these would be added as new stories (and more infrequently as additional acceptance criteria).

~~~admonish warning title="Developers are users too!"
If you're building a software package that is intended for other developers to use, _they are potential users_! In this class we will be giving you user stories from the developer-user perspective in addition to the end-user perspective. Your API design, documentation, etc. will matter to developer users.
~~~

## Clever Manka 

There's a fairy tale I like: _Clever Manka_, from a 1920's compilation called The Shoemaker's Apron, available on Project Gutenburg [here](https://www.gutenberg.org/files/33002/33002-h/33002-h.htm#Page_165). I'll reproduce the text in full here, within these spoiler tags. 

<details>
<summary>Clever Manka</summary>

>There was once a rich farmer who was as grasping and unscrupulous as he was rich. He was always driving a hard bargain and always getting the better of his poor neighbors. One of these neighbors was a humble shepherd who in return for service was to receive from the farmer a heifer. When the time of payment came the farmer refused to give the shepherd the heifer and the shepherd was forced to lay the matter before the burgomaster.
>
>The burgomaster, who was a young man and as yet not very experienced, listened to both sides and when he had deliberated he said:
>
>"Instead of deciding this case, I will put a riddle to you both and the man who makes the best answer shall have the heifer. Are you agreed?"
>
>The farmer and the shepherd accepted this proposal and the burgomaster said:
>
>"Well then, here is my riddle: What is the swiftest thing in the world? What is the sweetest thing? What is the richest? Think out your answers and bring them to me at this same hour tomorrow."
>
>The farmer went home in a temper.
>
>"What kind of a burgomaster is this young fellow!" he growled. "If he had let me keep the heifer I'd have sent him a bushel of pears. But now I'm in a fair way of losing the heifer for I can't think of any answer to his foolish riddle."
>
>"What is the matter, husband?" his wife asked.
>
>"It's that new burgomaster. The old one would have given me the heifer without any argument, but this young man thinks to decide the case by asking us riddles."
>
>When he told his wife what the riddle was, she cheered him greatly by telling him that she knew the answers at once.
>
>"Why, husband," said she, "our gray mare must be the swiftest thing in the world. You know yourself nothing ever passes us on the road. As for the sweetest, did you ever taste honey any sweeter than ours? And I'm sure there's nothing richer than our chest of golden ducats that we've been laying by these forty years."
>
>The farmer was delighted.
>
>"You're right, wife, you're right! That heifer remains ours!"
>
>The shepherd when he got home was downcast and sad. He had a daughter, a clever girl named Manka, who met him at the door of his cottage and asked:
>
>"What is it, father? What did the burgomaster say?"
>
>The shepherd sighed.
>
>"I'm afraid I've lost the heifer. The burgomaster set us a riddle and I know I shall never guess it."
>
>"Perhaps I can help you," Manka said. "What is it?"
>
>So the shepherd gave her the riddle and the next day as he was setting out for the burgomaster's, Manka told him what answers to make.
>
>When he reached the burgomaster's house, the farmer was already there rubbing his hands and beaming with self-importance.
>
>The burgomaster again propounded the riddle and then asked the farmer his answers.
>
>The farmer cleared his throat and with a pompous air began:
>
>"The swiftest thing in the world? Why, my dear sir, that's my gray mare, of course, for no other horse ever passes us on the road. The sweetest? Honey from my beehives, to be sure. The richest? What can be richer than my chest of golden ducats!"
>
>And the farmer squared his shoulders and smiled triumphantly.
>
>"H'm," said the young burgomaster, dryly. Then he asked:
>
>"What answers does the shepherd make?"
>
>The shepherd bowed politely and said:
>
>"The swiftest thing in the world is thought for thought can run any distance in the twinkling of an eye. The sweetest thing of all is sleep for when a man is tired and sad what can be sweeter? The richest thing is the earth for out of the earth come all the riches of the world."
>
>"Good!" the burgomaster cried. "Good! The heifer goes to the shepherd!"
>
>Later the burgomaster said to the shepherd:
>
>"Tell me, now, who gave you those answers? I'm sure they never came out of your own head."
>
>At first the shepherd tried not to tell, but when the burgomaster pressed him he confessed that they came from his daughter, Manka. The burgomaster, who thought he would like to make another test of Manka's cleverness, sent for ten eggs. He gave them to the shepherd and said:
>
>"Take these eggs to Manka and tell her to have them hatched out by tomorrow and to bring me the chicks."
>
>When the shepherd reached home and gave Manka the burgomaster's message, Manka laughed and said: "Take a handful of millet and go right back to the burgomaster. Say to him: 'My daughter sends you this millet. She says that if you plant it, grow it, and have it harvested by tomorrow, she'll bring you the ten chicks and you can feed them the ripe grain.'"
>
>When the burgomaster heard this, he laughed heartily.
>
>"That's a clever girl of yours," he told the shepherd. "If she's as comely as she is clever, I think I'd like to marry her. Tell her to come to see me, but she must come neither by day nor by night, neither riding nor walking, neither dressed nor undressed."
>
>When Manka received this message she waited until the next dawn when night was gone and day not yet arrived. Then she wrapped herself in a fishnet and, throwing one leg over a goat's back and keeping one foot on the ground, she went to the burgomaster's house.
>
>Now I ask you: did she go dressed? No, she wasn't dressed. A fishnet isn't clothing. Did she go undressed? Of course not, for wasn't she covered with a fishnet? Did she walk to the burgomaster's? No, she didn't walk for she went with one leg thrown over a goat. Then did she ride? Of course she didn't ride for wasn't she walking on one foot?
>
>When she reached the burgomaster's house she called out:
>
>"Here I am, Mr. Burgomaster, and I've come neither by day nor by night, neither riding nor walking, neither dressed nor undressed."
>
The young burgomaster was so delighted with Manka's cleverness and so pleased with her comely looks that he proposed to her at once and in a short time married her.
>
>"But understand, my dear Manka," he said, "you are not to use that cleverness of yours at my expense. I won't have you interfering in any of my cases. In fact if ever you give advice to any one who comes to me for judgment, I'll turn you out of my house at once and send you home to your father."
>
>All went well for a time. Manka busied herself in her house-keeping and was careful not to interfere in any of the burgomaster's cases.
>
>Then one day two farmers came to the burgomaster to have a dispute settled. One of the farmers owned a mare which had foaled in the marketplace. The colt had run under the wagon of the other farmer and thereupon the owner of the wagon claimed the colt as his property.
>
>The burgomaster, who was thinking of something else while the case was being presented, said carelessly:
>
>"The man who found the colt under his wagon is, of course, the owner of the colt."
>
>As the owner of the mare was leaving the burgomaster's house, he met Manka and stopped to tell her about the case. Manka was ashamed of her husband for making so foolish a decision and she said to the farmer:
>
>"Come back this afternoon with a fishing net and stretch it across the dusty road. When the burgomaster sees you he will come out and ask you what you are doing. Say to him that you're catching fish. When he asks you how you can expect to catch fish in a dusty road, tell him it's just as easy for you to catch fish in a dusty road as it is for a wagon to foal. Then he'll see the injustice of his decision and have the colt returned to you. But remember one thing: you mustn't let him find out that it was I who told you to do this."
>
>That afternoon when the burgomaster chanced to look out the window he saw a man stretching a fishnet across the dusty road. He went out to him and asked:
>
>"What are you doing?"
>
>"Fishing."
>
>"Fishing in a dusty road? Are you daft?"
>
>"Well," the man said, "it's just as easy for me to catch fish in a dusty road as it is for a wagon to foal."
>
>Then the burgomaster recognized the man as the owner of the mare and he had to confess that what he said was true.
>
>"Of course the colt belongs to your mare and must be returned to you. But tell me," he said, "who put you up to this? You didn't think of it yourself."
>
>The farmer tried not to tell but the burgomaster questioned him until he found out that Manka was at the bottom of it. This made him very angry. He went into the house and called his wife.
>
>"Manka," he said, "do you forget what I told you would happen if you went interfering in any of my cases? Home you go this very day. I don't care to hear any excuses. The matter is settled. You may take with you the one thing you like best in my house for I won't have people saying that I treated you shabbily."
>
>Manka made no outcry.
>
>"Very well, my dear husband, I shall do as you say: I shall go home to my father's cottage and take with me the one thing I like best in your house. But don't make me go until after supper. We have been very happy together and I should like to eat one last meal with you. Let us have no more words but be kind to each other as we've always been and then part as friends."
>
>The burgomaster agreed to this and Manka prepared a fine supper of all the dishes of which her husband was particularly fond. The burgomaster opened his choicest wine and pledged Manka's health. Then he set to, and the supper was so good that he ate and ate and ate. And the more he ate, the more he drank until at last he grew drowsy and fell sound asleep in his chair. Then without awakening him Manka had him carried out to the wagon that was waiting to take her home to her father.
>
>The next morning when the burgomaster opened his eyes, he found himself lying in the shepherd's cottage.
>
>"What does this mean?" he roared out.
>
>"Nothing, dear husband, nothing!" Manka said. "You know you told me I might take with me the one thing I liked best in your house, so of course I took you! That's all."
>
>For a moment the burgomaster rubbed his eyes in amazement. Then he laughed loud and heartily to think how Manka had outwitted him.
>
>"Manka," he said, "you're too clever for me. Come on, my dear, let's go home."
>
>So they climbed back into the wagon and drove home.
>
>The burgomaster never again scolded his wife but thereafter whenever a very difficult case came up he always said:
>
>"I think we had better consult my wife. You know she's a very clever woman."

</details>

Stories like this appear in numerous places throughout the world. For example, India has the story of [Hiranyakashipu](https://en.wikipedia.org/wiki/Hiranyakashipu), a king with a boon protecting him from death "by day or by night", "indoors and out", etc. Narasimha, an avatar of Vishnu, finds a way around the riddle. So I might claim that humans find something universally valuable about them.

What in the world does a fairy tale have to do with *testing*?

~~~admonish warning title="Using these notes"
<B>If you're reading these notes without having been in lecture</B>: think about these questions first, before you read the answer! If you don't, you'll be robbing yourself of a chance to participate and learn. (The collapsible sections are meant to help you avoid spoilers while you think.)
~~~

Don't worry about whether your answer is the same as mine. Especially in 0320, there are often many different good answers, even to technical questions.

<details>
<summary><B>Think, then click!</B></summary>

Clever Manka is a _boundary condition tale_. There is something special about boundary conditions and how they challenge our preconceptions. **As testers, we should give boundaries the respect they deserve.**
    
(Are you aware of more mythological or literary settings for this sort of boundary-condition riddle? Share them with Tim!)
</details>

## Boundary Conditions: Testing and Defensive Programming

Here's an example: "I have tested a positive number, and I have tested a negative number." Surely all numbers are positive or negative. **(Is this true?)**

Here's another example: "I have tested this function, which accepts a Java `Boolean`, on both values: true and false." **(What's missing?)**

Never assume that the obvious partition of the space actually covers the space; be on the lookout for special cases, outliers, and even new dimensions about which to think. This isn't only about testing, either---see, for example, the [Falsehoods Programmers Believe About Time](https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca). Part of programming defensively is trying to avoid making unnecessary assumptions, while still allowing for extensibility. Keep this in mind as we start to code (and test) together.

## Live Coding: Seating Order

You can follow along with today's live coding in [this Github repo](https://github.com/cs0320/class-livecode), in the `F24/sep10-seatingsorting` directory. **Open the `pom.xml` "as a project" in IntelliJ.**

~~~admonish warning title="Livecode in class"
We will not usually be doing "livecode" from scratch. That would take up too much time. Instead, we'll use this opportunity to practice reading code that exists. Today, I'll be walking you through some design choices I made, some issues, and some useful techniques.
~~~

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
    
Notice that there is no `()` after `Diplomat`, like you may be used to when defining a contructor of no arguments. The record still initializes its fields&mdash;the constructor is defined implicitly. But we get to provide additional computation with this new syntax. In this case, we'll forbid diplomats that lack either a rank or name. This is another kind of **defensive programming**, because our library isn't meant to work if diplomats have no rank.
    
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

### Design Challenges

#### Small Challenge: countries may give precedence to Nuncios, at their discretion

[Nuncios](https://en.wikipedia.org/wiki/Nuncio) are ambassadors from the Holy See, that is from the Pope, separately from the country of Vatican City. Some traditionally Catholic countries will always list their nuncio first in any order of precedence. 

This means that we need some way of adjusting the _comparison_ used for sorting. Maybe nuncios are before anything else, or maybe they're considered equal to ambassadors. It depends on the country. 

#### Larger challenge: conventions change over time

New titles get added (or removed), treaties get revised, and the world changes. Ideally, we'd like our program to allow countries some flexibility in how they order their diplomats, _beyond_ the nuncio question above. 

This means that we probably don't want to write a sort that hard-codes in the above ordering, or even a sort that takes a boolean to resolve the nuncio question. We want a sort that uses the **strategy pattern**.

### Comparators

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

