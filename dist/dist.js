'use strict';

var Tile = (function () {
    function Tile(displayText, isMandatory, ruleJson) {
        this.displayText = displayText;
        this.isMandatory = isMandatory;
    }
    return Tile;
}());

console.log(Tile);
