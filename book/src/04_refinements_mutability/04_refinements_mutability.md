# Narrowing and Refinements

## Logistics 

Good job on sprint 1.

My "note of encouragement" post has only been read by 107 unique users. The week 2 summary has done better (128 unique users), but very few have responded with an emoji. (These counts also include any staff members who have clicked the threads.)

We will pause for a couple of minutes so _everyone can read my post_.

## Exercise: Disappointing Types 

We'll start with today's in-class exercise. I'd like you all to look at [this Java project](https://github.com/cs0320/class-livecode/tree/main/F25/sep16_refinements/exercise) in the livecode repository.  There are some questions for you in [this web form](https://docs.google.com/forms/d/e/1FAIpQLSf_PGN5rsDbH3soKd1v2huSpjIV5IK4kc0thwqB65-BuN7uSg/viewform?usp=dialog).

Now would be a great time to [clone the repository](https://github.com/cs0320/class-livecode). We won't be using Java much this semester, so we don't provide a formal setup process. I wanted to make this exercise more accessible, so used Java. When we do use Java, the projects use Maven for dependencies: open the `pom.xml` file as a project in IntelliJ, not the folder. But you don't need to run the code (right now) to do the exercise. 

## Types of Type System

Let's continue on from last time.

### Type Assertions / Typecasting 

In Java, you've likely seen typecasting, or "downcasting", that looks like this:

```java
Object anObject = new ArrayList<Integer>();
// I can't refer to anObject.size() because the variable has type Object. 
// So I can tell Java "I know better than you; it's an ArrayList". Something like this:
System.out.println(((ArrayList<Integer>)anObject).size());
```

This is called a _typecast_, or more precisely a _downcast_ (because it asserts that an object has a more specific type&mdash;further down the type hierarchy&mdash;than what Java inferred). These are sometimes necessary, but in general they are dangerous: what happens if I'm wrong? What happens if that object is actually something different? I get an exception at runtime. Ouch!

TypeScript has a form of downcasting, too: the `as` keyword. We can always disable TypeScript on anything by asserting it has the expected type (or, even more dangerously, `any`). As a general rule, _you won't want to use this operator_. When in doubt, ask. 

(Funnily enough, when I was experimenting with Copilot over the summer it kept trying to add `(as any)` to a bunch of stuff, even when it wasn't necessary.)

### Structural, not Nominal

TypeScript types corresponding to Zod schemas will only be as specific as TypeScript itself can support.

```typescript
type ClassRecord = z.infer<typeof refinedClassRecordSchema>
```

If you mouse over this type, you'll see:

```typescript
type RefinedClassRecord = {
    course: string;
    instructor: string;
}
```

That's missing our refinement, which makes sense because TypeScript's types can't express our schema refinement.

TypeScript is _structurally_ typed, not _nominally_ typed (meaning that it looks at the structure of objects, not the actual name of their types). This is in contrast to languages like Java, where it's the name that matters. 

Because it only cares about _structure_, TypeScript won't stop me from claiming that an object with these fields (of the less specific types) is a `ClassRecord`:

```typescript
// No type error
const uhoh: ClassRecord = {course: "NOT A VALID COURSE ID", instructor: ""}
```

This is a threat to success: I might accidentally manufacture a value that, to TypeScript, _looks_ like something Zod has validated. 

### Type Branding

Let's make it impossible to create a `ClassRecord` without going through Zod first. We'll use something called "type branding": add a special flag (which won't exist at runtime) to the type that only Zod can add. At a basic level, this is easy: we'll just `.brand()` the schema. 

```typescript
const brandedCRSchema = refinedClassRecordSchema.brand("ClassRecord")
type BrandedCR = z.infer<typeof brandedCRSchema>
const uhoh2: BrandedRCR = {course: "NOT A VALID COURSE ID", instructor: ""}
```

If you mouse over `BrandedRCR` you'll see something strange:

```typescript
type BrandedRCR = {
    course: string;
    instructor: string;
} & z.core.$brand<"RefinedClassRecord">
```

That `&` means _intersection_ (the same as we use `|` to build unions). If a value doesn't carry that brand, it can't be used as an instance of this type. Hence, `uhoh2` now gives an error. This is a longhanded way to say that the brand is missing:

```
Type '{ course: string; instructor: string; }' is not assignable to type '{ course: string; instructor: string; } & $brand<"RefinedClassRecord">'.
  Property '[$brand]' is missing in type '{ course: string; instructor: string; }' but required in type '$brand<"RefinedClassRecord">
```

### A Danger of Mutable State

Type branding isn't perfect. One major threat is that _if these objects are mutable_, then the guarantees might hold immediately but then stop holding (without TypeScript protection!) after some code changes the object.

```typescript
const brandedCRSchema = refinedClassRecordSchema.brand("ClassRecord")
type BrandedCR = z.infer<typeof brandedCRSchema>
const uhoh2: BrandedCR = {course: "NOT A VALID COURSE ID", instructor: ""}
const cs32 = brandedCRSchema.safeParse({course: "CSCI 0320", instructor: "Tim Nelson"}).data

if(cs32 !== undefined)
  cs32["course"] = "FAKE 1234"

```

TypeScript objects are mutable, similar to fields in Java objects. In Java, we can prevent a field from being modified with the `final` keyword. In TypeScript, we use `readonly` when declaring a field. Zod will even help us if we call the `.readonly()` method on a schema:

```typescript
/** Schema for valid class records. */
const refinedClassRecordSchema = z.object(
    {course: z.string().refine( c => departments.includes(c.split(' ')[0])), 
     instructor: z.string()}).readonly()
```

Now, when we mouse over the inferred type:

```typescript
type ClassRecord = {
    readonly course: string;
    readonly instructor: string;
}
```

**Beware**: again, just like with `final` in Java, declaring a _field_ immutable doesn't mean that an object stored in that field is itself immutable. If we were storing something more complicated than strings in those fields, we'd want to mark the inner schemas as `.readonly()` as well.

Branding and mutability are sometimes subtle, especially when trying to create cyclic data. See the separate [types document](https://docs.google.com/document/d/115A3utnCRM71jOGlXV6hqGzvHgA7psPo218JpXtnSPI/edit?usp=sharing) we wrote for more on this.


