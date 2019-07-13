'use strict';

var Tile = (function () {
    function Tile(displayText, isMandatory, rule) {
        this.displayText = displayText;
        this.isMandatory = isMandatory;
        this.rule = rule;
    }
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
            throw new Error('TODO - missing fields for whatever class this is');
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
        var type = json.type, playerTarget = json.playerTarget, diceRolls = json.diceRolls;
        _this = _super.call(this, type, playerTarget, diceRolls) || this;
        return _this;
    }
    DisplayRule.prototype.execute = function () {
    };
    return DisplayRule;
}(Rule));
//# sourceMappingURL=DisplayRule.js.map

var Direction;
(function (Direction) {
    Direction["forward"] = "forward";
    Direction["back"] = "back";
})(Direction || (Direction = {}));
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
        console.log(tileJson);
        var displayText = tileJson.displayText, isMandatory = tileJson.isMandatory, diceRolls = tileJson.diceRolls, rule = tileJson.rule;
        if (!rule) {
            console.warn('No rule specified. Was this a todo?');
            return null;
        }
        return new Tile(displayText, isMandatory, createRule(rule));
    });
}
function createRule(ruleJson) {
    var type = ruleJson.type;
    if (!RULE_MAPPINGS.hasOwnProperty(type)) {
        throw new Error('Invalid rule type specified');
    }
    return new RULE_MAPPINGS[type](ruleJson);
}

var json = require('../pokemon.json');
var tiles = createTiles(json.tiles);
console.log(tiles);
//# sourceMappingURL=test.js.map
