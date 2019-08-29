(function(){'use strict';function a(a,c){function b(){this.constructor=a}r(a,c),a.prototype=null===c?Object.create(c):(b.prototype=c.prototype,new b)}function b(a){return a.map(function(a){var b=a.mandatory,d=a.rule,f=a.position;return d?new e(b,c(d),f):(console.warn("No rule specified. Was this a todo?"),null)})}function c(a){var b=a.type;return G.hasOwnProperty(b)?new G[b](a):(console.warn("Invalid rule type specified: "+b),null)}var d,e=function(){function a(a,b,c){this.isMandatory=a,this.rule=b,this.currentPlayers=[],this.coordinates=c}return a.prototype.placePlayer=function(a){this.currentPlayers.push(a),a.destinationPos=this.generateCenterPosition()},a.prototype.generateCenterPosition=function(){var a=this.coordinates.reduce(function(a,b){return{x:a.x+b.x,y:a.y+b.y}},{x:0,y:0});return a.x/=this.coordinates.length,a.y/=this.coordinates.length,a},a}();(function(a){a.forward="forward",a.back="back"})(d||(d={}));var f;(function(a){a.custom="custom",a.self="self",a.allOthers="allOthers"})(f||(f={}));var g="ROLL_START",h="ROLL_END",i="MOVE_START",j="MOVE_END",k="RULE_TRIGGER",l="RULE_END",m="TURN_END",n=["TURN_START",g,h,i,j,k,l,m,"GAME_OVER","TURN_SKIP"],o=function(){function a(){var b=this;return a.instance||(a.instance=this),this.eventHandlerMap=new Map,n.forEach(function(a){b.eventHandlerMap.set(a,[])}),a.instance}return a.prototype.on=function(a,b){this.validateEvent(a),this.eventHandlerMap.get(a).push(b)},a.prototype.trigger=function(a,b){this.validateEvent(a);var c=this.eventHandlerMap.get(a);if(c.length){var d=0,e=function(){c[++d]&&f()},f=function(){c[d].apply(null,[e].concat(b))};f()}},a.prototype.validateEvent=function(a){if(!this.eventHandlerMap.has(a))throw new Error(a+" is not a valid event")},a}(),p=new o,q=function(){function a(a){var b=a.displayText,c=a.type,d=a.playerTarget,e=a.criteria;this.validateRequired(c),this.type=c,this.displayText=b,this.playerTarget=d,this.criteria=e}return a.prototype.execute=function(){N.modal.show(this.displayText),N.modal.disableClose(),N.modal.whenClosed(this.end)},a.prototype.end=function(){p.trigger(l)},a.prototype.selectPlayers=function(){var a=this,b=[];return new Promise(function(c){switch(a.playerTarget){case f.allOthers:b.push.apply(b,N.getInactivePlayers()),c(b);break;case f.custom:N.modal.requirePlayerSelection(N.getInactivePlayers()).then(function(a){c(a)});break;default:b.push(N.currentPlayer),c(b);}})},a.prototype.validateRequired=function(){for(var a=[],b=0;b<arguments.length;b++)a[b]=arguments[b];var c=a.filter(function(a){return"undefined"==typeof a||null===a||""===a});if(c.length)throw new Error("TODO - alert missing fields for whatever class this is")},a}(),r=function(a,c){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var b in c)c.hasOwnProperty(b)&&(a[b]=c[b])},r(a,c)},s=function(b){function c(a){var c=b.call(this,a)||this;return c.validateRequired(a.displayText),c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.modal.enableClose()},c}(q),t=function(b){function c(a){var c=b.call(this,a)||this,d=a.playerTarget,e=a.direction,f=a.numSpaces;return c.validateRequired(d,e,f),c.direction=e,c.numSpaces=f,c}return a(c,b),c.prototype.execute=function(){var a=this;b.prototype.execute.call(this),this.selectPlayers().then(function(b){var c=Math.max,d=b[0],e=c(0,d.currentTileIndex+a.numSpaces);d.moveToTile(e),d.currentPos=d.destinationPos,N.painter.drawPlayers(),N.modal.close()})},c}(q),u=function(b){function c(a){var c=b.call(this,a)||this,d=a.numTurns;return c.validateRequired(d),c.numTurns=d,c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.currentPlayer.skippedTurns+=this.numTurns,N.modal.enableClose()},c}(q),v=function(b){function c(a){var c=b.call(this,a)||this,d=a.multiplier,e=a.numTurns;return c.validateRequired(d,e),c.multiplier=d,c.numTurns=e,c}return a(c,b),c.prototype.execute=function(){var a=this;b.prototype.execute.call(this),this.selectPlayers().then(function(b){b.forEach(function(b){b.speedModifiers=[];for(var c=0;c<a.numTurns;c++)b.speedModifiers.push(a.multiplier)}),N.modal.enableClose()})},c}(q),w=function(b){function c(a){var c=b.call(this,a)||this,d=a.tileIndex;return c.validateRequired(d),c.tileIndex=d,c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.currentPlayer.moveToTile(this.tileIndex),N.currentPlayer.currentPos=N.currentPlayer.destinationPos,N.painter.drawPlayers(),N.modal.enableClose()},c}(q),x=function(b){function c(a){return b.call(this,a)||this}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.gameOver(),N.modal.enableClose()},c}(q),y=function(b){function c(a){return b.call(this,a)||this}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.currentPlayer.extraTurns++,N.modal.enableClose()},c}(q),z=function(b){function c(a){var c=b.call(this,a)||this;return c.diceRolls=a.diceRolls,c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.modal.requireDiceRolls(this.diceRolls.numRequired,function(a){N.currentPlayer.skippedTurns+=a[0],N.modal.enableClose()})},c}(q),A=function(b){function c(a){var c=b.call(this,a)||this,d=a.condition;return c.validateRequired(d),c.successes=new Map,c.condition=d,c}return a(c,b),c.prototype.execute=function(){var a=this;b.prototype.execute.call(this),this.selectPlayers().then(function(b){b.forEach(function(b){a.successes.set(b,0);var c=function(c){if(-1===a.condition.criteria.indexOf(c))return a.condition.numSuccessesRequired||(b.moveCondition=null,a.successes.delete(b)),!1;var d=a.successes.get(b);return a.successes.set(b,d+1),(!a.condition.numSuccessesRequired||a.successes.get(b)>=a.condition.numSuccessesRequired)&&(b.moveCondition=null,a.successes.delete(b),!0)};b.moveCondition=c,a.condition.immediate&&N.modal.requireDiceRolls(1,function(a){c(a[0])})}),console.log(a.playerTarget+" "+f.custom),a.playerTarget===f.custom?N.modal.close():N.modal.enableClose()})},c}(q),B=function(b){function d(a){var d=b.call(this,a)||this;return d.diceRolls=a.diceRolls,d.outcomeRules=[],d.diceRolls.outcomes&&d.diceRolls.outcomes.length&&d.diceRolls.outcomes.forEach(function(a){d.outcomeRules.push(c(a))}),d.diceRolls.any&&(d.any=c(d.diceRolls.any)),d}return a(d,b),d.prototype.getOutcomeForRolls=function(a){var b=this,c=null;if(!this.outcomeRules&&!this.any)return null;if(this.any)for(var d=0;d<a.length;d++)if(-1!==this.any.criteria.indexOf(a[d]))return this.any;return a.forEach(function(a){b.outcomeRules.forEach(function(b){b.criteria&&b.criteria.length&&-1!==b.criteria.indexOf(a)&&(c=b)})}),c},d.prototype.execute=function(){var a=this;b.prototype.execute.call(this),N.modal.requireDiceRolls(this.diceRolls.numRequired,function(b){var c=a.getOutcomeForRolls(b);c?c.execute():N.modal.enableClose()})},d}(q),C=function(b){function c(a){var c=b.call(this,a)||this;return c.validateRequired(a.displayText),c}return a(c,b),c.prototype.execute=function(){var a=this;b.prototype.execute.call(this);var c=function(){N.modal.requireDiceRolls(1,function(b){-1===a.criteria.indexOf(b[0])?c():N.modal.enableClose()})};c()},c}(q),D=function(b){function d(a){var d=b.call(this,a)||this,e=a.choices,f=a.diceRolls;return d.validateRequired(e),d.choiceRules=[],d.diceRolls=f,e&&e.length&&e.forEach(function(a){d.choiceRules.push(c(a))}),d}return a(d,b),d.prototype.execute=function(){b.prototype.execute.call(this),this.diceRolls&&N.modal.requireDiceRolls(this.diceRolls.numRequired,function(){}),N.modal.requireChoice(this.choiceRules).then(function(a){return a?void(console.log(a),a.execute()):void N.modal.enableClose()})},d}(q),E=function(b){function c(a){var c=b.call(this,a)||this;return c.validateRequired(a.numSpaces),c.numSpaces=a.numSpaces,c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),N.currentPlayer.mandatorySkips=this.numSpaces,N.modal.enableClose()},c}(q),F=function(b){function c(a){var c=b.call(this,a)||this;return c.playerTarget=f.custom,c}return a(c,b),c.prototype.execute=function(){b.prototype.execute.call(this),this.selectPlayers().then(function(a){var b=[a[0],N.currentPlayer];N.modal.requirePlayerSelection(b,"Who won?").then(function(a){var c=a[0],d=b.find(function(a){return a!==c});d.skippedTurns++,c.extraTurns++,N.modal.close()})})},c}(q),G={MoveRule:t,DisplayRule:s,TeleportRule:w,SkipTurnRule:u,SpeedModifierRule:v,GameOverRule:x,ExtraTurnRule:y,DrinkDuringLostTurnsRule:z,ApplyMoveConditionRule:A,DiceRollRule:B,RollUntilRule:C,ChoiceRule:D,SkipNextMandatoryRule:E,ChallengeRule:F},H=function(){return function(a,c){this.imgSrc=a.imgSrc,this.tiles=b(a.tiles),this.players=c}}(),I=12,J=function(){function a(a){this.name=a,this.extraTurns=0,this.skippedTurns=0,this.mandatorySkips=0,this.speedModifiers=[]}return a.prototype.canTakeTurn=function(){return!(0<this.skippedTurns)||(this.skippedTurns--,!1)},a.prototype.moveToTile=function(a){void 0===a&&(a=0),this.currentTileIndex=a,N.board.tiles[a].placePlayer(this),!this.currentPos&&this.destinationPos&&(this.currentPos=this.destinationPos)},a}(),K=function(){function a(a,b){this.canvas=a,this.ctx=b,p.on(i,this.draw.bind(this))}return a.prototype.draw=function(){var a=Math.sqrt,b=Math.abs;this.drawPlayers();var c=N.currentPlayer.currentPos.x,d=N.currentPlayer.currentPos.y,e=N.currentPlayer.destinationPos.x,f=N.currentPlayer.destinationPos.y,g=e-c,h=f-d;if(b(g)<I&&b(h)<I)return window.cancelAnimationFrame(this.raf),void p.trigger(j);var i=a(g*g+h*h),k=g/i*I,l=h/i*I;N.currentPlayer.currentPos.x+=k,N.currentPlayer.currentPos.y+=l,window.scrollBy(k,l),this.raf=window.requestAnimationFrame(this.draw.bind(this))},a.prototype.drawPlayers=function(){var a=Math.PI;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.font=20+"px \"Open Sans\"";for(var b,c=0;c<N.players.length;c++)b=N.players[c],this.ctx.fillStyle="rgba(0, 0, 0, 0.5)",this.ctx.beginPath(),this.ctx.arc(b.currentPos.x,b.currentPos.y,30,0,2*a,!0),this.ctx.closePath(),this.ctx.fill(),this.ctx.fillStyle="white",this.ctx.fillText(b.name[0].toUpperCase(),b.currentPos.x-6,b.currentPos.y+6)},a}(),L=function(){function a(){var a=this;this.triggerId="game-modal",this.trigger=document.querySelector("#"+this.triggerId),this.controls=Array.from(document.querySelectorAll("label[for=\"game-modal\"]")),this.header=document.querySelector(".modal h3"),this.content=document.querySelector(".modal .content"),this.trigger.addEventListener("change",function(){!1===a.trigger.checked&&a.closeCb&&(a.closeCb(),a.closeCb=null)})}return a.prototype.show=function(a){this.header.innerText=N.currentPlayer.name,this.content.innerText=a,this.trigger.checked=!0},a.prototype.close=function(){this.enableClose(),this.trigger.checked=!1,this.trigger.dispatchEvent(new Event("change"))},a.prototype.disableClose=function(){var a=this;this.controls.forEach(function(b){b.setAttribute("for",a.triggerId+"__DISABLED")})},a.prototype.enableClose=function(){var a=this;this.controls.forEach(function(b){b.setAttribute("for",a.triggerId)})},a.prototype.requireDiceRolls=function(a,b){for(var c=[],d=document.createDocumentFragment(),e=0;e<a;e++)d.appendChild(document.createElement("dice-roll"));this.content.appendChild(d),Array.from(this.content.querySelectorAll("dice-roll")).forEach(function(d){d.addEventListener("roll",function(d){c.push(d.detail.roll),c.length===a&&setTimeout(function(){b(c)},1e3)})})},a.prototype.requirePlayerSelection=function(a,b){if(void 0===b&&(b="Choose a player"),!a||0===a.length)return Promise.resolve([]);var c=this.addLinks(b,a.map(function(a){return a.name}));return new Promise(function(b){Array.from(c).forEach(function(c){c.addEventListener("click",function(c){c.preventDefault();var d=a.find(function(a){return a.name===c.currentTarget.dataset.name});return b([d]),!1})})})},a.prototype.requireChoice=function(a){if(!a||0===a.length)return Promise.resolve(null);var b=this.addLinks("Choose an outcome",a.map(function(a){return a.displayText}));return console.log(b),new Promise(function(c){Array.from(b).forEach(function(b){b.addEventListener("click",function(b){b.preventDefault();var d=a.find(function(a){return a.displayText===b.currentTarget.dataset.name});return c(d),!1})})})},a.prototype.addLinks=function(a,b){var c=[],d=document.createDocumentFragment(),e=document.createElement("h4");return e.innerText=a,d.appendChild(e),b.forEach(function(a){var b=document.createElement("a");b.classList.add("sm"),b.href="#",b.innerText=a,b.dataset.name=a,d.appendChild(b),d.appendChild(document.createTextNode("\xA0\xA0")),c.push(b)}),this.content.appendChild(d),c},a.prototype.whenClosed=function(a){this.closeCb=a},a}(),M=function(){function a(){return a.instance||(a.instance=this),p.on("TURN_START",this.startTurn.bind(this)),p.on(m,this.endTurn.bind(this)),p.on(g,this.enableDiceRoll.bind(this)),p.on(h,this.endDiceRoll.bind(this)),p.on(j,this.endMovement.bind(this)),p.on(k,this.triggerRule.bind(this)),p.on(l,this.endRule.bind(this)),a.instance}return a.prototype.start=function(a,b,c){var d=this;this.turnIndex=0,this.canvas=c,this.ctx=c.getContext("2d"),this.board=new H(a,this.players),this.players=b.map(function(a){return new J(a)}),this.diceLink=document.querySelector("#overlay dice-roll"),this.modal=new L,this.painter=new K(this.canvas,this.ctx),this.players.forEach(function(a){return a.moveToTile(0)}),this.playerTurns=this.players.slice(),this.painter.drawPlayers(),this.handleDiceRoll=this.handleDiceRoll.bind(this),document.querySelector("#skip a").addEventListener("click",function(a){return a.preventDefault(),d.diceLink.removeEventListener("roll",d.handleDiceRoll),p.trigger(m),!1}),p.trigger("TURN_START")},a.prototype.startTurn=function(){this.playerTurns.length||(this.playerTurns=this.players.slice()),this.currentPlayer=this.playerTurns.shift(),p.trigger(this.currentPlayer.canTakeTurn()?g:m),document.querySelector("#overlay h4").innerHTML=this.currentPlayer.name,window.scrollTo({top:this.currentPlayer.currentPos.y-window.outerHeight/2,left:this.currentPlayer.currentPos.x-window.outerWidth/2,behavior:"smooth"})},a.prototype.enableDiceRoll=function(a){this.diceLink.reset(),this.diceLink.addEventListener("roll",this.handleDiceRoll),a()},a.prototype.handleDiceRoll=function(a){var b=a.detail.roll;p.trigger(h,[b]),this.diceLink.removeEventListener("roll",this.handleDiceRoll)},a.prototype.endDiceRoll=function(a,b){var c=Math.ceil;if(this.currentPlayer.moveCondition){var d=this.currentPlayer.moveCondition(b);if(!d)return setTimeout(function(){p.trigger(m)},2e3),void a()}if(this.currentPlayer.speedModifiers.length){var e=this.currentPlayer.speedModifiers.shift();b=c(e*b)}var f=this.board.tiles.slice(this.currentPlayer.currentTileIndex+1,this.currentPlayer.currentTileIndex+1+b).findIndex(function(a){return a.isMandatory});0<this.currentPlayer.mandatorySkips&&-1!==f&&(this.currentPlayer.mandatorySkips--,f=-1);var g=-1===f?b:f+1;0<g&&(this.currentPlayer.moveToTile(this.currentPlayer.currentTileIndex+g),p.trigger(i)),a()},a.prototype.endMovement=function(){p.trigger(k)},a.prototype.triggerRule=function(a){var b=this.board.tiles[this.currentPlayer.currentTileIndex],c=b.rule;c.execute(),a()},a.prototype.endRule=function(a){a(),p.trigger(m)},a.prototype.endTurn=function(a){this.turnIndex++,0<this.currentPlayer.extraTurns&&(this.currentPlayer.extraTurns--,this.playerTurns.unshift(this.currentPlayer)),p.trigger("TURN_START"),a()},a.prototype.gameOver=function(){alert("Game over!\n\n Winner: "+this.currentPlayer.name)},a.prototype.getInactivePlayers=function(){var a=this;return this.players.filter(function(b){return b!==a.currentPlayer})},a}(),N=new M;(function(){function a(a,b){return new Promise(function(c){var d=new Image;d.src=a,d.addEventListener("load",function(){b.width=d.width,b.height=d.height,b.style.background="url("+a+")",b.style.backgroundSize="100% 100%",c()})})}function b(a){return new Promise(function(b){fetch(a).then(function(a){return a.json()}).then(function(a){return b(a)})})}function c(){var a=document.getElementById("game").value,b=Array.from(document.querySelectorAll("#player-input input")).filter(function(a){return!!a.value}).map(function(a){return a.value});return[a,b]}function d(c,d){var e=document.getElementById("canvas");Promise.all([a(c+"/index.png",e),b(c+"/index.json")]).then(function(a){N.start(a[1],d,e)}).catch(function(a){return console.error(a)})}document.getElementById("add-player").addEventListener("click",function(a){a.preventDefault();var b=document.createDocumentFragment(),c=document.createElement("input");return c.type="text",b.appendChild(c),document.getElementById("player-input").appendChild(b),!1}),document.getElementById("setup").addEventListener("submit",function(a){a.preventDefault();var b=c();return b[1].length?new Set(b[1]).size<b[1].length?void alert("Player names must be unique"):void(d(b[0],b[1]),document.getElementById("setup").style.display="none",document.getElementById("overlay").style.display="block"):void alert("You need players to play this game")})})()})();