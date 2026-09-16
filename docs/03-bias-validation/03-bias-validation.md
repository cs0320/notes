# Bias and Validation

!!! warning "Laptops in Class"
    We don't have a no-laptops policy in 0320. But if you're going to play chess or write an essay while in class, please sit where you won't distract anyone sitting behind you. 

This chapter contains content that we won't cover in class: at minimum, the **Agile Development**, **Sprints**, and **User Story** sections. 

<!-- 
  Omitted, but still here:
- refinements (Escaping the `any` type)
- anonymous functions
- tools challenge (package.json) -->


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

!!! warning "Developers are users too!"
    If you're building a software package that is intended for other developers to use, _they are potential users_! In this class we will be giving you user stories from the developer-user perspective in addition to the end-user perspective. Your API design, documentation, etc. will matter to developer users.






## Testing as a Human

Suppose your job is to build a statistical app that summarizes United Nations data on population, GDP, and so on. You need to test your app, so think of a country. What country are you thinking of?

??? note "Think, then click!"
    Chances are, the country you thought of was:

    - close to home; 
    - large; or
    - in the news often.

    And it's even more likely that the country you thought of was **currently in existence**. You probably didn't say "the USSR" or "Austria-Hungary". And note that my choices there were all limited by my own historical knowledge. I went and [looked up more](https://en.wikipedia.org/wiki/List_of_former_sovereign_states) after writing that sentence. Even if we only count nations that existed after the U.N. was created, there are many: the Republic of Egypt (1953-1958), the Fourth Brazilian Republic (1946-1964), etc.

    This is an example of something called _availability bias_ (or the _availability heuristic_). All humans exhibit it, and *usually* it's an advantage: just like caching in a program, our brains tend to recall information in cache. For us, it's an energy-saving measure.

I'm not a cognitive scientist! If you want to learn more about this in depth, take a CLPS class. But even so, let's ask: **How does this cognitive phenomenon impact software testing?**

??? note "Think, then click!"
    You probably test what you have loaded into your mental cache. If you aren't thinking of it at the moment, or haven't been thinking of it recently, you likely won't test it unless you work to find examples outside your current context.

    Even worse, if you aren't aware of the thing to begin with, you won't think to test it. Beware of the kind of thing that Iain Banks called an "outside context problem", translated from fiction into the real world of testing. This is why getting outside feedback from others can be so valuable for testing.

Keep this threat in mind as you practice testing in this course.

Here's an example: "I have tested a positive number, and I have tested a negative number." Surely all numbers are positive or negative. **(Is this true?)**

Here's another example: "I have tested this function, which accepts a Java `Boolean`, on both values: true and false." **(What's missing?)**

Never assume that the obvious partition of the space actually covers the space; be on the lookout for special cases, outliers, and even new dimensions about which to think. This isn't only about testing, either---see, for example, the [Falsehoods Programmers Believe About Time](https://gist.github.com/timvisee/fcda9bbdff88d45cc9061606b4b923ca). Part of programming defensively is trying to avoid making unnecessary assumptions, while still allowing for extensibility. Keep this in mind as we start to code (and test) together.

## Building Defensively: Runtime Validation

Ok, so we're on the lookout for faulty assumptions that _we_ might make when programming. But what about _other people_ who might be writing code we depend on&mdash;or even code that calls ours? We can't solve this problem, and (as careful as we might be) we can't entirely solve it for ourselves, either. So we'll need to make our code _robust_ against bugs, whether they are our mistakes or others'. 

_Runtime validation_ involves checking for issues with data your code is given, unexpected changes in state, and so on. Here are two examples. 

### Example 1: User Input

Suppose that a user just typed in a pair of numbers and we want to know if one is bigger than another. Because they just arrived, they will be strings, so we need to convert them. No problem: 

```typescript
function rawGreaterThan(arg1: string, arg2: string): boolean {
    return parseInt(arg1) > parseInt(arg2)
}
```

This seems reasonable enough, but it ignores something important about numbers in JavaScript: `NaN` (not a number) is a number. Since TypeScript is JavaScript with added protection, the same is true in TypeScript. Imagine that a user accidentally types "!00" instead of "100". In Java, we'd get an exception since `"!00"` can't be converted to a number. But in TypeScript, `parseInt("!00")` produces a value: `NaN`. And `NaN` isn't greater or less than anything! (It can't even be _equal_ to itself: `NaN == NaN` evaluates to `false`.) So:

```typescript
> parseInt("!00") > parseInt("100")
false
> parseInt("!00") <= parseInt("100")
false
```

