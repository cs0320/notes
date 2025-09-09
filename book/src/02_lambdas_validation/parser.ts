import * as fs from "fs";
import * as readline from "readline";

async function parseCSV(path: string): Promise<string[][] | undefined>{
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop.
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  // Create an empty array to hold the results
  let result = []
  
  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    result.push(values)
  }
  return result
}

async function example() {
  const result = await parseCSV("something")

}