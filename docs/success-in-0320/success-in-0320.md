# Success In 0320 

## Logistics

**Watch room assignments carefully!**

* I check override requests every day after the course starts. 
* **If you get an override:** accept ASAP, so we have good information. CAB is not always accurate.
* **If you arre still shopping:**, keep 0320 in your cart so that you see announcements, etc. If we don't know you're a prospective student, we can't share news with you.
* **You need the prerequisites:** If you haven't completed 0200, 0190, or a comparable course, you cannot take 0320 yet. (If you're a transfer student and concerned, let's talk; I was also a transfer student as an undergrad so I have some understanding of potential worries.)

!!! note "0320 vs. 1340"
    When I say "0320" in the course notes, I mean both 0320 and 1340. 

## Placeholder 

This document is here while I switch the notes over from `mdbook`. 

<!-- ## Welcome!
Before we get started, turn to the people sitting next you to now and introduce yourself. 

The most important part of 0320 is *collaboration*. With the exception of the very first assignment, everything in 0320 is group work. 
* You'll be submitting your work to repositories that everyone in the class can (eventually) read.
* You'll be helping one another solve bugs and design problems (even if you're in different project groups; this is a requirement). 
To make this work, we need a professional and friendly environment. 

We'll be passing out index cards. I like to anonymously learn some important things about students in this class, so please fill one out, answering: 
* What is a **goal** you have for 0320?
* What is something you **need** to succeed in 0320?
* What is something you're **afraid** of in 0320?
At the end of class, leave your card either here in front or on (one single) chair in the back so I can collect. 

### 0320 is Different

You'll want to read the missive. You may not need to read _all_ of it super deeply yet, but you should note the ways that 0320 is different from what you're used to. E.g., you'll be getting formative feedback every week from a mentor. Like in industry, you will not be graded by an autograder.

### TA Introductions

**Speaking of mentors, let's introduce the TAs!**


## Disclaimer

This offering of 0320 is experimental. Much of the assignment content is new, as are the structured AI content. We've tried to minimize issues, but issues will happen. We'll act to mitigate them. Likewise, the perspective on AI we use is based on common practice as of summer 2025. I've reserved sprint 9 to address anything new that comes up (and have an assignment in reserve in case nothing does). 

## Immediate Advice

The first sprint goes out Monday, and there's a setup deliverable due before then. Please do it soon; you don't want to spend a lot of time early next week on setting up VSCode and so on.

Go to gear up sections. This semester, they're on **Mondays and Tuesdays** (with one exception around IPD). Switching doesn't require a "conference" switch in CAB. 

