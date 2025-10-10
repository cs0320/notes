# Narrowing and Refinements

## My Homework

Last time, a student asked what would happen if we didn't return an object directly, and instead worked with it before returning it.

```typescript
function rawGreaterThan(arg1: string, arg2: string): 
  boolean | ConversionError {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    if(Number.isNaN(num1) || Number.isNaN(num2)) {
        // This produces an error
        const result = {error: 'parseInt', arg1: arg1, arg2: arg2}
        return result
        // Before, it was:
        //return {error: 'parseInt', arg1: arg1, arg2: arg2}
    }
    return num1 > num2
  }
```

The error isn't super helpful:

```
Type '{ error: string; arg1: string; arg2: string; }' is not assignable to type 'boolean | ConversionError'.
  Type '{ error: string; arg1: string; arg2: string; }' is not assignable to type 'ConversionError'.
    Types of property 'error' are incompatible.
      Type 'string' is not assignable to type '"parseInt" | "parseFloat"'
```

But it's surprising, right? Look at that first type. TypeScript isn't using the literal string: it's inferring `string` for the `error` field. Initially, TypeScript can directly infer the return type and then check for consistency. TypeScript isn't smart enough to carry that inference over to the value of `result` without help. So we'll provide it:

```typescript
const result: ConversionError = {error: 'parseInt', arg1: arg1, arg2: arg2}
```

Now the error goes away. Sometimes we do need to give TypeScript a little help.

## Testing as a Human

Suppose your job is to build a statistical app that summarizes United Nations data on population, GDP, and so on. You need to test your app, so think of a country. What country are you thinking of?

<details>
<summary><B>Think, then click!</B></summary>

Chances are, the country you thought of was:
- close to home; 
- large; or
- in the news often.

And it's even more likely that the country you thought of was **currently in existence**. You probably didn't say "the USSR" or "Austria-Hungary". And note that my choices there were all limited by my own historical knowledge. I went and [looked up more](https://en.wikipedia.org/wiki/List_of_former_sovereign_states) after writing that sentence. Even if we only count nations that existed after the U.N. was created, there are many: the Republic of Egypt (1953-1958), the Fourth Brazilian Republic (1946-1964), etc.

This is an example of something called _availability bias_ (or the _availability heuristic_). All humans exhibit it, and *usually* it's an advantage: just like caching in a program, our brains tend to recall information in cache. For us, it's an energy-saving measure.

</details>


I'm not a cognitive scientist! If you want to learn more about this in depth, take a CLPS class. But even so, let's ask: **How does this cognitive phenomenon impact software testing?**

<details>
<summary><B>Think, then click!</B></summary>

You probably test what you have loaded into your mental cache. If you aren't thinking of it at the moment, or haven't been thinking of it recently, you likely won't test it unless you work to find examples outside your current context.
    
Even worse, if you aren't aware of the thing to begin with, you won't think to test it. Beware of the kind of thing that Iain Banks called an "outside context problem", translated from fiction into the real world of testing. This is why getting outside feedback from others can be so valuable for testing.

</details>

## TypeScript: Narrowing

We saw last time that TypeScript uses the control flow of your program to infer type information. You can read more about this in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). For now, let's do a few narrowing exercises. 

Recall: last time we used the `typeof` operator to check whether a value was a `number`. This operator is from JavaScript, and there aren't many "types" in that setting: `string`, `number` and a few others. To really use TypeScript well, we'll need more than `typeof`.

Calling a schema's `safeParse` method in Zod will return either a "success" or "failure" type. If we call `parse` instead then we might get an exception. I think `safeParse` is better, because it lets us keep some useful context for the caller in a normal value. Here's an example. First, we'll define the (more simple) schema from last time:

```typescript
// Mouse over type: z.ZodTuple<[z.ZodString, z.ZodCoercedNumber<unknown>, z.ZodEmail], null>
const studentRowSchema = z.tuple([z.string(), z.coerce.number(), z.email()])
```

We can make the types cleaner by creating a new identifier and using `z.infer`. But we have to use it right, or we get a strange error:

```typescript
// Property 'infer' does not exist on type 
z.infer<typeof studentRowSchema>
```

The error isn't great, but it means we're misusing `infer`. It's not a function in TypeScript; it operates on types. So we can't just call it like it is a normal function; we need to put it into a type context:

```typescript
type StudentRow = z.infer<typeof studentRowSchema>
```

Now let's call `safeParse`:

```typescript
// We don't need the explicit type annotation here. You can mouse over without it and you'll see:
// type ZodSafeParseResult<T> = z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>
// Either way, this is a union type!
const result: z.ZodSafeParseResult<StudentRow> = studentRowSchema.safeParse(["Tim Nelson", 10, "Tim_Nelson@brown.edu"])
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

Notice that the _type_ of `success` differs. It can only be `true` in a `ZodSafeParseSuccess`. That's how TypeScript narrows the type in the second case. 

**Added after class:** Using `result.success` to narrow the type of `result.data` worked above. But if we give an intermediate name to `result.data` _outside the narrowed scope_, that variable will have the union type, and the link is broken for TypeScript:

```typescript
const student: StudentRow | undefined = result.data
if(result.success) {
  console.log(student[0]) // type error: possibly undefined
}
```

But this works, because the variable is declared within the narrowed scope:

```typescript
if(result.success) {
  const student2 = result.data
  console.log(student2[0])
}
```

## Escaping the `any` type

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

<details>
<summary>Try it, then click!</summary>

* `result1`: a success result containing `{"course":"CSCI 0320","instructor":"Tim Nelson"}`
* `result2`: a success result containing `{"course":"CSCI 0320","instructor":"Tim Nelson"}`
* `result3`: an error result reporting 2 `invalid_type` errors: one for `course` (`number`) and one for `instructor` (`undefined`). 

</details>

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


## Exercise: Building a suite for CSV

Your first sprint asks you to build tests that probe how the parser we gave you might not be handling CSVs very well. We want you to think carefully about what's missing, but it's also a useful place to take time in class and talk about using Copilot to synthesize tests. 

I've used Copilot a good amount now, and sometimes it's _great_ at building test suites, and other times not so much: I've often needed to prompt it to change something, or to realize there's an issue with a test it wrote. So let's get some practice critiquing. We'll do this over multiple classes. 

How do you want to start?