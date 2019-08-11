'use strict';

var Tile = (function () {
    function Tile(isMandatory, rule, coordinates) {
        this.isMandatory = isMandatory;
        this.rule = rule;
        this.currentPlayers = [];
        this.coordinates = coordinates;
    }
    Tile.prototype.placePlayer = function (player) {
        this.currentPlayers.push(player);
        player.destinationPos = this.generateCenterPosition();
    };
    Tile.prototype.generateCenterPosition = function () {
        var total = this.coordinates.reduce(function (prev, cur) {
            return { x: prev.x + cur.x, y: prev.y + cur.y };
        }, { x: 0, y: 0 });
        total.x /= this.coordinates.length;
        total.y /= this.coordinates.length;
        return total;
    };
    return Tile;
}());
//# sourceMappingURL=Tile.js.map

var Direction;
(function (Direction) {
    Direction["forward"] = "forward";
    Direction["back"] = "back";
})(Direction || (Direction = {}));
var PlayerTarget;
(function (PlayerTarget) {
    PlayerTarget["custom"] = "custom";
    PlayerTarget["self"] = "self";
    PlayerTarget["allOthers"] = "allOthers";
})(PlayerTarget || (PlayerTarget = {}));
//# sourceMappingURL=index.js.map

var TURN_START = 'TURN_START';
var ROLL_START = 'ROLL_START';
var ROLL_END = 'ROLL_END';
var MOVE_START = 'MOVE_START';
var MOVE_END = 'MOVE_END';
var RULE_TRIGGER = 'RULE_TRIGGER';
var RULE_END = 'RULE_END';
var TURN_END = 'TURN_END';
var GAME_OVER = 'GAME_OVER';
var TURN_SKIP = 'TURN_SKIP';
var ALL_EVENTS = [
    TURN_START, ROLL_START, ROLL_END, MOVE_START, MOVE_END, RULE_TRIGGER, RULE_END,
    TURN_END, GAME_OVER, TURN_SKIP,
];
var GameEvents = (function () {
    function GameEvents() {
        var _this = this;
        if (!GameEvents.instance) {
            GameEvents.instance = this;
        }
        this.eventHandlerMap = new Map();
        ALL_EVENTS.forEach(function (event) {
            _this.eventHandlerMap.set(event, []);
        });
        return GameEvents.instance;
    }
    GameEvents.prototype.on = function (eventName, callback) {
        console.log("Setting an event: " + eventName);
        this.validateEvent(eventName);
        this.eventHandlerMap.get(eventName).push(callback);
    };
    GameEvents.prototype.trigger = function (eventName, eventValues) {
        console.log("Triggering event: " + eventName);
        this.validateEvent(eventName);
        var eventFunctions = this.eventHandlerMap.get(eventName);
        if (!eventFunctions.length)
            return;
        var functionIdx = 0;
        var next = function () {
            if (eventFunctions[++functionIdx]) {
                invokeEventFunction();
            }
        };
        var invokeEventFunction = function () {
            eventFunctions[functionIdx].apply(null, [next].concat(eventValues));
        };
        invokeEventFunction();
    };
    GameEvents.prototype.validateEvent = function (eventName) {
        if (!this.eventHandlerMap.has(eventName)) {
            throw new Error(eventName + " is not a valid event");
        }
    };
    return GameEvents;
}());
var gameEventsInstance = new GameEvents();
//# sourceMappingURL=GameEvents.js.map

var Rule = (function () {
    function Rule(displayText, type, playerTarget, diceRolls) {
        this.validateRequired(type);
        this.type = type;
        this.displayText = displayText;
        this.playerTarget = playerTarget;
        this.diceRolls = diceRolls;
    }
    Rule.prototype.execute = function () {
        gameInstance.modal.show(this.displayText);
        gameInstance.modal.disableClose();
        gameInstance.modal.whenClosed(this.end);
    };
    Rule.prototype.end = function () {
        gameEventsInstance.trigger(RULE_END);
    };
    Rule.prototype.selectPlayers = function () {
        var _this = this;
        var targetPlayers = [];
        return new Promise(function (resolve) {
            switch (_this.playerTarget) {
                case PlayerTarget.allOthers:
                    targetPlayers.push.apply(targetPlayers, gameInstance.getInactivePlayers());
                    resolve(targetPlayers);
                    break;
                case PlayerTarget.custom:
                    gameInstance.modal.requirePlayerSelection(gameInstance.getInactivePlayers())
                        .then(function (playerList) {
                        resolve(playerList);
                    });
                    break;
                default:
                    targetPlayers.push(gameInstance.currentPlayer);
                    resolve(targetPlayers);
            }
        });
    };
    Rule.prototype.validateRequired = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var errors = args
            .filter(function (arg) { return typeof arg === 'undefined' || arg === null || arg === ''; });
        if (errors.length) {
            throw new Error('TODO - alert missing fields for whatever class this is');
        }
    };
    return Rule;
}());
//# sourceMappingURL=Rule.js.map

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var DisplayRule = (function (_super) {
    __extends(DisplayRule, _super);
    function DisplayRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        return _this;
    }
    DisplayRule.prototype.execute = function () {
        _super.prototype.execute.call(this);
        gameInstance.modal.enableClose();
    };
    return DisplayRule;
}(Rule));
//# sourceMappingURL=DisplayRule.js.map