Read [lecture notes](https://cs0320.github.io/notes/) and [livecode](https://github.com/cs0320/class-livecode). More than reading the code examples, pull the code and experiment with them! I try to strike a balance between depth and drill in class, which means that when we have in-class work, these resources will be vital references. (Today, for example, I won't talk through every bullet point in these notes.)

Prototype early. (Paraphrasing Andy: *Start soon! Start yesterday!*)

Be aware that while this is an S/NC course, it is a lot of work. To quote a very wise remark from prior feedback: *"You will work very hard, but not get an A".* 

### Reading for Next Time

Read the missive. 

Also, a short non-technical reading: [Clever Manka](https://www.gutenberg.org/files/33002/33002-h/33002-h.htm#Page_165). Read it. **What does it have to do with software engineering?**

There will be readings, but you won't need to pay for them.

## Programming vs. Engineering

Let's say I asked you to open up your laptop and write me a sorting algorithm in the language of your choice. How would you react?

??? note "Think, then click."
    Hopefully you didn't immediately start programming. I didn't really give you enough information, did I? I didn't say (among other things):

    * what kind of values you would have to sort; 
    * whether the sort needed to be stable, or in-place, or if there were any runtime requirements; or
    * what the input interface should be (do you need to do file I/O or parse a CSV file?)

    If you'd written insertion sort over lists of integers, but I needed to sort lists of records with a low worst-case runtime, you'd have had to start all over.

</br>

Get in the habit of **asking questions**.  It will save you time and pain in the future. 

**Communicate** clearly and often. It will save you time and pain in the future. 

**Document your assumptions and needs**. It will save you time and pain in the future.

Don't misunderstand me: you'll work with a lot of code in this class. But just writing code is, frankly, _not good enough_.

## What makes "good software"?

There are many valid viewpoints on this. In the context of 0320, we're going to think about a few dimensions. 
* Is the software _ready for change_? (Can it be extended easily, and without modifying the original code?)
* Is the software _safe from bugs_? (Not just "bug free", but resilient to the bugs of other software that might call it, or that it might call.)
* Is the software _easy to understand_? (Is it well documented? Is it designed in a way that other engineers will be able to follow without a lot of work? Is it clear how to use it?)
* Is the software _fit to purpose_? (Does it do what it is supposed to do? Figuring that out involves _a lot of work_, because other people are involved.)

That last category is incredibly broad. For me, it incorporates issues beyond functional correctness like:
* performance, 
* security, 
* harm minimization, etc.

## The 0320 Collaboration Standard

**This may be the weirdest course you'll take during your time at Brown CS. It will also challenge you in new ways. That is deliberate.**

Our goal is not to teach you to do better at programming courses, or even computer science courses in general. Our goal is to teach you to be a better engineer, period. That goal has some natural consequences.

The collaboration policy is part of that. We'll use Git, an industry standard version control system. If you haven't had Git experience yet, that's OK! Here's an example of how it works on a project I just happen to have here on my laptop. By the way, I'm using IntelliJ to work on this code. This course strongly encourages you to use (and supports) IntelliJ; the gear up sections today and tomorrow can help you set it up.

One advantage of using Git is that all the code from lecture will be available on a [public repository](https://github.com/cs0320/class-livecode) in the `F25` folder (for Fall 2025) and also in the `vignettes` subfolder, which I use for small examples that may or may not appear in class. You can clone the repository to experiment with the code on your own machine. **You should clone this repository as soon as you're able**; we'll use it for in-class exercises, and it gives you the ability to experiment with changing the code on your own machine. **Starting next week, I will assume that you have the repository cloned on your laptop, if you bring one.**


## What About AI?

We'll use it. Please see the missive. There's lots of new stuff, and I've written enough text about it already. :-)

## How Does Grading Work?

You may look at the first assignment and think "OMG I am not prepared!" But you are. This course is designed to prompt this feeling&mdash;in a safe environment, so you can build the skills necessary to navigate unpreparedness. The course works for those who embrace our (admittedly unusual) system. 

If you're a _highly prepared_ student and you find that even most supplemental problems aren't challenging you: this is your chance to cut loose. Impress me. Final demos are public for everyone, but for Master's students and undergraduates who opt in, they will be _publicized_. 

0320 is mandatory S/NC. We award "S with distinction" based on completing supplemental sprint challenges, exceptional professionalism, and strong performance on the term project. 
  * The sprints let you demonstrate command of new technical skills, which we give formative feedback on. 
  * The term project lets you show you can apply those skills in a new context of your own. Expectations are stronger here: I want everyone to finish 0320 with a good item for their portfolio (whether you're going into traditional SWE or not). 

The missive talks at length about grading; I won't try to duplicate all that information here. However, here are some key features of 0320's grading.

**1-week sprints:** You'll have a deliverable every week. This gives us a better cadence for feedback. You'll alternate between asynchronous video demos and synchronous demos each week, and the demos (*and your answers to questions they ask*) are the primary way your mentors will generate feedback.

**Feedback Spreadsheet:** You'll receive access to a spreadsheet where your mentors will leave formative feedback _every week_, along with whether you've met expectations for the week. We'll expect you to work on addressing this feedback between sprints. 

**No Hidden Rubrics:** There are no secret rubrics or hidden test suites in 0320; we want you to know what our expectations are. You can see our grading instructions, and a recipe for giving demos, linked in the first sprint. (We do provide mentors with some additional private material to help them give feedback efficiently, but everything in that material is also in the sprint handouts.)

**Collaboration Matters** We would like to more strongly encourage collaboration between students. You'll need to earn a certain number of crests throughout the semester and per sprint. **You will handle reporting this to us on your feedback sheet.**

**Testing Matters:** We'll talk more about testing on Tuesday, but it should go without saying that in 0320, we take testing seriously. The handouts contain *pretty good advice* on meeting our requirements. Read them. 




## TypeScript

We're going to be using TypeScript for nearly all of this course. Last year, we used Java for the "back end" and TypeScript on the "front end", and it was tough to devote enough time to general TypeScript practice. So we're doing everything in one language. The first two weeks give you an introduction.

TypeScript is essentially "JavaScript with types". It transpiles to JavaScript, meaning that Node and your browser only need to "understand" JavaScript. Why do we need types here, though?

### Equality

When I'm learning a new language, I like to identify language features that I rely on, and experiment with them. Coming up with these facets isn't always easy, which is why we're doing it together. For instance, let's check out _equality_, a deceptively simple yet subtle idea that many languages differ on. We've got a couple options for our experiments:
* If we were interested in _web_ behavior, I'd use the console of whatever browser I wanted. (Safari's JS console is Command-Option-C, if you've enabled developer tools.
* If we were interested in general _program_ behavior, I'd just run Node. Node is a runtime library for JavaScript that's often used for backend servers&mdash;the same sort of setting you might see a Java program used for. 

Behavior isn't always the same between these. We'll get to that later. For now, let's use Node.


```javascript
> 15 == "15"
true
> 15 == true
false
> 1 == true
true
0 == false
true
```

Already we've learned a great deal. JavaScript's `==` operator performs type conversion before comparing values. It allows us to pretend that the number `1` is "true" and that the number `0` is "false", but other numbers aren't equivalent to either. 

Those of you who have programmed in Racket before: notice this is different from Racket! In Racket, every non-false value (Racket calls false `#f`) is considered true. The same is true in many other languages.

JavaScript has a second equality operator, `===`, that checks for equality _without_ type conversion. So:

```javascript
> 15 === "15"
false
```

Java also has two different types of equality (`==` and the `.equals` method), but there the difference has nothing to do with implicit type conversion, but with references vs. structural equality. JavaScript's implicit conversion adds an extra layer of complexity.

### Arithmetic

Let's try a few arithmetic operators that are often overloaded across different languages.

```javascript
> '1' + 1
'11'

> 1 + '1'
'11'

> 1 - '1'
0

> '1' - 1
0
```

JavaScript tries to "do the reasonable thing" whenever possible. This can lead to surprising bugs; When in doubt, use explicit conversion functions (e.g., `parseInt`). In fact, let's try a couple more (Credit for these to [Gary Bernhardt](https://www.destroyallsoftware.com/talks/wat) from 2012---it's 4 minutes long; watch it.) For context, `[]` denotes an array or list in JavaScript and `{}` denotes an object.

```javascript
> [] + []
""

> {} + {}
'[object Object][object Object]'

> [] + {}
[object Object]
```

Do you see why TypeScript is helpful, now? JavaScript lets you throw off the constraints of the type system, but those constraints are like a safety belt on a roller coaster.

#### Supplemental: What's Really Happening?

The details involve how JavaScript is implicitly converting between different types. Before applying `+`, it converts to a "primitive" type, which for an object is a string. An empty array is converted to the empty string. And so on. The details would consume a full class, or more! Just beware, and embrace types.

### Objects

While we won't be using TypeScript _classes_ much in 0320, we can't avoid using _objects_. Objects are collections of fields; there's no sharp distinction between fields that are methods and fields that are data. If you've used Python before, these may remind you of dictionaries. For example:

```javascript
> const cat = {talk: function() { console.log('meow'); }}
undefined
```

This defines a value for the variable `cat`. The console (in both a browser and in Node) displays `undefined` because that's the return value of the definition statement.

```javascript
> cat.talk
function talk()
```

The value of `cat.talk` is a _function_. We can pass it around the same way we would a string or a number. But we can also call it:

```javascript
> cat.talk()
meow
undefined
```

Again, the _console_ is printing the "meow" and then saying what the return value was. You won't need to worry about this apparent double result when you're working with TypeScript in general.

Don't get too attached to the method-style syntax, however. Objects in TypeScript are more flexible. A field is a field, no matter what it contains:

```javascript
> cat["talk"]
function talk()
> cat["talk"]()
meow
undefined
```

You'll get a lot more practice with TypeScript over the next 2 weeks.

## TypeScript Types 

TypeScript works a little bit differently from Java. [See the Thinking Like an Engineer: Types](https://docs.google.com/document/d/115A3utnCRM71jOGlXV6hqGzvHgA7psPo218JpXtnSPI/edit?usp=sharing) document for more. I'll cover some of them live today and Tuesday. 

We'll be using a library called Zod for validation, and to enrich what types can give us. Zod appears in the very first sprint! I'll be talking about it on Tuesday, but **do not wait until then** to start the sprint. There are other, Zod-free deliverables.

 -->
