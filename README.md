# Drinking board game

This project is not ready yet.

----
## what is this?
This is a generalized engine for playing drinking board games online. 

----
## usage
* Git pull
* `npm i`
* `npm start`

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

### M1 (✅ 9/16/2019)
* Stencil! Refactor all the modal crap ...or LitElement since Stencil won't integrate as easily
* expand indicator in top left
  * queue of who rolled what in the corner
  * indication of who is in what zone
  * status effects, extra/missed turns, etc.
* players move along the board (animation should not cut corners)
* proper positioning when two or more players are at the same space
* can consider removing the display text from the JSON in lieu of a blown up version of the tile itself. since we have the coordinates, can probably create a new Image and use background position on it to target the current tile
* trainer battles/custom events
* zones

### M1.5 (refactor time)
* Refactor modal into a WCs or multiple child WCs
* Clean up other todos
* Consider better organization of events
* Clean up typescript in the custom game code
* Enable or disable dice roll resetting based on a prop

### M2
* track game state, store in localstorage in case someone closes the screen
  * state holds events and then instead of listening to the events we listen to when the "current event" in the state changes
* can load a previous game from localstorage
* add a new game (johto?)

### M3
* game is playable via websockets OR offline
* for websockets, keep game state in memory on host as it will only be played
* asset minification and polyfills

### M4
* keep track of the drink counts throughout the game
* alert players when they are supposed to drink
* can designate drinks on screen
* unit tests

### M5
* can add/remove players mid game. when adding can put them somewhere custom?
* mobile friendly
