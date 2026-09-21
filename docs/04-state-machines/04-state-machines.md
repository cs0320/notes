# State Machines

!!! warning "Important Context"
    These notes accompany a new example in 0320's state machine visualizer, and we had only 20 minutes of lecture time. Thus, they are somewhat sparse. 

## Example: Schoolbook Arithmetic 

How do you add two numbers by hand? There's an algorithm you follow: passing from least-significant to most-significant digit, adding numbers in that digit's column (potentially with a carry input or output).

```
  5678
+ 1234
 -----
     2  // 8+4 is 12, carry the 1
    1   // 7+3+1 is 11, carry the 1
   9    // 6+2+1 is 9
  6     // 5+1 is 6
  6912
```

This is a string-processing algorithm! It takes two strings (base-10 encoded integers) and produces one string (same encoding). It's not even that hard to write: loop backward through the string, converting to numbers, adding, converting back to strings, and remembering to carry. We might write it like this:

```typescript
    let result = '';
    let carry = 0;

    for (let i = maxLength - 1; i >= 0; i--) {
        const sum = parseInt(num1[i]) + parseInt(num2[i]) + carry;
        carry = Math.floor(sum / 10);
        result = (sum % 10) + result;
    }

    return carry > 0 ? carry + result : result;
```

The program maps pairs of strings to strings by walking along the input and producing new outputs for every character read. We sometimes call this sort of machine a _transducer_. We can draw it without code: its behavior is extremely simple and local to a single pair of digits&mdash;except for one factor: the carry. Carrying requires the machine to remember the past. 

The distinction between a transducer and a machine with no output can be important, but it is _not_ important for today.

## State Machines, Generally

A state machine is a particular kind of directed graph. It has:
    - a finite set of states 
        - one of which is the _starting_ state; and
    - a set of edges from state to state, each of which has
        - a class of input characters that enable that edge to be taken; and
        - (optionally) an _output_ character to be produced when the edge is taken.
    
This turns out to be a useful way of talking about parsing strings, just like in your CSV assignment. State machines are used everywhere in computing, so we'll spend time working with them. We've even made a [visualizer](https://cs0320.github.io/State-Machine-Visualizer/) to help you learn. 

### Our State Machine Syntax

Our visualizer needs you to write state machines in a very specific way. (See the documentation for more information.) The syntax is TypeScript because we wanted you to be able to freely copy-paste between the visualizer and your code. But the syntax is _very restricted_ both for security reasons and because we wanted to help you avoid an unproductive line of thinking.

Here's an example of how you might write the add-9 state machine in our visualizer syntax:

```typescript
// This machine has 5 states.
type State = "initial" | "carry_0" | "carry_1" | "error" | "done";

// We start in "initial"
const startState: State = "initial";

// This machine's output will add characters to vars.sum.
const vars: { sum: string } = {
  sum: ""
};

// This function is called when the machine receives a character <char>
function step(state: State, char: string | null): State {
  // What's the current state?
  switch (state) {
    // Nothing to do in these cases.
    case "error": return "error"
    case "done" : return "done"

    // Just started. We need to add 9.
    case "initial":
      if(char === null) return "error";
      if(isNaN(parseInt(char))) return "error";
      if(parseInt(char) + 9 >= 10) {
        vars.sum = vars.sum + (parseInt(char) + 9 - 10)
        return "carry_1"
      } 
      vars.sum = vars.sum + (parseInt(char) + 9)
      return "carry_0"

    // No more carrying; just add.
    case "carry_0":
      if(char === null) {
        return "done";
      }
      if(isNaN(parseInt(char))) return "error";
      vars.sum = vars.sum + char
      return "carry_0"

    // There is a carry to take into account.
    case "carry_1":
      if(char === null) {
        vars.sum = vars.sum + "1";
        return "done";
      }
      if(isNaN(parseInt(char))) return "error";
      if(parseInt(char) + 1 >= 10) {
        vars.sum = vars.sum + (parseInt(char) + 1 - 10)
        return "carry_1"
      } 
      // Note: beware, make sure to put the parens or 1 is treated as "1".
      vars.sum = vars.sum + (parseInt(char) + 1)
      return "carry_0"
  }
}
```

See the documentation for better coverage of our syntax.

## Why else would we want to use a state machine?

State machines are a restricted way to program. They aren't as powerful as we're used to: there's no recursion, etc. But one of the advantages of using _limited-power_ languages is that you can do more to check them than you can with ordinary code. Here's an example. 

A state machine always stops as soon as its input stops.

But it is known to be impossible to write a program that:
    - accepts an _arbitrary_ other program
    - and says, in finite time, 
    - without making any mistakes,
    - whether that input program ever terminates.
    
!!! note "Halting Problem"
    This is a slight modification of the classical statement of the Halting Problem, which implies many other disappointing things: almost everything we want to know about our problems can't always be computed. 

It is also known to be impossible to say whether two _arbitrary_ programs always behave the same way. Yet, deciding whether two state machines are equivalent is [a well-known technique](https://en.wikipedia.org/wiki/DFA_minimization). 

**Don't let our (very verbose) syntax distract you from this powerful idea.**
