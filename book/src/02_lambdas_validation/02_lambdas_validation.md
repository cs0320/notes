# Agile, Lambdas, and Validation

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

## Logistics 

**If you haven't yet installed Node or cloned the starter code, it would be a good idea to do that ASAP.**

We don't have a no-laptops policy in 0320. But if you're going to play chess or write an essay while in class, please sit where you won't distract anyone sitting behind you. 



## Agile Development

We're going to be using a few terms of art in 0320. While we do put a bit of our own spin on these (largely because this is a class, and not a full-time job) it's important to understand what's going on. 

We say that a development methodology is _agile_ if, broadly speaking, it prioritizes the ability to change plans in response to regularly-sought feedback. Once we try to define it more precisely, you'll find multiple competing definitions, and many competing methodologies that purport to be "agile". But change and feedback are good enough for us today. 

Usually, you'll see the term used in contrast to "waterfall" development, where the software project proceeds along a linear path, like this:
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

## Reading: Clever Manka 

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

Stories like this appear in numerous places throughout the world. For example, India has the story of [Hiranyakashipu](https://en.wikipedia.org/wiki/Hiranyakashipu), a king with a boon protecting him from death "by day or by night", "indoors and out", etc. Narasimha, an avatar of Vishnu, finds a way around the riddle. 

These stories are so common that I might say humans find something universally valuable about them. 
but what in the world does a fairy tale have to do with *testing*?

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

## Runtime Validation

Ok, so we're on the lookout for faulty assumptions that _we_ might make when programming. But what about _other people_ who might be writing code we depend on&mdash;or even code that calls ours? We can't solve this problem, and (as careful as we might be) we can't entirely solve it for ourselves, either. So we'll need to make our code _robust_ against bugs, whether they are our mistakes or others'. 

_Runtime validation_ involves checking for issues with data your code is given, unexpected changes in state, and so on. Here are two examples. 

### Example 1: User Input

Suppose that a user just typed in a pair of numbers and we want to know if one is bigger than another. Because they just arrived, they will be strings, so we need to convert them. No problem: 

```typescript
function rawGreaterThan(arg1: string, arg2: string): boolean {
    return parseInt(arg1) > parseInt(arg2)
}
```

This seems reasonable enough, but it forgets something important about numbers in JavaScript: `NaN` (not a number) is a number. Since TypeScript is JavaScript with added protection, the same is true in TypeScript. Imagine that a user accidentally types "!00" instead of "100". In Java, we'd get an exception since `"!00"` can't be converted to a number. But in TypeScript, `parseInt("!00")` produces a value: `NaN`. And `NaN` isn't greater or less than anything! (It can't even be _equal_ to itself: `NaN == NaN` evaluates to `false`.) So:

```typescript
> parseInt("!00") > parseInt("100")
false
> parseInt("!00") <= parseInt("100")
false
```

Oh, dear. It's one of those pesky boundary conditions! But the problem is _invisible_ outside of our function. The caller only gets a boolean. Let's do some _validation_ to protect them and us. We'll first check that both arguments can be converted:

```typescript
function rawGreaterThan(arg1: string, arg2: string): boolean | undefined {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    // num1 === NaN won't work! Instead:
    if(Number.isNaN(num1) || Number.isNaN(num2)) return undefined
    return parseInt(arg1) > parseInt(arg2)
}
```

Now the caller will be given something special if there's an issue converting the input to numbers. We could improve this, actually: `undefined` is better than hiding the problem, but it doesn't communicate much. We could throw an error, but instead let's explore building a better error value. 

```typescript 
interface ConversionError {
    error: "parseInt"
    arg1: string 
    arg2: string
}
```

Yeah, that's a string literal as the _type_ of the `error` field. In TypeScript, this means the type containing only that string. Thus, the `error` field can only ever be the string `"parseInt"` So why have that field at all? Because if our larger program can ever produce a different kind of conversion error, we can add other options via union types:

```typescript 
interface ConversionError {
    error: "parseInt" | "parseFloat"  // | ... | ... | etc.
    arg1: string 
    arg2: string
}
```

If we said `error: string` instead, we'd be allowing _any_ old string. Sometimes this is what you want, but if you're establishing a protocol for reporting errors, you probably want an enumeration of error codes, not arbitrary strings. Anyway, now we can write:

```typescript
function rawGreaterThan(arg1: string, arg2: string): boolean | ConversionError {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    if(Number.isNaN(num1) || Number.isNaN(num2)) 
        return {error: "parseInt", arg1: arg1, arg2: arg2}
    return parseInt(arg1) > parseInt(arg2)
}
```

The caller is now being told _exactly what the problem is_, not only that they had some kind of problem. This is only possible because we're now validating the input. 

### Reading Data 

The same problem occurs if you're reading in data from files or responses to your web requests. Suppose the registrar stored student information in a comma-separated-value (CSV) file:

```csv
Name,Credits,Email
Tim Nelson,10,Tim_Nelson@brown.edu
Nim Telson,11,MYAWESOMEEMAIL
```

If I expect the third column to contain an email address, I'm going to be _very_ surprised with the data I get from the second row. Hopefully the registrar is validating every column of every row so they can avoid relying on the bad data. But now it's not as simple as it was before: do I need to manually write a validation function that matches all possible email addresses? Argh!

### Library Support: Zod

Fortunately, people write and share libraries that solve real problems. We'll be using a library called [Zod](https://zod.dev), which is built to help us with exactly these kinds of validation tasks. Zod is free, open source, and widely used. Zod works off of something called a _schema_, which is kind of analogous to a type (not entirely; more on this later). Here's a schema to validate each CSV row according to the registrar's expectations:

