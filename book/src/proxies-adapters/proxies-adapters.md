# fa23.4 Proxies (Defensive and Otherwise)

**These notes are being worked on; expect changes up until class.**

Today we'll cover some topics in *defensive programming* and introduce the *proxy* pattern. There will be two livecode examples, both [in the repo](https://github.com/cs0320/class-livecode) for today: 
* a TA hours dispatcher; and 
* a small caching example.

~~~admonish warning title="In-class exercises are coming soon!"
Shopping period ends today. We may have a code-review exercise on Thursday if time permits.
~~~

**Let's get ready for the next sprint.**

## Defensive Programming: Context

If you write code someone else uses, there is an implicit agreement between you. They _provide your code with something_. You _give them something back_. In both directions, there is an obligation. You might tell them: 

>"The constructor of my `TAHours` class should take an instance of an object implementing the `Iterator` interface, and iterating ought to return `Student` objects."

At a high level, that's an obligation on _their_ part. But you might also say: 

>"At any point at which at least one TA is free, the next student in the given iterator will be dispatched to one of those TAs before any other student is dispatched."

That's an obligation on _your_ part. 

These sorts of *contracts* are everywhere in engineering, and software engineering is no exception. If you can't rely on your caller to conform to your preconditions, unspecified behavior might be, _in principle_ at least, on them. But if they can't rely on your code to provide what it promises, it's your fault. And if they don't know what to provide, or what to expect, *that's also your fault*---who trusts code that isn't clear about its job?

Often, these guarantees can be enforced by the type system. The stronger the type system, the more these contracts can be checked _before_ runtime. This is why Java generics were such a big win: mismatches in expectations could be found out early.

Similarly, this is why _interfaces_ are so important. Every time you implement an interface, you are working to conform to the preconditions of some library. They say: "Give me a `Comparator` and I'll sort that list," so you'd better implement `Comparator`. 

But not every precondition or postcondition can be checked by the type system---at least, not in most languages, and certainly not in Java, Python, Typescript, and other languages you'll use in this class.

Good code should still try to detect violations of its expectations early, and notify the caller about that violation in some useful way. Just saying "Oops, LOL, I guess you gave me invalid input shrug emoji" may be _fair_, but it's not going to make you feel better when your boss calls you to ask why Google Maps is down, or an airplane crashed, or some other consequence happened.

Writing code that is _safe from bugs_ requires being more professional, and thinking adversarially about:
* potential ways that a caller might violate your preconditions;
* potential ways that a caller might modify data unexpectedly; 
* potential exceptions that code _you_ call might throw, or other error conditions from that code;
* and much more. 

Indeed, I write "thinking adversarially" because it's useful to imagine a truly malicious caller or callee _trying to break your code_ for fun or profit. Sure, most issues won't be malicious---probably they will just be honest mistakes. But I find thinking adversarially to be deeply beneficial for _defensive programming_.

## Defensive Programming

Let's write a class whose job is to coordinate TA hours for a big class. There's a central signup queue (which will be provided to our class) from which we'll dispatch students to available TAs. We've already got `Student` and `TA` classes defined elsewhere, and they do what you'd expect.

```java
package edu.brown.cs32.livecode.feb15;
import java.util.Iterator;
import java.util.Map;

public class HoursDispatcher {
    Iterator<Student> queue;
    Map<TA, Integer> minutesLeft;
    String statusMessage;

    HoursDispatcher(Iterator<Student> signups, String statusMessage) {
        this.queue = signups;
        this.statusMessage = statusMessage;
    }

    void addTA(TA ta, int minutes) {
        minutesLeft.put(ta, minutes);
    }
}
```

Remember: we're pretending that there's someone using our code, or someone whose code we're using, who is actively trying to break the queue or do some other kind of mischief---but that they won't _change_ our code. Even though, usually, the mischief is unintentional. Got any concerns?

* The fields should be `private`? 
* Some of the fields should be `final`?

Ok, let's make those changes, and continue iterating. 

### Keywords: `private` and `final`

There are a few problems we might notice as we go. First, neither `private` nor `final` always protect you. Let's look very closely at one example: our `minutesLeft` field. We can make it `final` to prevent it from being modified---but that prevents value of the _field itself_ from being _reassigned_. It doesn't stop someone from calling (e.g.) `minutesLeft.put` themselves. That is:

