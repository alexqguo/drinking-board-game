!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self)["pokemon-gen1"]={})}(this,function(e){"use strict";function t(e,t,s,n){var i,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,s):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,n);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(r=(o<3?i(r):o>3?i(t,s,r):i(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r}const s=new WeakMap,n=e=>"function"==typeof e&&s.has(e),i=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,o=(e,t,s=null)=>{for(;t!==s;){const s=t.nextSibling;e.removeChild(t),t=s}},r={},a={},l=`{{lit-${String(Math.random()).slice(2)}}}`,c=`\x3c!--${l}--\x3e`,h=new RegExp(`${l}|${c}`),d="$lit$";class p{constructor(e,t){this.parts=[],this.element=t;const s=[],n=[],i=document.createTreeWalker(t.content,133,null,!1);let o=0,r=-1,a=0;const{strings:c,values:{length:p}}=e;for(;a<p;){const e=i.nextNode();if(null!==e){if(r++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:s}=t;let n=0;for(let e=0;e<s;e++)u(t[e].name,d)&&n++;for(;n-- >0;){const t=c[a],s=f.exec(t)[2],n=s.toLowerCase()+d,i=e.getAttribute(n);e.removeAttribute(n);const o=i.split(h);this.parts.push({type:"attribute",index:r,name:s,strings:o}),a+=o.length-1}}"TEMPLATE"===e.tagName&&(n.push(e),i.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(l)>=0){const n=e.parentNode,i=t.split(h),o=i.length-1;for(let t=0;t<o;t++){let s,o=i[t];if(""===o)s=_();else{const e=f.exec(o);null!==e&&u(e[2],d)&&(o=o.slice(0,e.index)+e[1]+e[2].slice(0,-d.length)+e[3]),s=document.createTextNode(o)}n.insertBefore(s,e),this.parts.push({type:"node",index:++r})}""===i[o]?(n.insertBefore(_(),e),s.push(e)):e.data=i[o],a+=o}}else if(8===e.nodeType)if(e.data===l){const t=e.parentNode;null!==e.previousSibling&&r!==o||(r++,t.insertBefore(_(),e)),o=r,this.parts.push({type:"node",index:r}),null===e.nextSibling?e.data="":(s.push(e),r--),a++}else{let t=-1;for(;-1!==(t=e.data.indexOf(l,t+1));)this.parts.push({type:"node",index:-1}),a++}}else i.currentNode=n.pop()}for(const e of s)e.parentNode.removeChild(e)}}const u=(e,t)=>{const s=e.length-t.length;return s>=0&&e.slice(s)===t},m=e=>-1!==e.index,_=()=>document.createComment(""),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class y{constructor(e,t,s){this.__parts=[],this.template=e,this.processor=t,this.options=s}update(e){let t=0;for(const s of this.__parts)void 0!==s&&s.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=i?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],s=this.template.parts,n=document.createTreeWalker(e,133,null,!1);let o,r=0,a=0,l=n.nextNode();for(;r<s.length;)if(o=s[r],m(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(t.push(l),n.currentNode=l.content),null===(l=n.nextNode())&&(n.currentNode=t.pop(),l=n.nextNode());if("node"===o.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(l.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return i&&(document.adoptNode(e),customElements.upgrade(e)),e}}const g=` ${l} `;class v{constructor(e,t,s,n){this.strings=e,this.values=t,this.type=s,this.processor=n}getHTML(){const e=this.strings.length-1;let t="",s=!1;for(let n=0;n<e;n++){const e=this.strings[n],i=e.lastIndexOf("\x3c!--");s=(i>-1||s)&&-1===e.indexOf("--\x3e",i+1);const o=f.exec(e);t+=null===o?e+(s?g:c):e.substr(0,o.index)+o[1]+o[2]+d+o[3]+l}return t+=this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}const S=e=>null===e||!("object"==typeof e||"function"==typeof e),w=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class b{constructor(e,t,s){this.dirty=!0,this.element=e,this.name=t,this.strings=s,this.parts=[];for(let e=0;e<s.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new P(this)}_getValue(){const e=this.strings,t=e.length-1;let s="";for(let n=0;n<t;n++){s+=e[n];const t=this.parts[n];if(void 0!==t){const e=t.value;if(S(e)||!w(e))s+="string"==typeof e?e:String(e);else for(const t of e)s+="string"==typeof t?t:String(t)}}return s+=e[t]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class P{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===r||S(e)&&e===this.value||(this.value=e,n(e)||(this.committer.dirty=!0))}commit(){for(;n(this.value);){const e=this.value;this.value=r,e(this)}this.value!==r&&this.committer.commit()}}class x{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(_()),this.endNode=e.appendChild(_())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=_()),e.__insert(this.endNode=_())}insertAfterPart(e){e.__insert(this.startNode=_()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}const e=this.__pendingValue;e!==r&&(S(e)?e!==this.value&&this.__commitText(e):e instanceof v?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):w(e)?this.__commitIterable(e):e===a?(this.value=a,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,s="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=s:this.__commitNode(document.createTextNode(s)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof y&&this.value.template===t)this.value.update(e.values);else{const s=new y(t,e.processor,this.options),n=s._clone();s.update(e.values),this.__commitNode(n),this.value=s}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let s,n=0;for(const i of e)void 0===(s=t[n])&&(s=new x(this.options),t.push(s),0===n?s.appendIntoPart(this):s.insertAfterPart(t[n-1])),s.setValue(i),s.commit(),n++;n<t.length&&(t.length=n,this.clear(s&&s.endNode))}clear(e=this.startNode){o(this.startNode.parentNode,e.nextSibling,this.endNode)}}class N{constructor(e,t,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=s}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}if(this.__pendingValue===r)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=r}}class C extends b{constructor(e,t,s){super(e,t,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new k(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class k extends P{}let E=!1;try{const e={get capture(){return E=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class A{constructor(e,t,s){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=s,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;n(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=r,e(this)}if(this.__pendingValue===r)return;const e=this.__pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),i=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=T(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=r}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const T=e=>e&&(E?{capture:e.capture,passive:e.passive,once:e.once}:e.capture);const V=new class{handleAttributeExpressions(e,t,s,n){const i=t[0];if("."===i){return new C(e,t.slice(1),s).parts}return"@"===i?[new A(e,t.slice(1),n.eventContext)]:"?"===i?[new N(e,t.slice(1),s)]:new b(e,t,s).parts}handleTextExpression(e){return new x(e)}};function O(e){let t=R.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},R.set(e.type,t));let s=t.stringsArray.get(e.strings);if(void 0!==s)return s;const n=e.strings.join(l);return void 0===(s=t.keyString.get(n))&&(s=new p(e,e.getTemplateElement()),t.keyString.set(n,s)),t.stringsArray.set(e.strings,s),s}const R=new Map,M=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const U=(e,...t)=>new v(e,t,"html",V),j=133;function $(e,t){const{element:{content:s},parts:n}=e,i=document.createTreeWalker(s,j,null,!1);let o=z(n),r=n[o],a=-1,l=0;const c=[];let h=null;for(;i.nextNode();){a++;const e=i.currentNode;for(e.previousSibling===h&&(h=null),t.has(e)&&(c.push(e),null===h&&(h=e)),null!==h&&l++;void 0!==r&&r.index===a;)r.index=null!==h?-1:r.index-l,r=n[o=z(n,o)]}c.forEach(e=>e.parentNode.removeChild(e))}const q=e=>{let t=11===e.nodeType?0:1;const s=document.createTreeWalker(e,j,null,!1);for(;s.nextNode();)t++;return t},z=(e,t=-1)=>{for(let s=t+1;s<e.length;s++){const t=e[s];if(m(t))return s}return-1};const F=(e,t)=>`${e}--${t}`;let B=!0;void 0===window.ShadyCSS?B=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),B=!1);const I=e=>t=>{const s=F(t.type,e);let n=R.get(s);void 0===n&&(n={stringsArray:new WeakMap,keyString:new Map},R.set(s,n));let i=n.stringsArray.get(t.strings);if(void 0!==i)return i;const o=t.strings.join(l);if(void 0===(i=n.keyString.get(o))){const s=t.getTemplateElement();B&&window.ShadyCSS.prepareTemplateDom(s,e),i=new p(t,s),n.keyString.set(o,i)}return n.stringsArray.set(t.strings,i),i},L=["html","svg"],H=new Set,W=(e,t,s)=>{H.add(e);const n=s?s.element:document.createElement("template"),i=t.querySelectorAll("style"),{length:o}=i;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(n,e);const r=document.createElement("style");for(let e=0;e<o;e++){const t=i[e];t.parentNode.removeChild(t),r.textContent+=t.textContent}(e=>{L.forEach(t=>{const s=R.get(F(t,e));void 0!==s&&s.keyString.forEach(e=>{const{element:{content:t}}=e,s=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{s.add(e)}),$(e,s)})})})(e);const a=n.content;s?function(e,t,s=null){const{element:{content:n},parts:i}=e;if(null==s)return void n.appendChild(t);const o=document.createTreeWalker(n,j,null,!1);let r=z(i),a=0,l=-1;for(;o.nextNode();){for(l++,o.currentNode===s&&(a=q(t),s.parentNode.insertBefore(t,s));-1!==r&&i[r].index===l;){if(a>0){for(;-1!==r;)i[r].index+=a,r=z(i,r);return}r=z(i,r)}}}(s,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(n,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(s){a.insertBefore(r,a.firstChild);const e=new Set;e.add(r),$(s,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const D={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},J=(e,t)=>t!==e&&(t==t||e==e),G={attribute:!0,type:String,converter:D,reflect:!1,hasChanged:J},K=Promise.resolve(!0),Q=1,X=4,Y=8,Z=16,ee=32,te="finalized";class se extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=K,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,s)=>{const n=this._attributeNameForProperty(s,t);void 0!==n&&(this._attributeToPropertyMap.set(n,s),e.push(n))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=G){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const s="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[s]},set(t){const n=this[e];this[s]=t,this._requestUpdate(e,n)},configurable:!0,enumerable:!0})}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty(te)||e.finalize(),this[te]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const s of t)this.createProperty(s,e[s])}}static _attributeNameForProperty(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,s=J){return s(e,t)}static _propertyValueFromAttribute(e,t){const s=t.type,n=t.converter||D,i="function"==typeof n?n:n.fromAttribute;return i?i(e,s):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const s=t.type,n=t.converter;return(n&&n.toAttribute||D.toAttribute)(e,s)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|ee,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,s){t!==s&&this._attributeToProperty(e,s)}_propertyToAttribute(e,t,s=G){const n=this.constructor,i=n._attributeNameForProperty(e,s);if(void 0!==i){const e=n._propertyValueToAttribute(t,s);if(void 0===e)return;this._updateState=this._updateState|Y,null==e?this.removeAttribute(i):this.setAttribute(i,e),this._updateState=this._updateState&~Y}}_attributeToProperty(e,t){if(this._updateState&Y)return;const s=this.constructor,n=s._attributeToPropertyMap.get(e);if(void 0!==n){const e=s._classProperties.get(n)||G;this._updateState=this._updateState|Z,this[n]=s._propertyValueFromAttribute(t,e),this._updateState=this._updateState&~Z}}_requestUpdate(e,t){let s=!0;if(void 0!==e){const n=this.constructor,i=n._classProperties.get(e)||G;n._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==i.reflect||this._updateState&Z||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):s=!1}!this._hasRequestedUpdate&&s&&this._enqueueUpdate()}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){let e,t;this._updateState=this._updateState|X;const s=this._updatePromise;this._updatePromise=new Promise((s,n)=>{e=s,t=n});try{await s}catch(e){}this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);try{const e=this.performUpdate();null!=e&&await e}catch(e){t(e)}e(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&ee}get _hasRequestedUpdate(){return this._updateState&X}get hasUpdated(){return this._updateState&Q}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{(e=this.shouldUpdate(t))&&this.update(t)}catch(t){throw e=!1,t}finally{this._markUpdated()}e&&(this._updateState&Q||(this._updateState=this._updateState|Q,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~X}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}se[te]=!0;const ne=(e,t)=>"method"!==t.kind||!t.descriptor||"value"in t.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}}:Object.assign({},t,{finisher(s){s.createProperty(t.key,e)}}),ie=(e,t,s)=>{t.constructor.createProperty(s,e)};function oe(e){return(t,s)=>void 0!==s?ie(e,t,s):ne(e,t)}const re="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const ae=e=>e.flat?e.flat(1/0):function e(t,s=[]){for(let n=0,i=t.length;n<i;n++){const i=t[n];Array.isArray(i)?e(i,s):s.push(i)}return s}(e);class le extends se{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){ae(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?re?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof v&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}le.finalized=!0,le.render=(e,t,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const n=s.scopeName,i=M.has(t),r=B&&11===t.nodeType&&!!t.host,a=r&&!H.has(n),l=a?document.createDocumentFragment():t;if(((e,t,s)=>{let n=M.get(t);void 0===n&&(o(t,t.firstChild),M.set(t,n=new x(Object.assign({templateFactory:O},s))),n.appendInto(t)),n.setValue(e),n.commit()})(e,l,Object.assign({templateFactory:I(n)},s)),a){const e=M.get(l);M.delete(l);const s=e.value instanceof y?e.value.template:void 0;W(n,l,s),o(t,t.firstChild),t.appendChild(l),M.set(t,e)}!i&&r&&window.ShadyCSS.styleElement(t.host)},e.PokemonSelector=class extends le{constructor(){super(),this.selectedPokemon={}}createRenderRoot(){return this}renderPlayerSelection(e){return U`
      <label for="pokemon-select-${e}">${e}</label>
      <select @change="${this.handleSelect}" id="pokemon-select-${e}" data-player-name="${e}">
        <option value="" selected disabled hidden>Choose your Pokemon!</option>
        <option value="charmander">Charmander</option>
        <option value="squirtle">Squirtle</option>
        <option value="bulbasaur">Bulbasaur</option>
      </select>

      <br><br>
    `}handleSelect(e){const t=e.currentTarget.dataset.playerName,s=e.currentTarget.value;this.selectedPokemon[t]=s,Object.keys(this.selectedPokemon).length===this.playerNames.length&&(this.canSubmit=!0)}handleDone(){const e=this.playerNames.map(e=>this.selectedPokemon[e]),t=new CustomEvent("pokemon-selected",{detail:{pokemon:e}});this.dispatchEvent(t)}render(){return U`
      <div style="font-size: 1rem">
        ${this.playerNames.map(e=>this.renderPlayerSelection(e))}

        <button @click="${this.handleDone}" ?disabled="${!this.canSubmit}">Done</button>
      </div>
    `}},t([oe({type:Array})],e.PokemonSelector.prototype,"playerNames",void 0),t([oe({type:Boolean})],e.PokemonSelector.prototype,"canSubmit",void 0),e.PokemonSelector=t([(e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:s,elements:n}=t;return{kind:s,elements:n,finisher(t){window.customElements.define(e,t)}}})(e,t))("pokemon-selector")],e.PokemonSelector);const ce=window;if(ce.drinking){const{Game:e,GameEvents:t,events:s}=ce.drinking;t.on(s.GAME_START,t=>{const s=document.createDocumentFragment(),n=document.createElement("pokemon-selector"),i=e.players.map(e=>e.name);n.setAttribute("playerNames",JSON.stringify(i)),n.addEventListener("pokemon-selected",s=>{s.detail.pokemon.forEach((t,s)=>{e.players[s].custom.pokemon=t}),e.modal.close(),t()}),s.appendChild(n),e.modal.openWithFragment("Choose your Pokemon!",s),e.modal.disableClose()}),t.on(s.MOVE_END,t=>{4===e.currentPlayer.currentTileIndex&&(e.currentPlayer.custom.pokemon="pikachu"),console.log("Check if players are on the same space (and it's not a gym"),t()})}Object.defineProperty(e,"__esModule",{value:!0})});