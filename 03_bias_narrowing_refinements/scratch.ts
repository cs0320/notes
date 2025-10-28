import z, { json, refine, ZodSuccess } from 'zod'

/*
  Calling safeParse in Zod will return either a "success" or "failure" type. 
  If we call "parse" we might get an exception. I think safeParse is better, because
  it lets us keep some useful context for the caller.
*/

// z.ZodTuple<[z.ZodString, z.ZodCoercedNumber<unknown>, z.ZodEmail], null>
const studentRowSchema = z.tuple([z.string(), z.coerce.number(), z.email()])

// Property 'infer' does not exist on type 
// z.infer<typeof studentRowSchema>
type StudentRow = z.infer<typeof studentRowSchema>

// type ZodSafeParseResult<T> = z.ZodSafeParseSuccess<T> | z.ZodSafeParseError<T>
const result: z.ZodSafeParseResult<StudentRow> = studentRowSchema.safeParse(["Tim Nelson", 10, "Tim_Nelson@brown.edu"])

// 'result.data' is possibly 'undefined'
// result.data[0]


if(result.data) {
    result.data[0]
}

if(result.success) {
    result.data[0]
}


// There are built-in ways to parse JSON in TypeScript.
const jsonString = '{"course": "CSCI 0320", "instructor": "Tim Nelson"}';
// cs32 has inferred value *any*. TypeScript sees a string being parsed, it has no way to know the result type.
const cs32 = JSON.parse(jsonString);

// We can check whether a key exists on an object
if("course" in cs32) {
    // Notice the mouseover type is still: any
    console.log(cs32["course"])    
    // So I can do this with no problem:
    console.log(cs32["DOESNT_EXIST"])
    // The "if" statement is doing nothing! We get no protection!
}

// This is worse than it appears. What happens if we add a new field?
const cs32_withLocation = {...cs32, location: "B&H"}
// The inferred type is _still any_. ARGH!

// We might try to protect ourselves
interface ClassWithLocation {
    course: string,
    instructor: string,
    location: string
}
const cs32_withLocation_better: ClassWithLocation = {...cs32, location: "B&H"}
// Whew! Now we're safe, right? Well...

const jsonString2 = '{"course": 17, "teacher": "Tim Nelson"}';
const cs32_bad = JSON.parse(jsonString2)
const cs32_withLocation_bad_better: ClassWithLocation = {...cs32_bad, location: "B&H"}
// Oh. Oh no. TypeScript _trusts the any type_ implicitly. 
// So I can't get where the actual data is:
//console.log("Prof. " + cs32_withLocation_bad_better.teacher)
// But I can reference a field that doesn't exist.
console.log("Prof. " + cs32_withLocation_bad_better.instructor)


const classRecordSchema = z.object({course: z.string(), instructor: z.string()})
  .loose()
const result1 = classRecordSchema.safeParse(cs32_withLocation_better)
const result2 = classRecordSchema.safeParse(cs32)
const result3 = classRecordSchema.safeParse(cs32_withLocation_bad_better)

console.log(`${result1.success}: ${JSON.stringify(result1.data)} ${result1.error}`)
console.log(`${result2.success}: ${JSON.stringify(result2.data)} ${result2.error}`)
console.log(`${result3.success}: ${JSON.stringify(result3.data)} ${result3.error}`)


const evenNumberSchema = z.number().refine( num => num % 2 == 0)


const departments = ['CSCI', 'MATH', 'MCM'] // etc.
const refinedClassRecordSchema = z.object(
    {course: z.string().refine( c => departments.includes(c.split(' ')[0])), 
     instructor: z.string()})

console.log('-----------------')
console.log(cs32)
const course1 = refinedClassRecordSchema.safeParse(cs32)
console.log(course1.error)

type RefinedClassRecord = z.infer<typeof refinedClassRecordSchema>
const uhoh1: RefinedClassRecord = {course: "NOT A VALID COURSE ID", instructor: ""}

const brandedRCRSchema = refinedClassRecordSchema.brand("RefinedClassRecord")
type BrandedRCR = z.infer<typeof brandedRCRSchema>
const uhoh2: BrandedRCR = {course: "NOT A VALID COURSE ID", instructor: ""}