# Drinking board game

This is a generalized engine for playing drinking board games online. It is accessible for the time being at https://drink.alexguo.co.

There are two main components to this project, the *engine* and the *game*. The engine (basically everything in the `src` directory) is what's in charge of running the app and managing the players, turns and events. The game (see the `games` sub-directories) provides the board image, some metadata about the game, and any custom game logic which applies only to a particular game (like trainer battles in the Pokemon drinking board games). They are meant to live completely separately, and may eventually be moved into a separate repo. This allows the engine to be reused as multiple games are added. To add a new game, it is essentially as simple as just creating a new folder for it and adding the required metadata (along with ensuring the engine supports all required rule types). 

This project utilizes Typescript, Canvas, Rollup and LitElement among other things. 

## usage
For development:
* Git pull
* `npm i`
* `npm start`

## support
This app has been tested on Chrome/FF latest versions. It "works" on the latest mobile devices.

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

### M1.5 (refactor time + usability improvements)
* Clean up typescript in the custom game code
* Enable or disable dice roll resetting based on a prop
* add a new game (johto?)
* Refactor modal into a WCs or multiple child WCs
* Clean up other todos
* Consider better organization of events
* Add description to home page
* Add a modal when skipping a turn, not just a random pause
* Make things a bit prettier
* small util for adding document fragments
* probably would make sense to have a util function class
  * sum numbers
  * hex to rgb
  * etc

### M2
* track game state, store in localstorage in case someone closes the screen
  * state holds events and then instead of listening to the events we listen to when the "current event" in the state changes
* can load a previous game from localstorage
* add some sort of debug/dev mode
  * number the tiles for instance, hardcode rolls, etc. instead of having to change it in code all the time

### M3
* game is playable via websockets OR offline
* for websockets, keep game state in memory on host as it will only be played
* asset minification and polyfills

### M4
* keep track of the drink counts throughout the game
* alert players when they are supposed to drink
* can designate drinks on screen
* unit tests (lol)
* some utility to create json easily

### M5
* can add/remove players mid game. when adding can put them somewhere custom?
* mobile friendly

## other boards
* [Alternate gen 1](https://i.imgur.com/l8CK6ru.jpg)
  * [custom] "Trainer" battles vs "Player" battles
  * [custom] "Blacking out" sends you to the previous gym
  * [engine] Pewter gym requires checking the number you rolled
  * [engine] Viridian forest zone is basically a move condition with a bit extra
  * [engine] Gengar changes how Saffron gym works
  * [engine?] Fighting dojo
  * [engine] Nidofamily, re-rolling a player's roll

## learnings
Here I will document some of my takeaways from this project. 
* When evaluating a CSS framework, size is not everything. I got way too focused on file size and did not put enough thought into usability of the framework. Picnic is pretty great at what it does, but honestly I probably could have made more of a compromise such that I wouldn't have to spend as much time working with Picnic to get it to do exactly what I wanted
* Typescript will be used in every one of my major projects from now on. It may be a pain to set up (not really though), but the time is definitely made up during the dev process
* I wish LitElement came with some sort of JSX integration. Using `html` is a bit cumbersome
* I still have not found an elegant solution to sharing styles in web components that are using shadow DOM
* When doing a project like this, having some idea of the design/requirements beforehand will be really beneficial (obviously). I spent (and am still spending) too much time churning on the design and behavior of the app