var MoveRule = (function (_super) {
    __extends(MoveRule, _super);
    function MoveRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, direction = json.direction, numSpaces = json.numSpaces;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        _this.validateRequired(playerTarget, direction, numSpaces);
        _this.direction = direction;
        _this.numSpaces = numSpaces;
        return _this;
    }
    MoveRule.prototype.execute = function () {
        var _this = this;
        _super.prototype.execute.call(this);
        this.selectPlayers()
            .then(function (value) {
            var targetPlayer = value[0];
            var targetTileIndex = Math.max(0, targetPlayer.currentTileIndex + _this.numSpaces);
            targetPlayer.moveToTile(targetTileIndex);
            targetPlayer.currentPos = targetPlayer.destinationPos;
            gameInstance.painter.drawPlayers();
            gameInstance.modal.close();
        });
    };
    return MoveRule;
}(Rule));
//# sourceMappingURL=MoveRule.js.map

var SkipTurnRule = (function (_super) {
    __extends(SkipTurnRule, _super);
    function SkipTurnRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, numTurns = json.numTurns;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        _this.validateRequired(numTurns);
        _this.numTurns = numTurns;
        return _this;
    }
    SkipTurnRule.prototype.execute = function () {
        _super.prototype.execute.call(this);
        gameInstance.currentPlayer.skippedTurns += this.numTurns;
        gameInstance.modal.enableClose();
    };
    return SkipTurnRule;
}(Rule));
//# sourceMappingURL=SkipTurnRule.js.map

var SpeedModifierRule = (function (_super) {
    __extends(SpeedModifierRule, _super);
    function SpeedModifierRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, multiplier = json.multiplier, numTurns = json.numTurns;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        _this.validateRequired(multiplier, numTurns);
        _this.multiplier = multiplier;
        _this.numTurns = numTurns;
        return _this;
    }
    SpeedModifierRule.prototype.execute = function () {
        var _this = this;
        _super.prototype.execute.call(this);
        this.selectPlayers()
            .then(function (value) {
            value.forEach(function (p) {
                p.speedModifiers = [];
                for (var i = 0; i < _this.numTurns; i++) {
                    p.speedModifiers.push(_this.multiplier);
                }
                gameInstance.modal.enableClose();
            });
        });
    };
    return SpeedModifierRule;
}(Rule));
//# sourceMappingURL=SpeedModifierRule.js.map

var TeleportRule = (function (_super) {
    __extends(TeleportRule, _super);
    function TeleportRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, tileIndex = json.tileIndex;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        _this.validateRequired(tileIndex);
        _this.tileIndex = tileIndex;
        return _this;
    }
    TeleportRule.prototype.execute = function () {
        _super.prototype.execute.call(this);
        gameInstance.currentPlayer.moveToTile(this.tileIndex);
        gameInstance.currentPlayer.currentPos = gameInstance.currentPlayer.destinationPos;
        gameInstance.painter.drawPlayers();
    };
    return TeleportRule;
}(Rule));
//# sourceMappingURL=TeleportRule.js.map

var GameOverRule = (function (_super) {
    __extends(GameOverRule, _super);
    function GameOverRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        return _this;
    }
    GameOverRule.prototype.execute = function () {
        alert('Game over!');
        gameInstance.gameOver();
    };
    return GameOverRule;
}(Rule));
//# sourceMappingURL=GameOverRule.js.map

var ExtraTurnRule = (function (_super) {
    __extends(ExtraTurnRule, _super);
    function ExtraTurnRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget;
        _this = _super.call(this, displayText, type, playerTarget) || this;
        return _this;
    }
    ExtraTurnRule.prototype.execute = function () {
        _super.prototype.execute.call(this);
        gameInstance.playerTurns.unshift(gameInstance.currentPlayer);
        gameInstance.modal.enableClose();
    };
    return ExtraTurnRule;
}(Rule));
//# sourceMappingURL=ExtraTurnRule.js.map

