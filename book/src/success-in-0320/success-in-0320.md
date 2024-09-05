# Success In 0320 

## Logistics

I am sending overrides every day as seats become available. The cap is shared between all sections, including 1340. C@B doesn't accurately report enrollments at the moment, because it doesn't combine these sections and it doesn't include active but not-yet-accepted overrides. 

**NOTE WELL:**
* If you **don't intend** to take 0320/1340, please drop (and/or remove the course from your cart) so that I see the seat and can add someone on the waitlist. 
* If you **get an override**, accept it or decline it ASAP. If you hold onto it but don't accept it, it is harming my ability to admit. Especially this semester, when more courses are capped, propagation of availability is much slower. Please don't slow me down!
* If you **do intend** to take the course, keep it in your cart so that I know you're interested. **I will not be giving overrides to students without 0320 in their cart** because you won't be seeing announcements, etc. that we send to the list or post on EdStem.
* **You need the prerequisites** to take 0320 or 1340. If you haven't completed an intro sequence (including at other universities), you cannot take the course. 

## Welcome!

Welcome to 0320/1340! Before we get started, turn to the people sitting next you to now and introduce yourself. 

The most important part of 0320 is *collaboration*. With the exception of the very first assignment, everything in 0320 is group work. 
* You'll be submitting your work to repositories that everyone in the class can (eventually) read.
* You'll be helping one another solve bugs and design problems (even if you're in different project groups; this is a requirement). 
To make this work, we need a professional and friendly environment. 

We'll be passing out index cards. I like to anonymously learn some important things about students in this class, so please fill one out, answering: 
* What is a **goal** you have for 0320?
* What is something you **need** to succeed in 0320?
* What is something you're **afraid** of in 0320?
At the end of class, leave your card either here in front or on (one single) chair in the back so I can collect. 

### An Example: Collab Section

In 0320, we don't have "hours" in the way you may be used to, although help is available frequently! In industry, it's not uncommon to help colleagues improve their code, find and fix bugs, and produce reliable and extensible designs&mdash;even if they are solving a problem you're unfamiliar with. The one-on-one debugging hours format doesn't teach those skills. Similarly, in industry, you're not graded by an autograder or low-level rubric; you'll have a mentor TA to whom you demo and get formative feedback from every week.

**Speaking of TAs, let's introduce them!**

## Immediate Advice

The first sprint goes out Monday, and there's a setup deliverable due before then. Please do it; you don't want to spend a lot of time early next week on setting up IntelliJ and so on.

Go to gear up sections. This semester, they're on **Mondays and Tuesdays**. 

