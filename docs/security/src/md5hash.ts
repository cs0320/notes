import * as crypto from 'crypto';
import LargeMap from 'large-map';

/* This was something Copilot was great at. I don't remember how to
   convert a string to its md5 hash by myself, but Copilot does. */

function getMd5Hash(input: string): string {
    const hash = crypto.createHash('md5');
    hash.update(input);
    return hash.digest('hex');
}

function generateRandomString(length: number): string {
    const charset = '0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        // Use modulo to map the random byte to our charset
        const randomIndex = randomBytes[i] % charset.length;
        result += charset[randomIndex];
    }
    return result;
}

/** We pay the cost of building this table only once. 
 *  Even for larger key spaces, this is often possible to do.
 *  (In practice, for large key spaces we'd likely serialize this 
 *   map to a file, sorted by key, and use DB indexing techniques
 *   to search efficiently. 
*/
const lookup: LargeMap<string, string> = new LargeMap()
const digits = 7 // 0,000,000 -- 9,999,999

console.log(`Starting to build table...`)
for(let i = 0; i<Math.pow(10, digits);i++) {
    const padded = i.toString().padStart(digits, '0')
    lookup.set(getMd5Hash(padded), padded)
}

const target = generateRandomString(digits)
const hashed = getMd5Hash(target)
console.log(`Generated (private): ${target}`)
console.log(`Hash (public): ${hashed}`)
console.log(`Looking up in table. Found: ${lookup.get(hashed)}`)