Oh, dear. It's one of those pesky boundary conditions! But the problem is _invisible_ outside of our function: the caller only gets a boolean, so they can't tell that a problem even happened. 

!!! note "Exceptions"
    This is a situation where exceptions might be worth using. We're pretending they don't exist 
    in this class, for the most part. One reason is that TypeScript doesn't have "checked" exceptions, so the type system can provide very little protection. 

Let's do some _validation_ to protect both our caller and us. We'll first check that both arguments can be converted:

```typescript
function rawGreaterThan(arg1: string, arg2: string): boolean | undefined {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    // num1 === NaN won't work! Remember that NaN isn't equal to anything. Instead:
    if(Number.isNaN(num1) || Number.isNaN(num2)) return undefined
    return parseInt(arg1) > parseInt(arg2)
}
```

Now the caller will be given something special if there's an issue converting the input to numbers. We could improve this, actually: `undefined` is better than hiding the problem, but it doesn't communicate much. Let's explore building a better error value. 

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

Fortunately, people write and share libraries that solve real problems. We'll be using a library called [Zod](https://zod.dev), which is built to help us with exactly these kinds of validation tasks. Zod is free, open source, and widely used. Zod works off of something called a _schema_, which is kind of analogous to a type (but not really; more on this later). Here's a schema to validate each CSV row according to the registrar's expectations:

```typescript
// Mouse over type: z.ZodTuple<[z.ZodString, z.ZodCoercedNumber<unknown>, z.ZodEmail], null>
const studentRowSchema = z.tuple([z.string(), z.coerce.number(), z.email()])
```

Zod schemas are compositional. `z.string()` is a schema that matches any string. `z.coerce.number()` is a schema that matches any number or any string that can be converted to a number. `z.email()` is a schema that matches strings containing _email addresses_. And `z.tuple` takes an array of schemas and matches arrays of exactly the same length, where each of the sub-schemas matches its corresponding array element. 

I hear that at this point, you might be enhancing a pre-existing CSV parser. Probably it splits a big file into rows, and then splits each row by `,` (or something like that) to produce an array. So for the 2-row example above, you might get a `string[][]` that looks like:

```
[["Tim Nelson","10","Tim_Nelson@brown.edu"],
 ["Nim Telson","11","MYAWESOMEEMAIL"]]
```

Calling a schema's `safeParse` method in Zod will return either a "success" or "failure" type. If we call `parse` instead then we might get an exception. I think `safeParse` is better, because it lets us keep some useful context for the caller in a normal value:

```typescript
const row1 = studentRowSchema.safeParse(["Tim Nelson", "10", "Tim_Nelson@brown.edu"])
const row2 = studentRowSchema.safeParse(["Nim Telson", "11", "MYAWESOMEEMAIL"])
```

The first row will match the schema, but the second won't: "MYAWESOMEEWMAIL" isn't an email address. Zod will give a structured error for this failure that contains even more detail than the `parseInt` error we built before. 

Zod makes validating external data much, much easier. **Whenever validation becomes non-trivial, stop writing ad-hoc `if` statements and use Zod instead.**

<!-- ### Anonymous Functions

Zod doesn't just do validation: it can also transform data into new shapes. But it needs us to tell it how that transformation works: a _strategy_ function that says how to map the old shape into the new one. Often, we'll use an anonymous function for this. Anonymous functions are sometimes called "lambdas" (e.g., in Python). Even Java has them in the form of the `Function<T, R>` interface and special syntax to build them concisely. TypeScript's syntax for these is quite similar to Java's.

For example, let's turn a (validated) CSV row into an object instead:

```typescript
const studentRowSchema = z.tuple([z.string(), z.number(), z.email()])
                          .transform(arr => ({name: arr[0], credits: arr[1], email: arr[2]}))
```

Now the first row becomes an object: `{name: "Tim Nelson", credits: 10, email: "Tim_Nelson@Brown.edu"}`. 