var DrinkDuringLostTurnsRule = (function (_super) {
    __extends(DrinkDuringLostTurnsRule, _super);
    function DrinkDuringLostTurnsRule(json) {
        var _this = this;
        var displayText = json.displayText, type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls;
        _this = _super.call(this, displayText, type, playerTarget, diceRolls) || this;
        return _this;
    }
    DrinkDuringLostTurnsRule.prototype.execute = function () {
        _super.prototype.execute.call(this);
        gameInstance.modal.requireDiceRolls(this.diceRolls.numRequired, function (rolls) {
            gameInstance.currentPlayer.skippedTurns += rolls[0];
            gameInstance.modal.enableClose();
        });
    };
    return DrinkDuringLostTurnsRule;
}(Rule));
//# sourceMappingURL=DrinkDuringLostTurnsRule.js.map

var RULE_MAPPINGS = {
    MoveRule: MoveRule,
    DisplayRule: DisplayRule,
    TeleportRule: TeleportRule,
    SkipTurnRule: SkipTurnRule,
    SpeedModifierRule: SpeedModifierRule,
    GameOverRule: GameOverRule,
    ExtraTurnRule: ExtraTurnRule,
    DrinkDuringLostTurnsRule: DrinkDuringLostTurnsRule,
};
function createTiles(tilesJson) {
    return tilesJson.map(function (tileJson) {
        var mandatory = tileJson.mandatory, rule = tileJson.rule, position = tileJson.position;
        if (!rule) {
            console.warn('No rule specified. Was this a todo?');
            return null;
        }
        return new Tile(mandatory, createRule(rule), position);
    });
}
function createRule(ruleJson) {
    var type = ruleJson.type;
    if (!RULE_MAPPINGS.hasOwnProperty(type)) {
        console.warn("Invalid rule type specified: " + type);
        return null;
    }
    return new RULE_MAPPINGS[type](ruleJson);
}
//# sourceMappingURL=BoardJsonConverter.js.map

var Board = (function () {
    function Board(json, players) {
        this.imgSrc = json.imgSrc;
        this.tiles = createTiles(json.tiles);
        this.players = players;
    }
    return Board;
}());
//# sourceMappingURL=Board.js.map

var RADIUS = 30;
var FONT_SIZE = 20;
var VELO = 12;
var Player = (function () {
    function Player(name) {
        this.name = name;
        this.skippedTurns = 0;
        this.speedModifiers = [];
    }
    Player.prototype.canTakeTurn = function () {
        if (this.skippedTurns > 0) {
            this.skippedTurns--;
            return false;
        }
        return true;
    };
    Player.prototype.moveToTile = function (tileIndex) {
        if (tileIndex === void 0) { tileIndex = 0; }
        this.currentTileIndex = tileIndex;
        gameInstance.board.tiles[tileIndex].placePlayer(this);
        if (!this.currentPos && this.destinationPos) {
            this.currentPos = this.destinationPos;
        }
    };
    return Player;
}());
//# sourceMappingURL=Player.js.map

var Painter = (function () {
    function Painter(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        gameEventsInstance.on(MOVE_START, this.draw.bind(this));
    }
    Painter.prototype.draw = function () {
        this.drawPlayers();
        var x1 = gameInstance.currentPlayer.currentPos.x;
        var y1 = gameInstance.currentPlayer.currentPos.y;
        var x2 = gameInstance.currentPlayer.destinationPos.x;
        var y2 = gameInstance.currentPlayer.destinationPos.y;
        var dx = x2 - x1;
        var dy = y2 - y1;
        if (Math.abs(dx) < VELO && Math.abs(dy) < VELO) {
            window.cancelAnimationFrame(this.raf);
            gameEventsInstance.trigger(MOVE_END);
            return;
        }
        var totalDistance = Math.sqrt(dx * dx + dy * dy);
        gameInstance.currentPlayer.currentPos.x += (dx / totalDistance) * VELO;
        gameInstance.currentPlayer.currentPos.y += (dy / totalDistance) * VELO;
        this.raf = window.requestAnimationFrame(this.draw.bind(this));
    };
    Painter.prototype.drawPlayers = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = FONT_SIZE + "px \"Open Sans\"";
        for (var i = 0; i < gameInstance.players.length; i++) {
            var player = gameInstance.players[i];
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(player.currentPos.x, player.currentPos.y, RADIUS, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(player.name[0].toUpperCase(), player.currentPos.x - 6, player.currentPos.y + 6);
        }
    };
    return Painter;
}());
//# sourceMappingURL=Painter.js.map