Read [lecture notes](https://cs0320.github.io/notes/) and [livecode](https://github.com/cs0320/class-livecode)! Prototype early! (Paraphrasing Andy: *Start soon! Start yesterday!*)

Please be aware that while this is an S/NC course, it is a lot of work. To quote a very wise remark from prior feedback: *"You will work very hard, but not get an A".* 

My hours (at least for now) will be immediately after class on Thursdays. I'll be in CIT 355 and also on [my Zoom](https://brown.zoom.us/my/tim.browncs), to maximize accessibility for those who are off-campus, sick, on the waitlist, etc. It's OK to bring code, design, etc. questions to my hours, if you wish. 

### Reading for Next Time

Non-technical reading: [Clever Manka](https://www.gutenberg.org/files/33002/33002-h/33002-h.htm#Page_165). It's short. 

### Reading for Sprints 1.1 and 1.2

_Effective Java_ (3rd edition) items on:
* general contracts and equality/hash, **Items 10, 11, and 12**;
* generics, **Items 26, 29, and 30**; and
* exceptions, **Items 69, 70, 72, 73**.

Items in Chapter 4 may be useful for those who haven't done object-oriented programming recently. Especially **Items 15, 17, and 19**. 

You are not required to buy this book. It's available free to read online via Brown's library. 

**Be sure to read the notes and livecode. There is useful information in them that may not be covered in class.**

## Programming vs. Engineering

Let's say I asked you to open up your laptop and write me a sorting algorithm in the language of your choice. How would you react?

<details>
<summary>Think, then click.</summary>
Hopefully you didn't immediately start programming. I didn't really give you enough information, did I? I didn't say (among other things):

* what kind of values you would have to sort; 
* whether the sort needed to be stable, or in-place, or if there were any runtime requirements; or
* what the input interface should be (do you need to do file I/O or parse a CSV file?)
    
If you'd written insertion sort over lists of integers, but I needed to sort lists of records with a low worst-case runtime, you'd have had to start all over.
</details>
</br>

Get in the habit of **asking questions**.  It will save you time and pain in the future. 

Don't misunderstand me: you'll all write _lots_ of code in this class. Your career in CSCI so far has likely trained you to write a lot of code. But just writing code is, frankly, _not good enough_.

## The 0320 Mindset

**This may be the weirdest course you'll take during your time at Brown CS. It will also challenge you in new ways. That is deliberate.**

Our goal is not to teach you to do better at programming courses, or even computer science courses in general. Our goal is to teach you to be a better engineer, period. That goal has some natural consequences.

The collaboration policy is part of that. We'll use Git, an industry standard version control system. If you haven't had Git experience yet, that's OK! Here's an example of how it works on a project I just happen to have here on my laptop. By the way, I'm using IntelliJ to work on this code. This course strongly encourages you to use (and supports) IntelliJ; the gear up sections today and tomorrow can help you set it up.

One advantage of using Git is that all the code from lecture will be available on a [public repository](https://github.com/cs0320/class-livecode) in the `F24` folder (for Fall 2024) and also in the `vignettes` subfolder, which I use for small examples that may or may not appear in class. You can clone the repository to experiment with the code on your own machine. **You should clone this repository as soon as you're able**; we'll use it for in-class exercises, and it gives you the ability to experiment with changing the code on your own machine. **Starting next week, I will assume that you have the repository cloned on your laptop, if you bring one.**

~~~admonish warning title="Class Prep and Spoilers"
If a filename or package has `prep` in it, I'm including it in the repository to help me structure the live coding session, and keep track of things like intentional and unintentional bugs. These are spoilers for class, and may not be reliable resources.
~~~

### A Little Bit of Generics

In today's project I've got a very basic `Student` class. Every `Student` has a todo list, and the contents of their todo list are passed in the constructor. 

```java
public class Student {    
    List<String> todos;
    public Student(List<String> todos) {
        this.todos = todos;
    }

    ...
    
}
```

We don't have any code yet to remove things, or add things to the list. What we do have is a method to find the _most common thing_ on the todo list. 

```java
    public String mostCommonTodoItem() {
        Map<String, Integer> counts = new HashMap<>();
        for(String s : this.todos) {
            if(!counts.containsKey(s)) counts.put(s, 1);
            else counts.put(s, counts.get(s) + 1);
        }
        String mostCommonItem = null;
        int howCommon = 0;
        for(String s : counts.keySet()) {
            if(counts.get(s) > howCommon) {
                mostCommonItem = s;
                howCommon = counts.get(s);
            }
        }
        return mostCommonItem;
    }
```

There might be more concise ways to write this, but this way is useful for what I want to demo. It breaks the problem in half:
* first, compute the number of times every item appears on the list; and 
* second, find which item had the highest count. 

Looking at this code, you might have some questions. One is whether I can really say there is _one unique_ most common item on the list. I'm making some unstated assumptions, aren't I? More on that later in the semester. 

For now, let's observe that the todo list for every student needs to contain `String` items. But there's no real reason for that. Our `mostCommonTodoItem()` method would work perfectly if we changed `String` to `Integer`. Or we changed `String` to `Object`, or even to some other more complicated type like `List<String>` (then each todo item would be its own list). But to make such a change, we need to modify _many_ places in the method, and copy it. We'd have `mostCommonTodoItem_String` and `mostCommonTodoItem_Int` and so on. That sounds like a lot of work. The code isn't _easily extensible_. 

We can fix that using Java generics. Rather than saying `List<String>`, what we want to do is speak of a list of some arbitrary type---that the method *doesn't need to care* about the details of. Let's call that arbitrary type `T` for short. Then we might say that the `Student` class has a field `List<T> todos`, and write the method this way:

```java
public T mostCommonTodoItem() {
        Map<T, Integer> counts = new HashMap<>();
        for(T s : this.todos) {
            if(!counts.containsKey(s)) counts.put(s, 1);
            else counts.put(s, counts.get(s) + 1);
        }
        T mostCommonItem = null;
        int howCommon = 0;
        for(T s : counts.keySet()) {
            if(counts.get(s) > howCommon) {
                mostCommonItem = s;
                howCommon = counts.get(s);
            }
        }
        return mostCommonItem;
    }
```

It's the same code we would have written if we'd changed `String` to some other type, except we're just plugging in this new name `T` instead. Here, `T` is called a _type variable_. **Crucially, a type variable is not a variable at runtime**. It doesn't hold a value or a reference. Instead, it's a variable that the *compiler* uses when it's reasoning about the program. We can make this code valid Java by declaring `T` in the `class` definition:

```java
public class Student<T> {
    ...
}
```

Every time we create a `Student`, that instance will have a todo list containing items of some type. That type will always have to be the same type for any specific student; that single type is the value of `T` (which only exists for the compiler). We can create students just like we would without the type variable, but we need to provide a little information, like this:

```java
Student<String> tim = new Student<>(List.of("lecture notes", "email", "email", "family", "email"));
Student<Integer> nim = new Student<>(List.of(1, 17, 3, 43, 1, 2, 5));
```
This is exactly the same thing you do when you create a new `List` or `Set` or `HashMap`! All of these data structures are implemented using type variables. They are a _great_ way to make your code easy to use and extend. (We'll revisit generics and type variables a little later in the semester, but this is as much as you need for now.)

~~~admonish note title="This isn't really about Java"
Most programming languages, at least those with a static type system, support this sort of thing. Technically, it's an example of something called [*parametric polymorphism*](https://en.wikipedia.org/wiki/Parametric_polymorphism). Even Python's type-hint system allows it. 
~~~

While we're here editing this class, there's something I don't like. What happens if the list is empty? Then the method returns `null`. This feels unsafe, or at least not very communicative. We could be throwing an exception that has more meaning---like `IllegalArgumentException` (or maybe even our own exception type). I'll add this to the start of the method:

```java
        if(this.todos.isEmpty()) {
            throw new IllegalArgumentException();
        }
```

Great! So we've made 2 improvements to the code: one which makes it more generic, and one that makes it a little more useful to the program that's calling it. 

Now that we've made this change, I'll just *commit* the change to my local repository. First, I'll tell Git that I want it to include the change I just made:

```
git add Student.java
```

At any point, I can ask Git for the `status` of the repository:

```
git status
```

which can help keep track of which files are changed, added (i.e., ready to be comitted) etc.

I see the file I want to change is ready, so I'll commit the change, with a human-readable message:

```
git commit -m "feat: generic student TODO list, better error behavior"
```

So far, the change is only on my _local_ machine: in the file, but also in the repository. If I want others on staff (and all of you!) to get the change, I need to `push` to the repo:

```
git push 
```

We can see a log of commits on the Github page for the project. Each of these entries shows a commit I've made in the past. If someone else wants to review the changes I've made, they can just look at the difference between commits. This is tremendously useful for group work, and most real engineering is group work. 

Now if any of you view the repo, you'll see my change. It's that easy! Here's a sketch image of what's going on. Always keep in mind that these three things are different:
* the files on your filesystem;
* the history and current version of those files in your _local_ repository; and
* the history and current version of those files in your _remote_ repository.

![](https://i.imgur.com/rRZsWx9.png)

As the semester progresses, we'll have expectations about your use of Git. For now, focus on your commits and pushes:
* Name your commits something informative, and give credit to anyone who pair-programmed or worked with you. (More on this in the gearup.)
* Commit and push regularly. Don't just push everything all at once on the day the sprint is due. If your laptop breaks, and you haven't pushed to Github, you will be a very unhappy person and we may not be particularly sympathetic.

In future, we'll ask you to use branches---which are a great way to develop in parallel with others. For the first sprint, working in the `main` branch is fine.

## Testing with JUnit

Unfortunately, I forgot to do something really important. 

Since this was an existing project, we had test cases written for it. I guess I should have run those tests _before_ pushing my update, huh? Let's have a look. Our tests use _JUnit_, a popular testing library for Java. How do we install JUnit? Just by adding it as a dependency in Maven, our Java package manager. Your Maven configuration usually lives in a single file: `pom.xml`. In my project, I have:

```xml
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>RELEASE</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.22.2</version>
            </plugin>
        </plugins>
    </build>
```

This loads JUnit for testing in my application. (The plugin is to help JUnit interoperate well with the build system we'll be using, Maven, which you may recall is the tool that uses this `pom.xml` file.)

I previously had this test in my suite: 

```java
    @Test
    public void emptyList() {
        Student student = new Student(List.of());        
        assertNull(student.mostCommonTodoItem());
    }
```

There are now some warnings in the test, because `Student` is now generic, and there are no angle-bracketed type parameters in my test. But we can fix those pretty easily, just by adding `<>` or `<String>` in some places. 

But the test still fails. I guess I put in a bug by mistake. But I don't really understand how, or what the problem is. How do I work through the problem?

~~~admonish warning title="Watch out!"
This is a simple issue that you may immediately see and know how to fix. That's not the point. If it were something bigger, it would be difficult to fit it into class. So let's treat this as a real bug, and learn better how to diagnose such problems.
~~~
 
## The 0320 Debugging Recipe

I think I'm supposed to follow this [debugging recipe](./recipe.md). And why don't _you all_ help me follow it? It starts in a strange way:

#### Rule One

"Never debug when tired or angry."

I don't feel particularly angry, and I just had a sandwich. So I think I'm good to go. (This rule is not a joke, however. When you're tired and/or angry, your effectiveness per unit time goes down, and you may end up convincing yourself to make changes that are not good ideas in hindsight and make the problem even harder to fix. This is a reason to **start work ASAP**.)

#### What's Wrong?

Assemble your knowledge. Write no more than two sentences for each question:
* What is the purpose of the code you're working on?
* What steps can you perform to reproduce the bug?
* What is the expected behavior/result, and what is the unexpected actual behavior/result?
* Why do you expect the result that you expect?

Let's give it a try.
> I'm working on a method that finds the most common item in a list.
> I can reproduce the bug by running the test suite for the `Student` class. The failing test creates a `Student` instance with an empty list, and then invokes the most-common method.
> I expected this test to pass. I made the code objectively better, so tests shouldn't be failing.

#### Tell the Story

Now describe how you think the system operates as it approaches the unexpected actual result. Write your description as a series of steps. Use no more than one or two sentences for each step, but each step should be testable as a hypothesis about how the system works.

> The student is created, and its `todos` field contains a reference to that empty list. Then the method is called, the empty-list check is hit, my exception gets thrown, and the test should pass.

#### Localization

Confirm each step in your description is accurate. Use any reasonable means (e.g., print statements or a debugger). The **first step** where the program behaves unexpectedly is a *possible* location for the original bug. More commonly, it contains the call site for the actual buggy code.

> I see the student is created, and I know the method is called because I added a `println` to check.
> I see my exception is being returned, because I added a `println` to check.*
> But an exception is not the same as `null`. 

Notice how this process is leading us to the problem: that an exception being thrown is not the same as returning `null`. This is a pretty simple bug, but the process of _narrowing your attention_ through experiments is a professional technique that works even in enormous enterprise systems.

**We expect you to follow the recipe, especially during collab section. If you were my debugging partner, my answers to those questions may have pointed you directly to the problem!**

I guess I need to rewrite my test. But wait. Isn't what we just did _cheating_? I let you see my code, and that might influence your solution to this project. 

No. In 0320, we have an open collaboration policy---even about code. But in exchange, we need you to follow some basic professional standards. Things like: giving credit to sources, not short-circuiting anybody's learning, and never adapting code you don't understand or can't test well. See the missive for the full statement. 

A failure to meet these basic professional standards would be a violation of Brown's academic code. It would also get you in trouble at work. To run a course with such an open policy is _risky_---if abused, it harms your learning and our ability to keep the course collaborative. So, to protect the format of the course, if these standards were violated I would have to file an academic code case and then relentlessly pursue it.

But I won't have to do that, right?

### What About AI?

What about it? You'll be allowed to use it, just like any other resource. However, you'll need to conform to the above standards, just as if it were a collaborator. 

## How Does Grading Work?

0320 is mandatory S/NC. We _do_ give S with distinction. The course is divided into 2 parts: the _sprints_ and the _term project_. The sprints let you demonstrate command of new technical skills (which we give formative feedback on). The term project lets you show you can apply those skills in a new context of your own.

The missive talks at length about grading; I won't try to duplicate that information here. But some changes you might want to be aware of include the following.

### New: 1-week sprints and feedback

New this semester, we've factored each of the former 2-week sprints out into 2 1-week sprints. This gives us a better cadence for feedback. You'll alternate between asycnhronous video demos and synchronous demos each week, and the demos are the primary way your mentors will generate feedback.

You'll receive access to a spreadsheet where your mentors will leave formative feedback _every week_, along with whether you've met expectations for the week. We'll expect you to work on addressing this feedback between sprints. See the missive for more information.

### New: Demo Recipes

We'll also be providing you with a "demo recipe" to help you prepare, and giving you access to the recipe your mentors will be using to guide their feedback. There are no secret rubrics in 0320. But we do want to see you meet expectations. 

### New: Collaboration Crests 

We would like to more strongly encourage collaboration between students. You will be required to, e.g., have a design discussion with someone you don't know, do code review, and so on. See the missive for more information.

### A Focus on Testing

We'll talk more about testing on Tuesday, but it should go without saying that in 0320, we take testing seriously. The handouts contain *pretty good advice* on meeting our requirements. Read them. 

**It is a bedrock principle of 0320 that if you cannot demo or test something, it's not actually done.**

## Aside: Test Coverage 

There are a few metrics for how good a test suite is. One is "test coverage", which measures how much of the code the suite exercises. Although we encourage you to run from the terminal using `mvn`, IntelliJ is probably the best way to get test-coverage information easily, without more configuration work. To do this, run a test file in IntelliJ, then select "Run with Coverage" from the "Run" menu:

![The run menu's run-with-coverage option](./run-with-coverage.png)

This will open a new pane in IntelliJ:

![A new pane labeled "Coverage", showing class, method, and line coverage](./coverage-window.png)

My 3 tests for today's lecture are only exercising 29 percent of the code! That's a bit worrying. (We'll expect at least 50 percent line coverage on CSV, which should be very easy to reach.) If you click on the package name, it will show you lower-level information:

![Details for the `Student` class, the `Main` class, and the `prep` sub-package](./more-coverage.png)

Actually, my coverage isn't bad after all. I simply don't have tests in this file for my course-prep code, or for the `Main` class. That's OK; all lines in the `Student` class are being exercised. 

~~~admonish warning title="Coverage isn't everything!"
Don't view a high level of coverage as a guarantee! Coverage is imperfect; there are a lot of things it doesn't measure. But it's one means by which you can discover problems with your testing. 

On a similar note, there's diminishing returns on time to improve coverage. In a real, large code base, it's _far_ more difficult to move from 90% to 95% than it is to move from 50% to 65%. Don't spend all your time trying to improve coverage at the exclusion of all else, but don't neglect it either. Our sprints are small, compared to most real-world projects!
~~~

