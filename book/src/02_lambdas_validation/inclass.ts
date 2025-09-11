interface ConversionError {
    // Note: you don't NEED to do this. 
    error: 'parseInt' | 'parseFloat'
    arg1: string
    arg2: string
}


function rawGreaterThan(arg1: string, arg2: string): 
  boolean | ConversionError {
    const num1 = parseInt(arg1)
    const num2 = parseInt(arg2)
    if(Number.isNaN(num1) || Number.isNaN(num2)) {
        // HOMEWORK: how to narrow this string value 
        const result = {error: 'parseInt', arg1: arg1, arg2: arg2}
        return result
        //return {error: 'parseInt', arg1: arg1, arg2: arg2}
    }
    return num1 > num2
  }