var Modal = (function () {
    function Modal() {
        var _this = this;
        this.triggerId = 'game-modal';
        this.trigger = document.querySelector("#" + this.triggerId);
        this.controls = Array.from(document.querySelectorAll('label[for="game-modal"]'));
        this.header = document.querySelector('.modal h3');
        this.content = document.querySelector('.modal .content');
        this.trigger.addEventListener('change', function (e) {
            if (_this.trigger.checked === false && _this.closeCb) {
                _this.closeCb();
                _this.closeCb = null;
            }
        });
    }
    Modal.prototype.show = function (displayText) {
        this.header.innerText = gameInstance.currentPlayer.name;
        this.content.innerText = displayText;
        this.trigger.checked = true;
    };
    Modal.prototype.close = function () {
        this.enableClose();
        this.trigger.checked = false;
        this.trigger.dispatchEvent(new Event('change'));
    };
    Modal.prototype.disableClose = function () {
        var _this = this;
        this.controls.forEach(function (control) {
            control.setAttribute('for', _this.triggerId + "__DISABLED");
        });
    };
    Modal.prototype.enableClose = function () {
        var _this = this;
        this.controls.forEach(function (control) {
            control.setAttribute('for', _this.triggerId);
        });
    };
    Modal.prototype.requireDiceRolls = function (n, cb) {
        var rolls = [];
        var frag = document.createDocumentFragment();
        for (var i = 0; i < n; i++) {
            frag.appendChild(document.createElement('dice-roll'));
        }
        this.content.appendChild(frag);
        Array.from(this.content.querySelectorAll('dice-roll')).forEach(function (el) {
            el.addEventListener('roll', function (e) {
                rolls.push(e.detail.roll);
                if (rolls.length === n) {
                    cb(rolls);
                }
            });
        });
    };
    Modal.prototype.requirePlayerSelection = function (playerList) {
        var _this = this;
        if (!playerList || playerList.length === 0)
            return Promise.resolve([]);
        var names = playerList.map(function (p) { return p.name; });
        var frag = document.createDocumentFragment();
        var header = document.createElement('h4');
        header.innerText = 'Choose a player';
        frag.appendChild(header);
        names.forEach(function (name) {
            var playerLink = document.createElement('a');
            playerLink.classList.add('sm');
            playerLink.href = '#';
            playerLink.innerText = name;
            playerLink.dataset.name = name;
            frag.appendChild(playerLink);
            frag.appendChild(document.createTextNode('\u00A0\u00A0'));
        });
        this.content.appendChild(frag);
        return new Promise(function (resolve) {
            Array.from(_this.content.querySelectorAll('a')).forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.preventDefault();
                    var selectedPlayer = playerList.find(function (p) {
                        return p.name === e.currentTarget.dataset.name;
                    });
                    resolve([selectedPlayer]);
                    return false;
                });
            });
        });
    };
    Modal.prototype.whenClosed = function (cb) {
        this.closeCb = cb;
    };
    return Modal;
}());
//# sourceMappingURL=Modal.js.map

