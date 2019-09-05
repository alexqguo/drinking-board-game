(function(){'use strict';class Tile {
    constructor(isMandatory, rule, coordinates) {
        this.isMandatory = isMandatory;
        this.rule = rule;
        this.coordinates = coordinates;
    }
    generateCenterPosition() {
        const total = this.coordinates.reduce((prev, cur) => {
            return { x: prev.x + cur.x, y: prev.y + cur.y };
        }, { x: 0, y: 0 });
        total.x /= this.coordinates.length;
        total.y /= this.coordinates.length;
        return total;
    }
}
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
const TURN_START = 'TURN_START';
const LOST_TURN_START = 'LOST_TURN_START';
const ROLL_START = 'ROLL_START';
const ROLL_END = 'ROLL_END';
const MOVE_START = 'MOVE_START';
const MOVE_END = 'MOVE_END';
const RULE_TRIGGER = 'RULE_TRIGGER';
const RULE_END = 'RULE_END';
const TURN_END = 'TURN_END';
const GAME_OVER = 'GAME_OVER';
const TURN_SKIP = 'TURN_SKIP';
const ALL_EVENTS = [
    TURN_START, ROLL_START, ROLL_END, MOVE_START, MOVE_END, RULE_TRIGGER, RULE_END,
    TURN_END, GAME_OVER, TURN_SKIP, LOST_TURN_START,
];
class GameEvents {
    constructor() {
        if (!GameEvents.instance) {
            GameEvents.instance = this;
        }
        this.eventHandlerMap = new Map();
        ALL_EVENTS.forEach((event) => {
            this.eventHandlerMap.set(event, []);
        });
        return GameEvents.instance;
    }
    on(eventName, callback) {
        this.validateEvent(eventName);
        this.eventHandlerMap.get(eventName).push(callback);
    }
    trigger(eventName, eventValues) {
        this.validateEvent(eventName);
        const eventFunctions = this.eventHandlerMap.get(eventName);
        if (!eventFunctions.length)
            return;
        let functionIdx = 0;
        const next = () => {
            if (eventFunctions[++functionIdx]) {
                invokeEventFunction();
            }
        };
        const invokeEventFunction = () => {
            let args = [next];
            if (eventValues && eventValues.length) {
                args = args.concat(eventValues);
            }
            eventFunctions[functionIdx].apply(null, args);
        };
        invokeEventFunction();
    }
    validateEvent(eventName) {
        if (!this.eventHandlerMap.has(eventName)) {
            throw new Error(`${eventName} is not a valid event`);
        }
    }
}
const gameEventsInstance = new GameEvents();
//# sourceMappingURL=GameEvents.js.map
class Rule {
    constructor(json) {
        const { displayText, type, playerTarget, criteria } = json;
        this.validateRequired(type);
        this.type = type;
        this.displayText = displayText;
        this.playerTarget = playerTarget;
        this.criteria = criteria;
    }
    execute() {
        gameInstance.modal.show(this.displayText);
        gameInstance.modal.disableClose();
        gameInstance.modal.whenClosed(this.end);
    }
    ;
    end() {
        gameEventsInstance.trigger(RULE_END);
    }
    selectPlayers() {
        const targetPlayers = [];
        return new Promise((resolve) => {
            switch (this.playerTarget) {
                case PlayerTarget.allOthers:
                    targetPlayers.push(...gameInstance.getInactivePlayers());
                    resolve(targetPlayers);
                    break;
                case PlayerTarget.custom:
                    gameInstance.modal.requirePlayerSelection(gameInstance.getInactivePlayers())
                        .then((playerList) => {
                        resolve(playerList);
                    });
                    break;
                default:
                    targetPlayers.push(gameInstance.currentPlayer);
                    resolve(targetPlayers);
            }
        });
    }
    validateRequired(...args) {
        const errors = args
            .filter(arg => typeof arg === 'undefined' || arg === null || arg === '');
        if (errors.length) {
            throw new Error('TODO - alert missing fields for whatever class this is');
        }
    }
}
//# sourceMappingURL=Rule.js.map
class DisplayRule extends Rule {
    constructor(json) {
        super(json);
        this.validateRequired(json.displayText);
    }
    execute() {
        super.execute();
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=DisplayRule.js.map
class MoveRule extends Rule {
    constructor(json) {
        super(json);
        const { playerTarget, direction, numSpaces } = json;
        this.validateRequired(playerTarget, direction, numSpaces);
        this.direction = direction;
        this.numSpaces = numSpaces;
    }
    execute() {
        super.execute();
        this.selectPlayers()
            .then((value) => {
            const targetPlayer = value[0];
            const targetTileIndex = Math.max(0, targetPlayer.currentTileIndex + this.numSpaces);
            targetPlayer.teleportToTile(targetTileIndex);
            gameInstance.painter.drawPlayers();
            gameInstance.modal.close();
        });
    }
}
//# sourceMappingURL=MoveRule.js.map
class SkipTurnRule extends Rule {
    constructor(json) {
        super(json);
        const { numTurns } = json;
        this.validateRequired(numTurns);
        this.numTurns = numTurns;
    }
    execute() {
        super.execute();
        gameInstance.currentPlayer.effects.skippedTurns += this.numTurns;
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=SkipTurnRule.js.map
class SpeedModifierRule extends Rule {
    constructor(json) {
        super(json);
        const { multiplier, numTurns } = json;
        this.validateRequired(multiplier, numTurns);
        this.multiplier = multiplier;
        this.numTurns = numTurns;
    }
    execute() {
        super.execute();
        this.selectPlayers()
            .then((value) => {
            value.forEach((p) => {
                p.effects.speedModifiers = [];
                for (let i = 0; i < this.numTurns; i++) {
                    p.effects.speedModifiers.push(this.multiplier);
                }
            });
            gameInstance.modal.enableClose();
        });
    }
}
//# sourceMappingURL=SpeedModifierRule.js.map
class TeleportRule extends Rule {
    constructor(json) {
        super(json);
        const { tileIndex } = json;
        this.validateRequired(tileIndex);
        this.tileIndex = tileIndex;
    }
    execute() {
        super.execute();
        gameInstance.currentPlayer.teleportToTile(this.tileIndex);
        gameInstance.painter.drawPlayers();
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=TeleportRule.js.map
class GameOverRule extends Rule {
    constructor(json) {
        super(json);
    }
    execute() {
        super.execute();
        gameInstance.gameOver();
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=GameOverRule.js.map
class ExtraTurnRule extends Rule {
    constructor(json) {
        super(json);
    }
    execute() {
        super.execute();
        gameInstance.currentPlayer.effects.extraTurns++;
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=ExtraTurnRule.js.map
class DrinkDuringLostTurnsRule extends Rule {
    constructor(json) {
        super(json);
        this.diceRolls = json.diceRolls;
    }
    execute() {
        super.execute();
        gameInstance.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls) => {
            gameInstance.currentPlayer.effects.skippedTurns += rolls[0];
            gameInstance.modal.enableClose();
        });
    }
}
//# sourceMappingURL=DrinkDuringLostTurnsRule.js.map
class ApplyMoveConditionRule extends Rule {
    constructor(json) {
        super(json);
        const { condition } = json;
        this.validateRequired(condition);
        this.successes = new Map();
        this.condition = condition;
    }
    execute() {
        super.execute();
        this.selectPlayers()
            .then((value) => {
            value.forEach((p) => {
                this.successes.set(p, 0);
                const canPlayerMove = (roll) => {
                    if (this.condition.criteria.indexOf(roll) === -1) {
                        if (!this.condition.numSuccessesRequired) {
                            p.effects.moveCondition = null;
                            this.successes.delete(p);
                        }
                        return false;
                    }
                    const currentSuccesses = this.successes.get(p);
                    this.successes.set(p, currentSuccesses + 1);
                    if (!this.condition.numSuccessesRequired ||
                        this.successes.get(p) >= this.condition.numSuccessesRequired) {
                        p.effects.moveCondition = null;
                        this.successes.delete(p);
                        return true;
                    }
                    return false;
                };
                p.effects.moveCondition = canPlayerMove;
                if (this.condition.immediate) {
                    gameInstance.modal.requireDiceRolls(1, (rolls) => {
                        canPlayerMove(rolls[0]);
                    });
                }
            });
            if (this.playerTarget === PlayerTarget.custom) {
                gameInstance.modal.close();
            }
            else {
                gameInstance.modal.enableClose();
            }
        });
    }
}
//# sourceMappingURL=ApplyMoveConditionRule.js.map
class DiceRollRule extends Rule {
    constructor(json) {
        super(json);
        this.diceRolls = json.diceRolls;
        this.outcomeRules = [];
        if (this.diceRolls.outcomes && this.diceRolls.outcomes.length) {
            this.diceRolls.outcomes.forEach((rule) => {
                this.outcomeRules.push(createRule(rule));
            });
        }
        if (this.diceRolls.any) {
            this.any = createRule(this.diceRolls.any);
        }
    }
    getOutcomeForRolls(rolls) {
        let outcomeRule = null;
        if (!this.outcomeRules && !this.any)
            return null;
        if (this.any) {
            for (let i = 0; i < rolls.length; i++) {
                if (this.any.criteria.indexOf(rolls[i]) !== -1) {
                    return this.any;
                }
            }
        }
        rolls.forEach((roll) => {
            this.outcomeRules.forEach((rule) => {
                if (rule.criteria && rule.criteria.length && rule.criteria.indexOf(roll) !== -1) {
                    outcomeRule = rule;
                }
            });
        });
        return outcomeRule;
    }
    execute() {
        super.execute();
        gameInstance.modal.requireDiceRolls(this.diceRolls.numRequired, (rolls) => {
            const outcomeRule = this.getOutcomeForRolls(rolls);
            if (outcomeRule) {
                outcomeRule.execute();
            }
            else {
                gameInstance.modal.enableClose();
            }
        });
    }
}
//# sourceMappingURL=DiceRollRule.js.map
class RollUntilRule extends Rule {
    constructor(json) {
        super(json);
        this.validateRequired(json.displayText);
    }
    execute() {
        super.execute();
        const rollUntilFn = () => {
            gameInstance.modal.requireDiceRolls(1, (rolls) => {
                if (this.criteria.indexOf(rolls[0]) !== -1) {
                    gameInstance.modal.enableClose();
                }
                else {
                    rollUntilFn();
                }
            });
        };
        rollUntilFn();
    }
}
//# sourceMappingURL=RollUntilRule.js.map
class ChoiceRule extends Rule {
    constructor(json) {
        super(json);
        const { choices, diceRolls } = json;
        this.validateRequired(choices);
        this.choiceRules = [];
        this.diceRolls = diceRolls;
        if (choices && choices.length) {
            choices.forEach((rule) => {
                this.choiceRules.push(createRule(rule));
            });
        }
    }
    execute() {
        super.execute();
        if (this.diceRolls) {
            gameInstance.modal.requireDiceRolls(this.diceRolls.numRequired, () => { });
        }
        gameInstance.modal.requireChoice(this.choiceRules)
            .then((value) => {
            if (!value) {
                gameInstance.modal.enableClose();
                return;
            }
            value.execute();
        });
    }
}
//# sourceMappingURL=ChoiceRule.js.map
class SkipNextMandatoryRule extends Rule {
    constructor(json) {
        super(json);
        this.validateRequired(json.numSpaces);
        this.numSpaces = json.numSpaces;
    }
    execute() {
        super.execute();
        gameInstance.currentPlayer.effects.mandatorySkips = this.numSpaces;
        gameInstance.modal.enableClose();
    }
}
//# sourceMappingURL=SkipNextMandatoryRule.js.map
class ChallengeRule extends Rule {
    constructor(json) {
        super(json);
        this.playerTarget = PlayerTarget.custom;
    }
    execute() {
        super.execute();
        this.selectPlayers()
            .then((value) => {
            const challengers = [value[0], gameInstance.currentPlayer];
            gameInstance.modal.requirePlayerSelection(challengers, 'Who won?')
                .then((value) => {
                const winningPlayer = value[0];
                const losingPlayer = challengers.find((p) => p !== winningPlayer);
                losingPlayer.effects.skippedTurns++;
                winningPlayer.effects.extraTurns++;
                gameInstance.modal.close();
            });
        });
    }
}
//# sourceMappingURL=ChallengeRule.js.map
const RULE_MAPPINGS = {
    MoveRule: MoveRule,
    DisplayRule: DisplayRule,
    TeleportRule: TeleportRule,
    SkipTurnRule: SkipTurnRule,
    SpeedModifierRule: SpeedModifierRule,
    GameOverRule: GameOverRule,
    ExtraTurnRule: ExtraTurnRule,
    DrinkDuringLostTurnsRule: DrinkDuringLostTurnsRule,
    ApplyMoveConditionRule: ApplyMoveConditionRule,
    DiceRollRule: DiceRollRule,
    RollUntilRule: RollUntilRule,
    ChoiceRule: ChoiceRule,
    SkipNextMandatoryRule: SkipNextMandatoryRule,
    ChallengeRule: ChallengeRule,
};
function createTiles(tilesJson) {
    return tilesJson.map((tileJson) => {
        const { mandatory, rule, position } = tileJson;
        if (!rule) {
            console.warn('No rule specified. Was this a todo?');
            return null;
        }
        return new Tile(mandatory, createRule(rule), position);
    });
}
function createRule(ruleJson) {
    const { type } = ruleJson;
    if (!RULE_MAPPINGS.hasOwnProperty(type)) {
        console.warn(`Invalid rule type specified: ${type}`);
        return null;
    }
    return new RULE_MAPPINGS[type](ruleJson);
}
//# sourceMappingURL=BoardJsonConverter.js.map
class Board {
    constructor(json, players) {
        this.imgSrc = json.imgSrc;
        this.tiles = createTiles(json.tiles);
        this.players = players;
    }
}
//# sourceMappingURL=Board.js.map
const RADIUS = 30;
const FONT_SIZE = 20;
const VELO = 12;
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
class Player {
    constructor(input) {
        this.name = input.name;
        this.color = hexToRgb(input.color);
        this.effects = {
            extraTurns: 0,
            skippedTurns: 0,
            speedModifiers: [],
            mandatorySkips: 0,
            moveCondition: null,
        };
    }
    canTakeTurn() {
        if (this.effects.skippedTurns > 0) {
            this.effects.skippedTurns--;
            return false;
        }
        return true;
    }
    moveToTile(tileIndex) {
        this.moveQueue = [];
        for (let i = this.currentTileIndex + 1; i <= tileIndex; i++) {
            this.moveQueue.push(gameInstance.board.tiles[i].generateCenterPosition());
        }
        this.currentTileIndex = tileIndex;
    }
    teleportToTile(tileIndex) {
        this.currentTileIndex = tileIndex;
        this.currentPos = gameInstance.board.tiles[tileIndex].generateCenterPosition();
    }
}
//# sourceMappingURL=Player.js.map
class Painter {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        gameEventsInstance.on(MOVE_START, this.draw.bind(this));
    }
    draw() {
        this.drawPlayers();
        const x1 = gameInstance.currentPlayer.currentPos.x;
        const y1 = gameInstance.currentPlayer.currentPos.y;
        const x2 = gameInstance.currentPlayer.moveQueue[0].x;
        const y2 = gameInstance.currentPlayer.moveQueue[0].y;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const totalDistance = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dx) < VELO && Math.abs(dy) < VELO) {
            gameInstance.currentPlayer.moveQueue.shift();
            if (!gameInstance.currentPlayer.moveQueue.length) {
                window.cancelAnimationFrame(this.raf);
                gameEventsInstance.trigger(MOVE_END);
                return;
            }
        }
        if (totalDistance > 0) {
            const incrementX = (dx / totalDistance) * VELO;
            const incrementY = (dy / totalDistance) * VELO;
            gameInstance.currentPlayer.currentPos.x += incrementX;
            gameInstance.currentPlayer.currentPos.y += incrementY;
            window.scrollBy(incrementX, incrementY);
        }
        this.raf = window.requestAnimationFrame(this.draw.bind(this));
    }
    drawPlayers() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = `${FONT_SIZE}px "Open Sans"`;
        for (let i = 0; i < gameInstance.players.length; i++) {
            const player = gameInstance.players[i];
            this.ctx.fillStyle = `rgba(${player.color.r}, ${player.color.g}, ${player.color.b}, 0.7)`;
            this.ctx.beginPath();
            this.ctx.arc(player.currentPos.x, player.currentPos.y, RADIUS, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.fillStyle = 'gray';
            this.ctx.fillText(player.name[0].toUpperCase(), player.currentPos.x - 6, player.currentPos.y + 6);
        }
    }
}class Modal {
    constructor() {
        this.triggerId = 'game-modal';
        this.trigger = document.querySelector(`#${this.triggerId}`);
        this.controls = Array.from(document.querySelectorAll('label[for="game-modal"]'));
        this.header = document.querySelector('.modal h3');
        this.content = document.querySelector('.modal .content');
        this.trigger.addEventListener('change', (e) => {
            if (this.trigger.checked === false && this.closeCb) {
                this.closeCb();
                this.closeCb = null;
            }
        });
    }
    show(displayText) {
        this.header.innerText = gameInstance.currentPlayer.name;
        this.content.innerText = displayText;
        this.trigger.checked = true;
    }
    close() {
        this.enableClose();
        this.trigger.checked = false;
        this.trigger.dispatchEvent(new Event('change'));
    }
    disableClose() {
        this.controls.forEach((control) => {
            control.setAttribute('for', `${this.triggerId}__DISABLED`);
        });
    }
    enableClose() {
        this.controls.forEach((control) => {
            control.setAttribute('for', this.triggerId);
        });
    }
    requireDiceRolls(n, cb) {
        const rolls = [];
        const frag = document.createDocumentFragment();
        for (let i = 0; i < n; i++) {
            frag.appendChild(document.createElement('dice-roll'));
        }
        this.content.appendChild(frag);
        Array.from(this.content.querySelectorAll('dice-roll')).forEach((el) => {
            el.addEventListener('roll', (e) => {
                rolls.push(e.detail.roll);
                if (rolls.length === n) {
                    setTimeout(() => { cb(rolls); }, 1000);
                }
            });
        });
    }
    requirePlayerSelection(playerList, headerString = 'Choose a player') {
        if (!playerList || playerList.length === 0)
            return Promise.resolve([]);
        const links = this.addLinks(headerString, playerList.map(p => p.name));
        return new Promise((resolve) => {
            Array.from(links).forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedPlayer = playerList.find((p) => {
                        return p.name === e.currentTarget.dataset.name;
                    });
                    resolve([selectedPlayer]);
                    return false;
                });
            });
        });
    }
    requireChoice(rules) {
        if (!rules || rules.length === 0)
            return Promise.resolve(null);
        const links = this.addLinks('Choose an outcome', rules.map(r => r.displayText));
        return new Promise((resolve) => {
            Array.from(links).forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedRule = rules.find((r) => {
                        return r.displayText === e.currentTarget.dataset.name;
                    });
                    resolve(selectedRule);
                    return false;
                });
            });
        });
    }
    addLinks(headerText, descriptions) {
        const links = [];
        const frag = document.createDocumentFragment();
        const header = document.createElement('h4');
        header.innerText = headerText;
        frag.appendChild(header);
        descriptions.forEach((desc) => {
            const playerLink = document.createElement('a');
            playerLink.classList.add('sm');
            playerLink.href = '#';
            playerLink.innerText = desc;
            playerLink.dataset.name = desc;
            frag.appendChild(playerLink);
            frag.appendChild(document.createTextNode('\u00A0\u00A0'));
            links.push(playerLink);
        });
        this.content.appendChild(frag);
        return links;
    }
    whenClosed(cb) {
        this.closeCb = cb;
    }
}
//# sourceMappingURL=Modal.js.map
class Game {
    constructor() {
        if (!Game.instance) {
            Game.instance = this;
        }
        gameEventsInstance.on(LOST_TURN_START, this.startLostTurn.bind(this));
        gameEventsInstance.on(TURN_START, this.startTurn.bind(this));
        gameEventsInstance.on(TURN_END, this.endTurn.bind(this));
        gameEventsInstance.on(ROLL_START, this.enableDiceRoll.bind(this));
        gameEventsInstance.on(ROLL_END, this.endDiceRoll.bind(this));
        gameEventsInstance.on(MOVE_END, this.endMovement.bind(this));
        gameEventsInstance.on(RULE_TRIGGER, this.triggerRule.bind(this));
        gameEventsInstance.on(RULE_END, this.endRule.bind(this));
        return Game.instance;
    }
    start(boardSrc, playerNames, canvas) {
        this.turnIndex = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.board = new Board(boardSrc, this.players);
        this.players = playerNames.map((p) => new Player(p));
        this.diceLink = document.querySelector('#overlay dice-roll');
        this.modal = new Modal();
        this.painter = new Painter(this.canvas, this.ctx);
        this.players.forEach((p) => p.teleportToTile(0));
        this.playerTurns = [...this.players];
        this.painter.drawPlayers();
        this.handleDiceRoll = this.handleDiceRoll.bind(this);
        document.querySelector('#skip a').addEventListener('click', (e) => {
            e.preventDefault();
            this.diceLink.removeEventListener('roll', this.handleDiceRoll);
            gameEventsInstance.trigger(TURN_END);
            return false;
        });
        gameEventsInstance.trigger(TURN_START);
    }
    startTurn() {
        if (!this.playerTurns.length)
            this.playerTurns = [...this.players];
        this.currentPlayer = this.playerTurns.shift();
        this.updatePlayerStatusElement();
        gameEventsInstance.trigger(this.currentPlayer.canTakeTurn() ? ROLL_START : LOST_TURN_START);
        window.scrollTo({
            top: this.currentPlayer.currentPos.y - (window.outerHeight / 2),
            left: this.currentPlayer.currentPos.x - (window.outerWidth / 2),
            behavior: 'smooth'
        });
    }
    startLostTurn() {
        setTimeout(() => {
            gameEventsInstance.trigger(TURN_END);
        }, 3000);
    }
    enableDiceRoll(next) {
        this.diceLink.reset();
        this.diceLink.addEventListener('roll', this.handleDiceRoll);
        next();
    }
    handleDiceRoll(e) {
        const roll = e.detail.roll;
        gameEventsInstance.trigger(ROLL_END, [roll]);
        this.diceLink.removeEventListener('roll', this.handleDiceRoll);
    }
    endDiceRoll(next, roll) {
        if (this.currentPlayer.effects.moveCondition) {
            const canMove = this.currentPlayer.effects.moveCondition(roll);
            if (!canMove) {
                setTimeout(() => {
                    gameEventsInstance.trigger(TURN_END);
                }, 2000);
                next();
                return;
            }
        }
        if (this.currentPlayer.effects.speedModifiers.length) {
            const modifier = this.currentPlayer.effects.speedModifiers.shift();
            roll = Math.ceil(modifier * roll);
        }
        let firstMandatoryIndex = this.board.tiles
            .slice(this.currentPlayer.currentTileIndex + 1, this.currentPlayer.currentTileIndex + 1 + roll)
            .findIndex((tile) => {
            return tile.isMandatory;
        });
        if (this.currentPlayer.effects.mandatorySkips > 0 && firstMandatoryIndex !== -1) {
            this.currentPlayer.effects.mandatorySkips--;
            firstMandatoryIndex = -1;
        }
        let numSpacesToAdvance = (firstMandatoryIndex === -1 ? roll : firstMandatoryIndex + 1);
        if (this.currentPlayer.name === 'asdf' && !window.asdf) {
            numSpacesToAdvance = 18;
            window.asdf = true;
        }
        if (numSpacesToAdvance > 0) {
            this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex + numSpacesToAdvance);
            gameEventsInstance.trigger(MOVE_START);
        }
        next();
    }
    endMovement(next) {
        gameEventsInstance.trigger(RULE_TRIGGER);
    }
    triggerRule(next) {
        const currentTile = this.board.tiles[this.currentPlayer.currentTileIndex];
        const currentRule = currentTile.rule;
        currentRule.execute();
        this.updatePlayerStatusElement();
        next();
    }
    endRule(next) {
        next();
        gameEventsInstance.trigger(TURN_END);
    }
    endTurn(next) {
        this.turnIndex++;
        if (this.currentPlayer.effects.extraTurns > 0) {
            this.currentPlayer.effects.extraTurns--;
            this.playerTurns.unshift(this.currentPlayer);
        }
        gameEventsInstance.trigger(TURN_START);
        next();
    }
    gameOver() {
        alert(`Game over!\n\n Winner: ${this.currentPlayer.name}`);
    }
    getInactivePlayers() {
        return this.players.filter((p) => {
            return p !== this.currentPlayer;
        });
    }
    updatePlayerStatusElement() {
        const jsonReplacer = (key, value) => {
            return (typeof value === 'function' ? true : value);
        };
        const playerStatusEl = document.querySelector('#overlay player-status');
        const args = { name: this.currentPlayer.name, effects: this.currentPlayer.effects };
        playerStatusEl.setAttribute('data', JSON.stringify(args, jsonReplacer));
    }
}
const gameInstance = new Game();
//# sourceMappingURL=Game.js.map
(function () {
    window.g = gameInstance;
    function fetchImage(src, canvas) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.addEventListener('load', () => {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.style.background = `url(${src})`;
                canvas.style.backgroundSize = '100% 100%';
                resolve();
            });
        });
    }
    function fetchBoard(src) {
        return new Promise(resolve => {
            fetch(src)
                .then(resp => resp.json())
                .then(data => resolve(data));
        });
    }
    function getFormValues() {
        const formData = [];
        const boardPrefix = document.getElementById('game').value;
        const players = Array.from(document.querySelectorAll('#player-input input[type="text"]'))
            .filter((input) => !!input.value)
            .map((input) => input.value);
        const colors = Array.from(document.querySelectorAll('#player-input input[type="color"]'))
            .filter((input) => !!input.value)
            .map((input) => input.value);
        players.forEach((name, idx) => {
            const color = colors[idx] || '#000000';
            formData.push({ name, color });
        });
        return [boardPrefix, formData];
    }
    function initGame(boardPrefix, players) {
        const canvas = document.getElementById('canvas');
        const imgSrc = `${boardPrefix}/index.png`;
        const boardSrc = `${boardPrefix}/index.json`;
        Promise.all([fetchImage(imgSrc, canvas), fetchBoard(boardSrc)])
            .then((values) => {
            gameInstance.start(values[1], players, canvas);
        })
            .catch(err => console.error(err));
    }
    document.getElementById('add-player').addEventListener('click', (e) => {
        e.preventDefault();
        const frag = document.createDocumentFragment();
        const input = document.createElement('player-input');
        frag.appendChild(input);
        document.getElementById('player-input').appendChild(frag);
        return false;
    });
    document.getElementById('setup').addEventListener('submit', (e) => {
        e.preventDefault();
        const gameSetupInfo = getFormValues();
        if (!gameSetupInfo[1].length) {
            alert('You need players to play this game');
            return;
        }
        const names = gameSetupInfo[1].map((val) => val.name);
        if (new Set(names).size < gameSetupInfo[1].length) {
            alert('Player names must be unique');
            return;
        }
        initGame(gameSetupInfo[0], gameSetupInfo[1]);
        document.getElementById('setup').style.display = 'none';
        document.getElementById('overlay').style.display = 'block';
    });
}());
//# sourceMappingURL=App.js.map
}());