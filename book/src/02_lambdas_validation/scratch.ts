import z from 'zod'

/**
 * Compute the average of the given list of numbers. 
 * @param items 
 * @returns 
 */
function average(items: number[]): number | undefined {
    // Start with 0, and fold over the list adding each element to the total so far
    const sum = items.reduce( (previousValue, currentValue) => previousValue+currentValue,
                              0)
    return sum / items.length
}

/** 
 * Take in two numbers in string form (perhaps input from a user). Convert them to numbers,
 * and return whether or not the first number is greater than the second number
 */
function rawGreaterThan(arg1: string, arg2: string): boolean {
    return parseInt(arg1) > parseInt(arg2)
}

interface ConversionError {
    error: "parseInt" | "parseFloat"  // | ... | ... | etc.
    arg1: string 
    arg2: string
}


function rawGreaterThan2(arg1: string, arg2: string): boolean | ConversionError {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    if(Number.isNaN(num1) || Number.isNaN(num2)) return {error: "parseInt", arg1: arg1, arg2: arg2}
    return parseInt(arg1) > parseInt(arg2)
}

////////////////////

const studentRowSchema = z.tuple([z.string(), z.number(), z.email()])
                          .transform(arr => ({name: arr[0], credits: arr[1], email: arr[2]}))


function whatToDo(input: string[] | number): string {
    return input[0]
}

function whatToDo2(input: string[] | number): string {
    if(typeof input === "number") return ""
    return input[0]
}