var Game = (function () {
    function Game() {
        if (!Game.instance) {
            Game.instance = this;
        }
        gameEventsInstance.on(TURN_START, this.startTurn.bind(this));
        gameEventsInstance.on(TURN_END, this.endTurn.bind(this));
        gameEventsInstance.on(ROLL_START, this.enableDiceRoll.bind(this));
        gameEventsInstance.on(ROLL_END, this.endDiceRoll.bind(this));
        gameEventsInstance.on(MOVE_END, this.endMovement.bind(this));
        gameEventsInstance.on(RULE_TRIGGER, this.triggerRule.bind(this));
        gameEventsInstance.on(RULE_END, this.endRule.bind(this));
        return Game.instance;
    }
    Game.prototype.start = function (boardSrc, playerNames, canvas) {
        this.turnIndex = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.board = new Board(boardSrc, this.players);
        this.players = playerNames.map(function (name) { return new Player(name); });
        this.diceLink = document.querySelector('#overlay dice-roll');
        this.modal = new Modal();
        this.painter = new Painter(this.canvas, this.ctx);
        this.players.forEach(function (p) { return p.moveToTile(0); });
        this.playerTurns = this.players.slice();
        this.painter.drawPlayers();
        document.querySelector('#skip a').addEventListener('click', function (e) {
            e.preventDefault();
            gameEventsInstance.trigger(TURN_END);
            return false;
        });
        gameEventsInstance.trigger(TURN_START);
    };
    Game.prototype.startTurn = function () {
        if (!this.playerTurns.length)
            this.playerTurns = this.players.slice();
        this.currentPlayer = this.playerTurns.shift();
        gameEventsInstance.trigger(this.currentPlayer.canTakeTurn() ? ROLL_START : TURN_END);
        document.querySelector('#overlay h4').innerHTML = this.currentPlayer.name;
    };
    Game.prototype.enableDiceRoll = function (next) {
        var _this = this;
        var handleRoll = function (e) {
            var roll = e.detail.roll;
            gameEventsInstance.trigger(ROLL_END, [roll]);
            next();
            _this.diceLink.removeEventListener('roll', handleRoll);
        };
        this.diceLink.reset();
        this.diceLink.addEventListener('roll', handleRoll);
    };
    Game.prototype.endDiceRoll = function (next, roll) {
        if (this.currentPlayer.speedModifiers.length) {
            var modifier = this.currentPlayer.speedModifiers.shift();
            roll = Math.ceil(modifier * roll);
        }
        var firstMandatoryIndex = this.board.tiles
            .slice(this.currentPlayer.currentTileIndex + 1, this.currentPlayer.currentTileIndex + 1 + roll)
            .findIndex(function (tile) {
            return tile.isMandatory;
        });
        var numSpacesToAdvance = (firstMandatoryIndex === -1 ? roll : firstMandatoryIndex + 1);
        if (numSpacesToAdvance > 0) {
            this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + numSpacesToAdvance);
            gameEventsInstance.trigger(MOVE_START);
        }
        next();
    };
    Game.prototype.endMovement = function (next) {
        gameEventsInstance.trigger(RULE_TRIGGER);
    };
    Game.prototype.triggerRule = function (next) {
        var currentTile = this.board.tiles[this.currentPlayer.currentTileIndex];
        var currentRule = currentTile.rule;
        if (currentRule)
            currentRule.execute();
        next();
    };
    Game.prototype.endRule = function (next) {
        next();
        gameEventsInstance.trigger(TURN_END);
    };
    Game.prototype.endTurn = function (next) {
        next();
        this.turnIndex++;
        gameEventsInstance.trigger(TURN_START);
    };
    Game.prototype.gameOver = function () {
        alert("Game over!\n\n Winner: " + this.currentPlayer.name);
    };
    Game.prototype.getInactivePlayers = function () {
        var _this = this;
        return this.players.filter(function (p) {
            return p !== _this.currentPlayer;
        });
    };
    return Game;
}());
var gameInstance = new Game();

(function () {
    function fetchImage(src, canvas) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.src = src;
            img.addEventListener('load', function () {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.style.background = "url(" + src + ")";
                canvas.style.backgroundSize = '100% 100%';
                resolve();
            });
        });
    }
    function fetchBoard(src) {
        return new Promise(function (resolve) {
            fetch(src)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return resolve(data); });
        });
    }
    function getFormValues() {
        var boardPrefix = document.getElementById('game').value;
        var players = Array.from(document.querySelectorAll('#player-input input'))
            .filter(function (input) { return !!input.value; })
            .map(function (input) { return input.value; });
        return [boardPrefix, players];
    }
    function initGame(boardPrefix, players) {
        var canvas = document.getElementById('canvas');
        var imgSrc = boardPrefix + "/index.png";
        var boardSrc = boardPrefix + "/index.json";
        Promise.all([fetchImage(imgSrc, canvas), fetchBoard(boardSrc)])
            .then(function (values) {
            gameInstance.start(values[1], players, canvas);
        })
            .catch(function (err) { return console.error(err); });
    }
    document.getElementById('add-player').addEventListener('click', function (e) {
        e.preventDefault();
        var frag = document.createDocumentFragment();
        var input = document.createElement('input');
        input.type = 'text';
        frag.appendChild(input);
        document.getElementById('player-input').appendChild(frag);
        return false;
    });
    document.getElementById('setup').addEventListener('submit', function (e) {
        e.preventDefault();
        var gameSetupInfo = getFormValues();
        if (!gameSetupInfo[1].length) {
            alert('You need players to play this game');
            return;
        }
        initGame(gameSetupInfo[0], gameSetupInfo[1]);
        document.getElementById('setup').style.display = 'none';
        document.getElementById('overlay').style.display = 'block';
    });
}());
//# sourceMappingURL=App.js.map