Passing functions arguments to to other functions is so powerful that it appears in multiple contexts. In Object-Oriented Programming, you see it everywhere under the name of "strategy pattern". For example, [Java's `Collections.sort` method](https://docs.oracle.com/javase/8/docs/api/java/util/Collections.html#sort-java.util.List-java.util.Comparator-) takes an object called a `Comparator`. A `Comparator` implements a method that takes two elements of the collection and says whether one is greater than another. In this way, the `Collections` library allows a single type to be sorted many different ways. 

!!! note "But why not just implement `Comparable`?"
    Many objects implement Java's `Comparable` interface, and `Collections.sort` will indeed use that if no comparator is provided. The advantage of taking arbitrary comparators is in its flexibility: the caller might want to sort in ascending or descending order for example. Records might be sorted by one key or another key, and so on. The strategy pattern is all about flexibility.
-->


<!-- ## Exercise -->

<!-- ### Tools Challenge: `package.json` 

Let's start with the toolchain we're using in the course. You've probably cloned the starter repository by now. Let's look at the `package.json` file together. JSON means "JavaScript Object Notation", and it's a very common text data format. You'll see fields like `dependencies` and `scripts` and so on. *What do you think they mean? How do they interact with the `npm` console command?* 

!!! note "Why won't I just tell you?"
    Research has shown that instruction is more effective if students _commit to a hypothesis_ first, rather than being told the answer immediately. I also want you to finish 0320/1340 with a confidence in making guesses that might be wrong.  -->

## Intermission: A Design Challenge! 

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

??? note "Think, then click!"
    Any time you see something like "Element implicitly has an 'any' type" you should be suspicious. It means that you haven't given TypeScript enough information. This information might need to go in your function headers, in your variable declarations, or the logical flow of your code. Notice what happens when I add an `if` statement:

    ```typescript
    function whatToDo(input: string[] | number): string {
        if(typeof input === "number") return ""
        return input[0]
    }
    ```

    The error goes away! TypeScript looks at your conditionals for hints, and uses those hints to resolve union types and other kinds of uncertainty. This is called _narrowing_, because TypeScript is able to reduce the size of the set of possible values.

TypeScript uses the control flow of your program to infer type information. You can read more about this in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). 

!!! warning "The `typeof` operator"
    The `typeof` operator is technically part of JavaScript, and it isn't very precise at all! JavaScript has only a few "types":

    * `string`;
    * `object`;  
    * `number`; and
    * ...only a few others. 

    JavaScript, on its own, makes no distinction between an array and an object, or between two different kinds of object. This is one thing TypeScript handles a lot better, but it still can use these basic JavaScript checks. 

## TypeScript Narrowing and Zod

<!-- 
Recall: last time we used the `typeof` operator to check whether a value was a `number`. This operator is from JavaScript, and there aren't many "types" in that setting: `string`, `number` and a few others. To really use TypeScript well, we'll need more than `typeof`. -->

We can make the types cleaner by creating a new identifier and using `z.infer`. But we have to use it right, or we get a strange error:

```typescript
// Property 'infer' does not exist on type 
z.infer<typeof studentRowSchema>
```

The error isn't great, but it means we're misusing `infer`: it's not a function in TypeScript; it operates on types. So we can't just call it like it is a normal function; we need to put it into a type context:

```typescript
type StudentRow = z.infer<typeof studentRowSchema>
```

Now let's call `safeParse`:

```typescript
// We don't need the explicit type annotation here. You can mouse over without it and you'll see:
// type ZodSafeParseResult<T> = z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>
// Either way, this is a union type! Zod gave us a nice name for it via `infer`. 
const result: z.ZodSafeParseResult<StudentRow> = studentRowSchema.safeParse(["Tim Nelson", "10", "Tim_Nelson@brown.edu"])
```

The `result` value is either a success or an error. We can try to get the data either way, but it will be `undefined` in the error case. So this won't work as written:

```typescript
// Error: 'result.data' is possibly 'undefined'
result.data[0]
```

A great time to use narrowing!

```typescript 
// This works: we're directly checking that the value is not undefined
if(result.data) {
    result.data[0]
}

// This also works
if(result.success) {
    result.data[0]
}
```

Wait: how is TypeScript able to infer the type of `result.data` based on `result.success`? Let's look at the definition of these types. 

```typescript
// From Zod's library code
export type ZodSafeParseResult<T> = ZodSafeParseSuccess<T> | ZodSafeParseError<T>;
export type ZodSafeParseSuccess<T> = {
    success: true;
    data: T;
    error?: never;
};
export type ZodSafeParseError<T> = {
    success: false;
    data?: never;
    error: ZodError<T>;
};
```

Notice that the _type_ of `success` differs. It can only be `true` in a `ZodSafeParseSuccess`. That's how TypeScript narrows the type in the second case. But if we give an intermediate name to `result.data` _outside the narrowed scope_, that variable will have the union type, and the connection is broken for TypeScript:

```typescript
const student: StudentRow | undefined = result.data
if(result.success) {
  console.log(student[0]) // type error: possibly undefined
}
```

