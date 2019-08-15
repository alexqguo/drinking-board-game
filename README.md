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

### MVP (✅ 8/15/2019)
* game is playable offline with multiple people at the same computer
* no image scaling
  * image will be displayed via the background css property at full size
  * window will scroll automatically turn to turn
* skip button (required for Gary as you don't move on until you're done with your drink)
* change links to fake buttons
* DiceRollRule with prompts for rules that require you to roll a die, though not necessarily take actions from it
* enforce name uniqueness

### M1
* Stencil! Refactor all the modal crap
* expand indicator in top left
  * queue of who rolled what in the corner
  * indication of who is in what zone
* players move along the board (animation should not cut corners)
* proper positioning when two or more players are at the same space
* can consider removing the display text from the JSON in lieu of a blown up version of the tile itself. since we have the coordinates, can probably create a new Image and use background position on it to target the current tile
* better organization of status effects, and visual indicator on the screen
* zones

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
* trainer battles/custom events
* unit tests

### M5
* can add/remove players mid game. when adding can put them somewhere custom?
* mobile friendly
