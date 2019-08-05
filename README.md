# Drinking board game

This project is not ready yet.

----
## what is this?
(todo)

----
## usage
(todo)

----
## milestones

### MVP (in progress)
- game is playable offline with multiple people at the same computer
- zones
- no image scaling
  - image will be displayed via the background css property at full size
  - window will scroll automatically turn to turn
- skip button (required for Gary as you don't move on until you're done with your drink)
- asset minification

### M1
- track game state, store in localstorage in case someone closes the screen
- queue of who rolled what in the corner
- DiceRollRule with prompts for rules that require you to roll a die, though not necessarily take actions from it
- players move along the board (animation should not cut corners)

### M2
- game is playable via websockets OR offline
- for websockets, keep game state in memory on host as it will only be played

### M3
- keep track of the drink counts throughout the game
- alert players when they are supposed to drink
- can designate drinks on screen
- trainer battles
- unit tests

### M4
- can add/remove players mid game
- mobile friendly