```typescript
const studentRowSchema = z.tuple([z.string(), z.coerce.number(), z.email()])
```

Zod schemas are compositional. `z.string()` is a schema that matches any string. `z.coerce.number()` is a schema that matches any number or any string that can be converted to a number. `z.email()` is a schema that matches strings containing _email addresses_. And `z.tuple` takes an array of schemas and matches arrays of exactly the same length, where each of the sub-schemas matches its corresponding array element. 

I hear that at this point, you might be enhancing a CSV parser. Probably it splits a big file into rows, and then splits each row by `,` (or something like that) to produce an array. So for the 2-row example above, you might get a `string[][]` that looks like:

```
[["Tim Nelson","10","Tim_Nelson@brown.edu"],
 ["Nim Telson","11","MYAWESOMEEMAIL"]]
```

The first row will match the schema, but the second won't: "MYAWESOMEEWMAIL" isn't an email address. Zod will give a structured error for this failure, although it contains even more detail than the `parseInt` error we built before. 

Zod makes validating external data much, much easier. **Whenever validation becomes non-trivial, stop writing ad-hoc `if` statements and use Zod instead.**

### Anonymous Functions

Zod doesn't just do validation: it can also transform data into new shapes. But it needs us to tell it how that transformation works: a _strategy_ function that says how to map the old shape into the new one. Often, we'll use an anonymous function for this. Anonymous functions are sometimes called "lambdas" (e.g., in Python). Even Java has them in the form of the `Function<T, R>` interface and special syntax to build them concisely. TypeScript's syntax for these is quite similar to Java's.

For example, let's turn a (validated) CSV row into an object instead:

```typescript
const studentRowSchema = z.tuple([z.string(), z.number(), z.email()])
                          .transform(arr => ({name: arr[0], credits: arr[1], email: arr[2]}))
```

Now the first row becomes an object: `{name: "Tim Nelson", credits: 10, email: "Tim_Nelson@Brown.edu"}`. 

Passing functions arguments to to other functions is so powerful that it appears in multiple contexts. In Object-Oriented Programming, you see it everywhere under the name of "strategy pattern". For example, [Java's `Collections.sort` method](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#sort-java.util.List-java.util.Comparator-) takes an object called a `Comparator`. A `Comparator` implements a method that takes two elements of the collection and says whether one is greater than another. In this way, the `Collections` library allows a single type to be sorted many different ways. 

~~~admonish note title="But why not just implement `Comparable`?"
Many objects implement Java's `Comparable` interface, and `Collections.sort` will indeed use that if no comparator is provided. The advantage of taking arbitrary comparators is in its flexibility: the caller might want to sort in ascending or descending order for example. Records might be sorted by one key or another key, and so on. The strategy pattern is all about flexibility.
~~~


## Exercise

I'm not going to start the _required_ exercises this early in shopping period. But I'd still like us to get some practice with TypeScript. 

### Tools Challenge: `package.json` 

Let's start with the toolchain we're using in the course. You've probably cloned the starter repository by now. Let's look at the `package.json` file together. JSON means "JavaScript Object Notation", and it's a very common text data format. You'll see fields like `dependencies` and `scripts` and so on. *What do you think they mean? How do they interact with the `npm` console command?* 

~~~admonish note title="Why won't I just tell you?"
Research has shown that instruction is more effective if students _commit to a hypothesis_ first, rather than being told the answer immediately. I also want you to finish 0320/1340 with a confidence in making guesses that might be wrong. 
~~~

### Design Challenge: Unchecked Casting 

Just like Java, TypeScript has a way to tell the type checker to be quiet because you know best. We call these "unchecked typecasts". In TypeScript, this happens whenever a value has type `any`. You might explicitly cast this (via `as any`) or TypeScript might infer the type because it has no further context. The `any` type exists because TypeScript needs to interoperate with untyped JavaScript, and it's dangerous to keep around if you don't need it. 

Union types mean that TypeScript may be "uncertain" about your code. Here's an example:

```typescript
function whatToDo(input: string[] | number): string {
    return input[0]
}
```

If the input is a string array, this is fine. But what if it's a number? TypeScript reports this problem with the following error: 

```
Element implicitly has an 'any' type because expression of type '0' can't be used to index type 'number | string[]'.
  Property '0' does not exist on type 'number | string[]'.ts(7053)
```

**What should you do about this?**

<details>
<summary>Think, then click!</summary>

Any time you see something like "Element implicitly has an 'any' type" you should be suspicious. It means that you haven't given TypeScript enough information. This information might need to go in your function headers, in your variable declarations, or the logical flow of your code. Notice what happens when I add an `if` statement:

```typescript
function whatToDo(input: string[] | number): string {
    if(typeof input === "number") return ""
    return input[0]
}
```
The error goes away! TypeScript looks at your conditionals for hints, and uses those hints to resolve union types and other kinds of uncertainty. This is called _narrowing_, because TypeScript is able to reduce the size of the set of possible values.
</details>

We'll talk more about this trick soon. 

~~~admonish warning title="The `typeof` operator"
The `typeof` operator is technically part of JavaScript, and it isn't very precise at all! JavaScript has only a few "types":
* `string`;
* `object`;  
* `number`; and
...only a few others. 

JavaScript, on its own, makes no distinction between an array and an object, or between two different kinds of object. This is one thing TypeScript handles a lot better, but it still can use these basic JavaScript checks. 
~~~