But this works, because the variable is declared *within* the narrowed scope:

```typescript
if(result.success) {
  const student2 = result.data
  console.log(student2[0])
}
```

TypeScript may be smart, but it needs help sometimes.

<!-- ## Escaping the `any` type

There are built-in ways to parse JSON in TypeScript. Let's play:

```typescript
const jsonString = '{"course": "CSCI 0320", "instructor": "Tim Nelson"}';
// cs32 has inferred value *any*. TypeScript sees a string being parsed, it has no way to know the result type.
const cs32 = JSON.parse(jsonString);
```

This seems OK, right? But then:

```typescript
// We can check whether a key exists on an object
if("course" in cs32) {
    // Notice the mouseover type is still: any
    console.log(cs32["course"])    
    // So I can do this with no problem:
    console.log(cs32["DOESNT_EXIST"])
    // The "if" statement is doing nothing! We get no protection!
}
```

TypeScript trusts the `any` type. It always applies, and so narrowing doesn't matter. This is worse than it appears. What happens if we add a new field?

```typescript
const cs32_withLocation = {...cs32, location: "B&H"}
// The inferred type is _still any_. ARGH!
```

We might try to protect ourselves

```typescript
interface ClassWithLocation {
    course: string,
    instructor: string,
    location: string
}
const cs32_withLocation_better: ClassWithLocation = {...cs32, location: "B&H"}
// Whew! Now we're safe, right? Well...

const jsonString2 = '{"course": 17, "teacher": "Tim Nelson"}';
const cs32_bad = JSON.parse(jsonString2)
const cs32_withLocation_bad_better: ClassWithLocation = {...cs32, location: "B&H"}
// Oh. Oh no. TypeScript _trusts the any type_ implicitly. 
// So I can't get where the actual data is:
console.log("Prof. " + cs32_withLocation_bad_better.teacher)
// But I can reference a field that doesn't exist.
console.log("Prof. " + cs32_withLocation_bad_better.instructor)
```

How do we deal with `any`? TypeScript has a feature called [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) that can work. But those can be verbose. We'd like a simpler solution in this situation. Fortunately, Zod is great for exactly this.

```typescript
const classRecordSchema = z.object({course: z.string(), instructor: z.string()})

// What do you think each of these will produce?
const result1 = classRecordSchema.safeParse(cs32_withLocation_better)
const result2 = classRecordSchema.safeParse(cs32)
const result3 = classRecordSchema.safeParse(cs32_withLocation_bad_better)
```

What do you think these produce? Try it. 

??? note "Try it, then click!"
    * `result1`: a success result containing `{"course":"CSCI 0320","instructor":"Tim Nelson"}`
    * `result2`: a success result containing `{"course":"CSCI 0320","instructor":"Tim Nelson"}`
    * `result3`: an error result reporting 2 `invalid_type` errors: one for `course` (`number`) and one for `instructor` (`undefined`). 

Notice that both `result1` and `result2` contain the same values, even though one of them had a `location` field originally. This is because Zod throws away fields it isn't told to keep, at least by default. If we want to avoid this, we use `.passthrough()`:

```typescript
const classRecordSchema = z.object({course: z.string(), instructor: z.string()}).loose()
```

Now the `location` field is kept, if there is one there. (But, of course, now TypeScript will need some convincing before it lets you access that field.)

## Refinements

We saw before that Zod can create schemas that are _richer than what TypeScript types can represent._. TypeScript has no type for "email addresses", but Zod has a schema for them. But a type is just a set. So it's not that these richer schemas can't be thought of as types. Rather, it's that the type checker (which runs at "compile", or "static" time) isn't expressive enough to handle them. 

Whenever we add a further restriction on a base type, we'll call it a _refinement_ of that type. So, "it's a string, but in email-address format" would refine "it's a string". Zod has a lot of these, including a [very expressive method](https://zod.dev/api#refinements): `.refine()`, which takes a refinement function:

```typescript
const evenNumberSchema = z.number().refine( num => num % 2 == 0)

const departments = ['CSCI', 'MATH', 'MCM'] // etc.
const refinedClassRecordSchema = z.object(
    {course: z.string().refine( c => departments.includes(c.split(' ')[0])), 
     instructor: z.string()})
const course1 = refinedClassRecordSchema.safeParse(cs32)
console.log(course1.data)
```

By the way, watch out for "in". You might want it to work like it does in Python, but:

```typescript
> 0 in [0, 1, 2]
true
> "a" in ["a","b","c"]
false
```
Use `lst.includes()` instead.
 -->