**The reference to the object is protected, but the object remains mutable!**

We can make the field private, but then nobody can see the current state of the TA pool. It's reasonable to imagine that's bad; in real applications we often want to expose a view of some piece of state while disallowing modifications of that view. 
 
### Defensive Copying

A common technique is called a _defensive copy_: we'll just make a getter method that returns a copy of the `Map`:

```java=
    public Map<TA, Integer> getMinutesLeft() {
        // Defensive copy
        return new HashMap<>(minutesLeft);        
    }

```

I want to point out that, in general, this technique is very useful! In this case, however, there is a concern:

* The `minutesLeft` field is mutable by design: we need to update the TA pool! The view provided by a defensive copy won't update, and so it really just provides the state of the pool at the time the getter was called. 
* Whenever someone calls this method, we're manufacturing new objects that are supposed to represent the state of the queue, but different objects will disagree with each other.

We can make progress on fixing both of these. Maybe we keep a canonical copy around:

```java=
    private Map<TA, Integer> public_view_minutesLeft;
    public Map<TA, Integer> getMinutesLeft() {
        // Canonical defensive copy
        if(public_view_minutesLeft == null)
            public_view_minutesLeft = new HashMap<>(minutesLeft);
        return public_view_minutesLeft;
    }
```

But this doesn't solve the unchanging-view problem. In fact, it makes the issue worse: the view is set once by the first call, and never changes. This is fixable by checking whether `public_view_minutesLeft` has fallen behind `minutesLeft`, but even then those who called the method before won't have their references updated. 

This solution is still moving in the right direction. We could certainly update the canonical copy _object_, rather than creating a new one. But then we've got another problem---any caller could mutate their canonical copy, which is the same one every other caller has! 

So we need to enforce immutability on the canonical copy. It turns out that Java's standard library has a convenient way to do this.


### Documenting Assumptions and Guarantees

How do we tell our caller what to expect? The types say _part_ of that, but they aren't enough on their own. For everything else, we need to write documentation. 

Note that this is very different from "code comments". Code comments help a developer understand your code. In contrast, documentation is a kind of _specification_: you're communicating to someone what your code does, and what it needs, without them needing to understand the code itself. 

Documentation is thus much more important than code comments, and code comments are pretty important.

I'll usually skip this in lecture, unless it's the topic of discussion---good documentation takes time.


### Validating Input and Exceptions

Defensive programming isn't just about protecting your own code from someone else's bugs, it's also about protecting others from themselves, you, their other dependencies, and your own dependencies. 

It's always good to ask yourself, for every place your class is obtaining data, **what does a consistent state look like?** That is, what _properties_ define a good state for the class...

For example, we should probably do something coherent in case our caller registers a TA with a negative amount of time available. This sounds like a job for exceptions.

### Checked vs. Unchecked Exceptions

You might have noticed that some exceptions get declared for methods that use them, and other don't. Take a look at the Javadoc for [NullPointerException](https://docs.oracle.com/javase/7/docs/api/java/lang/NullPointerException.html). Since these can happen unexpectedly, it wouldn't be very ergonomic to ask programmers to write a `throws` declaration for them. Hence, these exceptions are _unchecked_: the type system won't (usually) consider them. Unchecked exceptions are those that descend from `RuntimeException` (like null pointer exceptions) or from `Error` (which is a category usually reserved for errors that are so bad that most applications _shouldn't_ try to catch and handle them, like internal JVM inconsistencies under which all bets are off).

