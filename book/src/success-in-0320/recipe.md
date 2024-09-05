# The Debugging Recipe

## Rule One

Never debug when tired or angry. If you must debug when tired, commit to a stopping time. Set a timer or ask a friend to help you keep that commitment.

## Identify What's Wrong

Assemble your knowledge. Write no more than two sentences for each question:
* What is the purpose of the code you're working on?
* What steps can you perform to reproduce the bug?
* What is the expected behavior/result, and what is the unexpected actual behavior/result?
* Why do you expect the result that you expect?

## Tell the Story

Now describe how you think the system operates as it approaches the unexpected actual result. Write your description as a series of steps. Use no more than one or two sentences for each step, but each step should be testable as a hypothesis about how the system works.

## Localization

Confirm each step in your description is accurate. Use any reasonable means (e.g., print statements or a debugger). The **first step** where the program behaves unexpectedly is a *possible* location for the original bug. More commonly, it contains the call site for the actual buggy code.

Record this location, along with the expected and actual behavior.

## Explanation

If you have a hypothesis about the cause of the bug, make an experiment to see if you are correct.
* If yes, proceed to fix the problem. Whenever possible, add a regression test so that this bug will be quickly identified if it happens again. Re-run all tests to confirm that your "fix" hasn't broken something else. 
* If you have no hypothesis, or your hypothesis was incorrect, increase your level of detail about **that single step**. Look for unstated assumptions and dependencies; often, you'll find you left something important out of the original story. Then repeat the localization step.