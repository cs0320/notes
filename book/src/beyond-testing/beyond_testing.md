# sp23: Beyond Testing 

Today's class will introduce a useful idea that's meant to prompt thought and discussion about what methods exist _beyond_ testing. Some of the material is on the [slides](https://docs.google.com/presentation/d/1t0vAy0TLxSewg0SQM9aQGD9sZVAkSf1MJ99IuhZFIjU/edit?usp=sharing), although I recommend the notes.

Computers are powerful assistive devices. Earlier in the semester, we talked about how computers can help us write tests---ideas like fuzz testing, model-based testing, and property-based testing. Today we'll go even further in that direction. But first, a story.

## Intel and The Bug

It's 1994. Intel is releasing their best processor yet---the [Pentium](https://en.wikipedia.org/wiki/List_of_Intel_Pentium_processors#P5_based_Pentiums), which sports clock speeds of 66, 75, or even 100 MHz. It's a great time to be Intel. 

Then an [academic researching prime numbers](https://faculty.lynchburg.edu/~nicely/pentbug/pentbug.html) found a [bug](https://en.wikipedia.org/wiki/Pentium_FDIV_bug): sometimes floating-point division was inaccurate. For instance, $1/824633702441$ was calculated in error. $(824633702441.0) \times (1/824633702441.0)$ should have been equal to $1$ within 19 significant digits. The Pentium returned $0.999999996274709702$ instead.

This may seem minor. Intel certainly thought so. It did result in some unfortunate humor at their expense. My favorite joke was:

> Q: How many Intel executives does it take to screw in a light bulb?
> A: 1, but 0.999999996274709702, is close enough unless you can convince us it matters to you.

You see, [Intel initially said](https://www.nytimes.com/1994/12/21/us/business-technology-in-about-face-intel-will-swap-its-flawed-chip.html) that you needed to _prove_ that you were impacted to get a replacement. They even released a paper analyzing the bug ([link here](https://users.fmi.uni-jena.de/~nez/rechnerarithmetik_5/fdiv_bug/intel_white11.pdf), although it's not the original; I need to do some searching to find a more reliable source). The paper's abstract said that its analyses:

> lead us to the overall conclusion that the flaw is of no concern to the vast majority of users of Pentium processor based systems

and that

> A few users of applications in the scientific/engineering and financial engineering fields who require unusual precision and invoke millions of divides per day may need to employ either an updated Pentium processor without the flaw or a software workaround.

This didn't go well. Intel lost the PR battle, and ended up recalling a significant number of processors. Still, their recall was crafted to minimize costs, e.g., requiring that the **user** be the one to decide to replace their processor:

> "It is the individual decision of the end user to determine if the flaw is affecting their application accuracy."

and exhausting the original lifetime warranty:

> The lifetime replacement is 'exhausted' once the replacement is made. Your replacement processor is then covered under a one-year warranty.

Even with these blocks in place, according to [Intel's 1994 annual report](https://www.intel.com/content/www/us/en/history/history-1994-annual-report.html), the bug cost around 475 million 1995 dollars (that's around 750 million today).

**Public-relations issues aside, why do you think this specific bug was so damaging to Intel?**

<details>
<summary>Think, then click!</summary>
Hardware isn't easy to patch! In fact, even some software bugs can be tough to patch. (Consider all those security vulnerabilities in early versions of Internet Explorer.)
    
So the impact of a bug isn't just about how much harm it does, or how many people are affected, or even how tough the bug itself is to fix, but also _how difficult it is to deploy a fix_.
</details>
<br/>

## Things Work (Somehow)

It's sort of amazing that our computers even work today. Here's some perspective:
* The Pentium (1993) had 3.1 million transistors.
* A Core i7 (quad) (2008) has 731m transistors.
* An iPhone 6: 2 billion.
* An iPhone 13 (A15 SoC): 15 billion.

It's not perfect to use the number of transistors as proxy for complexity---there's a lot of duplication in there---but still. Our hardware and software have become more complex since 1994. And given that cars, planes, etc. now use software and commodity hardware far more in the 21st century, it's amazing that our systems haven't killed _far more_ people than they have.

(I'm not joking.)


## Symbolic/Concolic Execution (Demo, Outline)

Consider this C function:

```
int get_sign(int x) {
  if (x == 0)
    return 0;
  if(x == 17) 
    return 17;
  if(x % 17 == 3) 
    return -4;
  if (x < 0)
    return -1;
  else
    return 1;
}
```

How would you go about producing a high-coverage test suite for it?

There exist tools that, for small but possibly intricate programs, can produce very high (or possibly total) coverage test suites. I really like one called [KLEE](http://klee.github.io). 


### What if we asked GPT-3 or ChatGPT for the same thing?

I asked ChatGPT for a high-coverage test suite for the above program. Here's the response:

> Here's a high-coverage test suite for the updated C program:
> 
> 1. Test case where x is 0:
>    - Input: x = 0
>    - Expected output: 0
> 
> 2. Test case where x is positive:
>    - Input: x = 100
>    - Expected output: 1
> 
> 3. Test case where x is negative:
>    - Input: x = -50
>    - Expected output: -1
> 
> 4. Test case where x is a multiple of 17 with remainder 3:
>    - Input: x = 20
>    - Expected output: -4
> 
> 5. Test case where x is a multiple of 17 without remainder:
>    - Input: x = 34
>    - Expected output: 17
> 
> 6. Test case where x is one more than a multiple of 17:
>    - Input: x = 22
>    - Expected output: 1
> 
> 7. Test case where x is one less than a multiple of 17:
>    - Input: x = -6
>    - Expected output: -1
> 
> 8. Test case where x is the smallest possible negative number:
>    - Input: x = -2147483648 (INT_MIN)
>    - Expected output: -1
> 
> 9. Test case where x is the largest possible positive number:
>    - Input: x = 2147483647 (INT_MAX)
>    - Expected output: 1
> 
> By running the above test cases, we can ensure that the `get_sign()` function works correctly for all possible values of `x`. Note that test cases 4 and 5 are added to cover the new condition in the updated function.

What do you notice?

How might tools like this and tools like KLEE interoperate in the future?

## Takeaways

There are many, many techniques to use if you want to go beyond testing. We can't do justice to the idea in a half class meeting, but if you're interested in tools and algorithms for _modeling_ systems and _reasoning_ about them together, you might be interested in taking CSCI 1710---which I'm offering in the Spring!



