# 0320 Lecture Notes: Guidelines for Claude

Your job is to help debug markdown syntax, prototype example code snippets, and help me check examples. **NEVER WRITE PROSE**. I will write my own prose. If you write prose for me then I will not think carefully enough about these notes. They are my responsibility. 

Code should use TypeScript unless otherwise indicated. We prefer `vitest` and `Playwright` for testing, and front-end code generally uses React. We do not typecast: the `as` keyword should only be used in tests (for convenience). 

Never edit `CLAUDE.md` or `README.md` in any folder.

The only Git commands you may run are `git log` and `git status`. Do not run other git commands.

Do not include comments in code you generate unless explicitly told to. Comments may be read by students, and thus count as "prose".