Usually you'll be communicating with your caller (and callee) via checked exceptions. A common situation is when a caller provides an argument that is invalid: the type is correct, but some other important criterion has failed. Often, the first choice is to throw the _unchecked_
[IllegalArgumentException](https://docs.oracle.com/javase/7/docs/api/java/lang/IllegalArgumentException.html). This isn't a "stop everything, the world is broken" `Error`, and your caller can try to recover from it or not. Indeed, because this is an unchecked exception, they might not even think to catch it. Thus, _it is absolutely vital_ that you declare this error in your documentation, and preferably give it a `throws` clause even if Java doesn't require it.

Another option is to define our own, custom, _checked_ `Exception` class. We'd then _have_ to declare it in a `throws` clause. Custom exceptions are great if you want to pass back more context that's related to your method. Imagine what information you could give that would be helpful to your caller in:
* debugging; or
* sending high-quality error messages to end users.

Remember: a string isn't a great way to send back structured information. A person may be able to read it, but if they want to do something more programmatic, they need to parse it. Don't make them do this! If the exception happened for complicated reasons (or maybe even if it didn't) make a custom exception that includes fields related to the problem, and document them.

### A Quick Fix: Unmodifiable Maps

Let's go back to the defensive-programing problem we observed earlier.

Java's library provides a useful tool: `Collections.unmodifiableMap`. This static method accepts a `Map` and produces an object that also implements the `Map` interface, but disallows modification. So we could replace the body of `getMinutesLeft()` with:

```java=
    private Map<TA, Integer> unmodifiable_minutesLeft;
    public Map<TA, Integer> getMinutesLeft1() {    
        if(unmodifiable_minutesLeft == null) {
            unmodifiable_minutesLeft =
                    Collections.unmodifiableMap(minutesLeft);
        }
        return unmodifiable_minutesLeft;
```

As stated in the [Javadoc for this method](https://docs.oracle.com/javase/7/docs/api/java/util/Collections.html), it:

> Returns an unmodifiable view of the specified map. Query operations on the returned map "read through" to the specified map, and attempts to modify the returned map, whether direct or via its collection views, result in an `UnsupportedOperationException`.

That is, it creates a new **proxy** object that restricts what the caller can do. If you look at the source code, you'll see a single-line method body:

```java
return new UnmodifiableMap<>(m);
```

And there is, indeed, a class inside the `Collections` class to embody these unmodifiable proxies:

```java
private static class UnmodifiableMap<K,V> implements Map<K,V>, Serializable { 
    ...
}    
```

The specifics aren't too important; don't worry about `Serializable` or `static class`. What _is_ important is that they really are just creating a new kind of `Map` whose sole purpose is _defending_ another `Map` from modification. If you browse the code you can see various ways the authors have carefully considered potential threats. (In fact, skimming the Javadoc for `Collections` is a great idea in general. There are good lessons there.)

When in doubt, return an _unmodifiable_ `Map`. It's quick and easy, and unless you really want the caller to be able to modify the underlying map, is significantly better than a defensive copy alone. We've:

* protected the internal `minutesLeft` map from modification;
* avoided memory bloat by using a canonical public-facing object; and
* ensured that all callers get the same view.

Unfortunately:
* we've only protected one level of the reference structure: the `TA` keys of the map are still exposed to the caller, and if the `TA` class allows modification, we've just handed that ability over to the caller.
* calling this specific method will only work if we want exactly the same interface given to the caller as we have internally (we store a map, so we produce an unmodifiable map). 

**Aside:** Again, note that our assumption "the adversary is in the codebase" does need some moderation! If there really is a malicious developer on our team, we're probably in deep trouble. We're using the _fiction_ of the adversary to help us think of ways our code could be made safer or more robust against worst case possibilities.

## Bringing All That Together: Structural Patterns (like Proxy)

A _proxy_ class wraps another object and provides all the same interfaces, but might possibly restrict or change the exact behavior of the promised methods. This is an incredibly useful pattern, and it's related to other _structural patterns_ like _decorator_ (which adds in additional functionality) or _adapter_ (which modifies one interface into another). There are more than 20 patterns in the [classic book](https://learning.oreilly.com/library/view/design-patterns-elements/0201633612/fm.html), and we won't talk about them all explicitly in class.

Calling `Collections.unmodifiableMap` implements the proxy pattern for us, provided we're trying to proxy a `Collection` in a very specific way. But what if we want to proxy something else, or proxy in a different way---perhaps to only allow the addition of new `TA` entries, but not modification of old ones? 

Let's build our own class for that. We'll define it _inside_ the class definition of `HoursDispatcher`---making it an _inner_ class. Instances of inner classes (by default, anyway) are tied to specific instances of the outer class, and get access to all the fields of the outer class. So our `LimitedTATimesMap` below will be able to reference, e.g., `minutesLeft`. 

Because it provides the `Map` interface, we need to define quite a few methods. Most (like `size()`) are straightforward, and I'll omit almost all of them for brevity. Others, like `remove()`, we want to prohibit entirely, and so they just throw an `UnsupportedOperationException`. For `put()`, we'll make sure that the TA isn't already in the map; if they are, we'll throw the same exception. If not, we'll update the internal map.

```java=
class LimitedTATimesMap implements Map<String, Integer> {
    @Override
    public int size() {
        return minutesLeft.size();
    }
    @Override
    public Integer remove(Object key) {
        throw new UnsupportedOperationException("remove");
    }
    @Override
    public Integer put(TA key, Integer value) {
        if(minutesLeft.containsKey(key))
            throw new UnsupportedOperationException("put");
        return minutesLeft.put(key, value);
    }
    // other methods are straightforward or throw an exception
}
```

## Caching

Since proxies modify existing methods, they're very useful for adding on hidden efficiencies. Caching is a great example -- and something you'll be doing in your Server sprint. 

~~~admonish warning title="For your sprint!"
See the lecture capture and the livecode example in the `caching` folder for more of the caching demo. 
~~~

## Supplemental Material: More Advanced Structural Patterns

We will cover the two ideas below at a later date. **They might still be useful reading as you prepare for the Server sprint.** 

### Another Option: Adapter Pattern

Let's try to protect the `TA` objects from modification.  One reasonable course would be to create a proxy class for `TA`s. However, what if the caller doesn't really _need_ `TA` objects, but just wants to know the names of all the TAs currently helping students?

In that case, we can build an _adapter_ that converts the `Map<TA, Integer>` to a `Collection<String>`. There are many applications for this pattern: any time you have two libraries that need to interact but _don't agree_ on an interface, for instance. This is just one example.

The implementation is very similar to the proxy above (and I'll omit many methods that are straightforward):

```java=
class OnDutyTAsView implements Collection<String> {
    @Override
    public int size() {
        return minutesLeft.size();
    }
    @Override
    public Iterator<String> iterator() {
        // FP approach (concise); can also use an anonymous class
        return minutesLeft.keySet().stream().map(ta -> ta.name).iterator();
    }
    // other methods straightforward or throw exception
}
```

Notice that the view presents a `Collection` interface, but it isn't a `HashSet` or `ArrayList`. It's a new way for callers to access the `minutesLeft` map in a restricted, safe way. All callers will share the same up-to-date adapter reference, but none will be able to modify the map or the objects it contains.

What's a "stream"? [Something that's been around since Java 8](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)! It's an interface that supports functional operators like `map` and `filter`, among many others. According to the docs, it's:

> A sequence of elements supporting sequential and parallel aggregate operations.

You can do the above with anonymous classes, or with your own class that implements `Iterator<String>`, but I prefer this way.

**Aside:** Note that I'll sometimes refer casually to a few different structural patterns as "proxies", but technically speaking they are different! In particular, we've just changed the interface: _adapter_ vs. _proxy_ might matter to your caller!


### Multiple Student Queues: Facade Pattern

Suppose we have a *variety* of sources for student-signup data. How would we deal with not just one, but many `Iterator<Student>` objects being given to our `HoursDispatcher`? 

Well, we have a design decision to make. Let's fill in a skeleton, and what we know how to do:


```java=

public class IteratorAggregator<T> implements Iterator<T> {
    List<Iterator<T>> queues = new ArrayList<>();

    IteratorAggregator(Collection<Iterator<T>> startQueues) {
        queues.addAll(startQueues);
    }

    @Override
    public boolean hasNext() {
        // "Lambda can be replaced with method reference):
        // return queues.stream().anyMatch(Iterator::hasNext);
        return queues.stream().anyMatch(it -> it.hasNext());
    }

    @Override
    public T next() {
        // We have a design decision to make...
        return null;
    }
}
```

What's the decision?

<details>
<summary>Think, then click!</summary>
How should the contents of the iterators be woven together? Should we loop through the iterators round-robin, and make new arrivals wait until that iterator comes around again? Or should we have a priority system where we'll always take values from earlier iterators, even if the later iterators never get to go? 
    
Should the contents of the queue be shuffled? What does it mean to shuffle a queue when new students may be arriving constantly?
    
But, given a decision, we could implement a specific approach **and document it**. We could also ask for a strategy (and document that, too).     
</details>
