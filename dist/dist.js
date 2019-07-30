'use strict';

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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Tile = (function () {
    function Tile(displayText, isMandatory, rule, coordinates) {
        this.displayText = displayText;
        this.isMandatory = isMandatory;
        this.rule = rule;
        this.currentPlayers = [];
        this.coordinates = coordinates;
    }
    Tile.prototype.placePlayer = function (player) {
        this.currentPlayers.push(player);
        player.currentPos = this.generateCenterPosition();
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

var Rule = (function () {
    function Rule(type, playerTarget, diceRolls) {
        this.validateRequired(type);
        this.type = type;
        this.playerTarget = playerTarget;
    }
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

var DisplayRule = (function (_super) {
    __extends(DisplayRule, _super);
    function DisplayRule(json) {
        var _this = this;
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        return _this;
    }
    DisplayRule.prototype.execute = function () {
    };
    return DisplayRule;
}(Rule));
//# sourceMappingURL=DisplayRule.js.map

var MoveRule = (function (_super) {
    __extends(MoveRule, _super);
    function MoveRule(json) {
        var _this = this;
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, direction = json.direction, numSpaces = json.numSpaces;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        _this.validateRequired(playerTarget, direction, numSpaces);
        _this.direction = direction;
        _this.numSpaces = numSpaces;
        return _this;
    }
    MoveRule.prototype.execute = function () {
    };
    return MoveRule;
}(Rule));
//# sourceMappingURL=MoveRule.js.map

var SkipTurnRule = (function (_super) {
    __extends(SkipTurnRule, _super);
    function SkipTurnRule(json) {
        var _this = this;
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, numTurns = json.numTurns;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        _this.validateRequired(numTurns);
        _this.numTurns = numTurns;
        return _this;
    }
    SkipTurnRule.prototype.execute = function () {
    };
    return SkipTurnRule;
}(Rule));
//# sourceMappingURL=SkipTurnRule.js.map

var SpeedModifierRule = (function (_super) {
    __extends(SpeedModifierRule, _super);
    function SpeedModifierRule(json) {
        var _this = this;
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, multiplier = json.multiplier, numTurns = json.numTurns;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        _this.validateRequired(multiplier, numTurns);
        _this.multiplier = multiplier;
        _this.numTurns = numTurns;
        return _this;
    }
    SpeedModifierRule.prototype.execute = function () {
    };
    return SpeedModifierRule;
}(Rule));
//# sourceMappingURL=SpeedModifierRule.js.map

var TeleportRule = (function (_super) {
    __extends(TeleportRule, _super);
    function TeleportRule(json) {
        var _this = this;
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls, tileIndex = json.tileIndex;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        _this.validateRequired(tileIndex);
        _this.tileIndex = tileIndex;
        return _this;
    }
    TeleportRule.prototype.execute = function () {
    };
    return TeleportRule;
}(Rule));
//# sourceMappingURL=TeleportRule.js.map

var RULE_MAPPINGS = {
    MoveRule: MoveRule,
    DisplayRule: DisplayRule,
    TeleportRule: TeleportRule,
    SkipTurnRule: SkipTurnRule,
    SpeedModifierRule: SpeedModifierRule
};
function createTiles(tilesJson) {
    return tilesJson.map(function (tileJson) {
        var displayText = tileJson.displayText, mandatory = tileJson.mandatory, rule = tileJson.rule, position = tileJson.position;
        if (!rule) {
            console.warn('No rule specified. Was this a todo?');
            return null;
        }
        return new Tile(displayText, mandatory, createRule(rule), position);
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
var Player = (function () {
    function Player(name) {
        this.name = name;
    }
    Player.prototype.placeOnBoard = function (initialPosition) {
        if (initialPosition === void 0) { initialPosition = 0; }
        gameInstance.board.tiles[initialPosition].placePlayer(this);
        this.draw();
    };
    Player.prototype.draw = function () {
        gameInstance.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        gameInstance.ctx.beginPath();
        gameInstance.ctx.arc(this.currentPos.x, this.currentPos.y, RADIUS, 0, Math.PI * 2, true);
        gameInstance.ctx.fill();
        gameInstance.ctx.fillStyle = 'white';
        gameInstance.ctx.font = FONT_SIZE + "px \"Open Sans\"";
        gameInstance.ctx.fillText(this.name[0].toUpperCase(), this.currentPos.x - 6, this.currentPos.y + 6);
    };
    Player.prototype.getRoll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, Math.floor(Math.random() * 6) + 1];
            });
        });
    };
    return Player;
}());
//# sourceMappingURL=Player.js.map

var Game = (function () {
    function Game() {
        if (!Game.instance) {
            Game.instance = this;
        }
        return Game.instance;
    }
    Game.prototype.setup = function (boardSrc, playerNames, canvas) {
        this.turnIndex = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.board = new Board(boardSrc, this.players);
        this.players = playerNames.map(function (name) { return new Player(name); });
        Object.freeze(this.players);
        this.players.forEach(function (p) { return p.placeOnBoard(0); });
        console.log(this.board);
    };
    Game.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var player, roll;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = this.players[this.turnIndex % this.players.length];
                        return [4, player.getRoll()];
                    case 1:
                        roll = _a.sent();
                        return [2];
                }
            });
        });
    };
    Game.prototype.endTurn = function () {
    };
    return Game;
}());
var gameInstance = new Game();
//# sourceMappingURL=Game.js.map

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
            gameInstance.setup(values[1], players, canvas);
        })["catch"](function (err) { return console.error(err); });
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
        initGame(gameSetupInfo[0], gameSetupInfo[1]);
        document.getElementById('setup').classList.add('hidden');
        document.getElementById('modal-background').classList.add('hidden');
    });
}());
//# sourceMappingURL=App.js.map
