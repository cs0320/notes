# Bias in Testing, More Narrowing, Refinements

## A Word on "Talent"

I'd caution against viewing success in either 0320 or CSCI generally as related to _talent_, for a couple reasons.  We don't talk enough about how talent depends on external factors and experience. Stephen Sondheim (who I imagine knew more about talent than most) said that "everybody is talented, it's just that some people get it developed and some don't." We can often (wrongly) think of "talent" in CSCI as when some skill or concept comes easily. But the development of talent requires time, support, work, etc. And even prodigies need that&mdash;e.g., Terrence Tao (who aced the math SATs when he was 8 years old) got a lot of tutoring support growing up, and (crucially) his family was able to provide it.

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

## Escaping the `any` type

There are built-in ways to parse JSON in TypeScript. Let's play:

```typescript
const jsonString = '{"Course", "CSCI 0320": "instructor": "Tim Nelson"}';
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

const jsonString2 = '{"Course", 17: "teacher": "Tim Nelson"}';
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

* `result1`: a success result
* `result2`: a success result
* `result3`: an error result

</details>

**TODO: what types**

## Refinements

We saw before that Zod can create schemas that are _richer than what TypeScript types can represent._. TypeScript has no type for "email addresses", but Zod has a schema for them. 

**TODO: fill**






