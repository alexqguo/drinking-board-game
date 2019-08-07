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
* game is playable offline with multiple people at the same computer
* zones
* no image scaling
  * image will be displayed via the background css property at full size
  * window will scroll automatically turn to turn
* skip button (required for Gary as you don't move on until you're done with your drink)

### M1
* expand indicator in top left
  * queue of who rolled what in the corner
  * indication of who is in what zone
  * improve dice UI
* DiceRollRule with prompts for rules that require you to roll a die, though not necessarily take actions from it
* players move along the board (animation should not cut corners)
* proper positioning when two or more players are at the same space

### M2
* track game state, store in localstorage in case someone closes the screen
* can load a previous game from localstorage

### M3
* game is playable via websockets OR offline
* for websockets, keep game state in memory on host as it will only be played
* asset minification and polyfills

### M4
* keep track of the drink counts throughout the game
* alert players when they are supposed to drink
* can designate drinks on screen
* trainer battles
* unit tests

### M5
* can add/remove players mid game
* mobile friendly