#lang forge/temporal

/*
  Version for demo in 0320, 0112, etc. 
    - WHERE DO I START?
    - HOW DO I ADVANCE?
    - WHAT IS MY "GOAL" TO REACH?
*/

------------------------
-- Puzzle type declarations
------------------------
abstract sig Light {
  left: one Light,  -- neighbor to left
  right: one Light  -- neighbor to right
}
-- Whether a light is lit or unlit is VARiable over time.
var sig Lit, Unlit extends Light {}

------------------------
-- What might be true about a puzzle?
------------------------

-- We'd like to enforce that the puzzle is laid out in a _ring_ of lights
pred ring {
  -- The lights are connected 
  all x1, x2: Light | reachable[x1, x2, left] and 
                      reachable[x1, x2, right] 
  -- The left and right neighbors are opposites 
  all x: Light | x = x.right.left
}

-- We'll search for a _solved_ puzzle...
pred solved {
  Lit = Light
}

-- ...starting from an _init_ial puzzle state.
pred init {
    no Lit -- all lights are unlit
    Unlit = Light
}

pred flip[switch: Light] {
  -- Flip the switch for <switch>, which also flips the neighbors
  Lit' = Lit - {x: switch+switch.left+switch.right | x in Lit}
             + {x: switch+switch.left+switch.right | x not in Lit}
}

// Look for a solution to the puzzle that involves at *least* 5 states (4 transitions)
option min_tracelength 5
// We need more than 5 states to find a solution
option max_tracelength 10

one sig Observer {
  var toFlip: lone Light
}

run {
    ring -- ring-shaped puzzle
    init -- start in an all-unlit state

    -- transition predicate: either flip a single light, or we're done
    always {        
        {            
            solved -- once the puzzle is solved
            Lit = Lit' -- STOP!
            -- Added in class: the observer observes the light being flipped 
            no Observer.toFlip
        } or {
            not solved -- if the puzzle isn't solved
            one l: Light | {
              -- FLIP A SWITCH!
              flip[l] 
              -- Added in class: the observer observes the light being flipped 
              Observer.toFlip = l
            }
        }        
    }

    -- BTW, find a trace that leads to a solved state
    eventually solved    
} 
for exactly 5 Light
