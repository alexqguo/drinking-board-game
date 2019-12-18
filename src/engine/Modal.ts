import Game from './Game';
import Player from './Player';
import { Rule } from '../rules';
import { Action } from '../firebase/constants';
import DiceRoll from '../components/DiceRoll';

const ACTIONABLE: string = 'actionable';

// TODO: make this a wrapper/interface to a wc, or just make it a wc completely
export class Modal {
  triggerId: string;
  trigger: HTMLInputElement;
  controls: HTMLLabelElement[];
  header: HTMLHeadingElement;
  content: HTMLElement;
  closeCb: Function;
  observer: MutationObserver;

  constructor() {
    this.triggerId = 'game-modal';
    this.trigger = document.querySelector(`#${this.triggerId}`);
    this.controls = Array.from(document.querySelectorAll('label[for="game-modal"]'));
    this.header = document.querySelector('.modal h3');
    this.content = document.querySelector('.modal .content');

    this.trigger.addEventListener('change', (e: Event) => {
      if (this.trigger.checked === false && this.closeCb) {
        const cb = this.closeCb;
        this.closeCb = null;
        // Have to do it this way because the callback can trigger events which reset the closeCb
        // Short term fix, this entire thing will be refactored soon anyway (I hope)
        cb();
      }
    });

    // TODO: the observer can probably be optimized to look for only certain types of nodes
    const mutationConfig = { childList: true, subtree: true }
    const mutationCallback: MutationCallback = (mutationList: MutationRecord[]) => {
      for (let mutation of mutationList) {
        if (mutation.type === 'childList') {
          const validEls: Node[] = Array.from(mutation.addedNodes).filter((n: HTMLElement) => {
            return n && n.classList && n.classList.contains(ACTIONABLE);
          })

          if (validEls.length) {
            validEls.forEach((el: HTMLElement) => {
              const action: Action = Game.actionManager.createAction(
                (el as DiceRoll).rollText || el.innerText, Game.id, Game.currentPlayer, () => {
                  el.click();
              });
              el.addEventListener('click', () => {
                Game.actionManager.remove(action);
              });
            });
          }
        }
      }
    };
    this.observer = new MutationObserver(mutationCallback);
    this.observer.observe(this.content, mutationConfig);
    /**
     * TODO: add a mutation observer here
     * - any time an element with a particular class is added within this modal, tell firebase about it
     * - if we get a response from firebase, trigger a click on that element
     * - when the modal becomes closeable, have an action for that too
     * - clear the available actions when the modal closes 
     */
  }

  show(displayText: string): void {
    this.header.innerText = Game.currentPlayer.name;
    this.content.innerText = displayText;
    this.trigger.checked = true;
  }

  clearContent(): void {
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }
  }

  // This is what should be used going forward
  openWithFragment(headerText: string, frag: DocumentFragment): void {
    this.header.innerText = headerText;
    this.clearContent();
    this.content.appendChild(frag);
    this.trigger.checked = true;
  }

  close(): void {
    this.enableClose();
    this.trigger.checked = false;
    this.trigger.dispatchEvent(new Event('change'));
    this.clearContent();
    Game.actionManager.clear();
  }

  disableClose(): void {
    this.controls.forEach((control: HTMLLabelElement) => {
      control.setAttribute('for', `${this.triggerId}__DISABLED`);
    });
  }

  enableClose(): void {
    this.controls.forEach((control: HTMLLabelElement) => {
      control.setAttribute('for', this.triggerId);
    });
  }

  // TODO: change to promise in case a rule needs more than one player action
  requireDiceRolls(n: number, cb: Function): void {
    const rolls: number[] = [];
    const frag: DocumentFragment = document.createDocumentFragment();

    for (let i = 0; i < n; i++) {
      const diceRollElement: HTMLElement = document.createElement('dice-roll');
      diceRollElement.classList.add(ACTIONABLE);
      frag.appendChild(diceRollElement);
    }
    this.content.appendChild(frag);

    Array.from(this.content.querySelectorAll('dice-roll')).forEach((el: HTMLElement) => {
      el.addEventListener('roll', (e: CustomEvent) => {
        rolls.push(e.detail.roll);
        
        if (rolls.length === n) {
          // Wait one second before doing anything so the user has time to understand what happened
          setTimeout(() => { cb(rolls) }, 1000);
        }
      });
    });
  }

  // Implement number of players user can choose?
  requirePlayerSelection(playerList: Player[], headerString: string = 'Choose a player'): Promise<Player[]> {
    if (!playerList || playerList.length === 0) return Promise.resolve([]);

    const links = this.addLinks(headerString, playerList.map(p => p.name));

    return new Promise((resolve) => {
      Array.from(links).forEach((el: HTMLElement) => {
        el.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const selectedPlayer = playerList.find((p: Player) =>  {
            return p.name === (e.currentTarget as HTMLElement).dataset.name
          });
          resolve([selectedPlayer]);
          return false;
        });
      });
    });
  }

  requireChoice(rules: Rule[]): Promise<Rule> {
    if (!rules || rules.length === 0) return Promise.resolve(null);

    const links = this.addLinks('Choose an outcome', rules.map(r => r.displayText));

    return new Promise((resolve) => {
      Array.from(links).forEach((el: HTMLElement) => {
        el.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const selectedRule = rules.find((r: Rule) => {
            return r.displayText === (e.currentTarget as HTMLElement).dataset.name
          });
          resolve(selectedRule);
          return false;
        });
      });
    });
  }

  /**
   * Prompts for a simple yes/no question.
   * Consider expanding in the future for multiple choice
   */
  async requirePrompt(prompt: string): Promise<boolean> {
    const options: Map<string, boolean> = new Map([['Yes', true], ['No', false]]);
    const links: HTMLAnchorElement[] = this.addLinks(prompt, Array.from(options.keys()));
    return new Promise((resolve) => {
      links.forEach((el: HTMLAnchorElement) => {
        el.addEventListener('click', (e: Event) => {
          e.preventDefault();
          const selectedOption: string = (e.currentTarget as HTMLElement).dataset.name;
          const returnValue: boolean = options.get(selectedOption);
          resolve(returnValue);
          this.close();
          return false;
        });
      });
    });
  }

  addLinks(headerText: string, descriptions: string[]): HTMLAnchorElement[] {
    const links: HTMLAnchorElement[] = [];
    const frag: DocumentFragment = document.createDocumentFragment();
    const header: HTMLHeadingElement = document.createElement('h4');
    header.innerText = headerText;
    frag.appendChild(header);

    descriptions.forEach((desc: string) => {
      const playerLink: HTMLAnchorElement = document.createElement('a');
      playerLink.classList.add('sm');
      playerLink.classList.add(ACTIONABLE);
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

  whenClosed(cb: Function): void {
    if (!this.closeCb) this.closeCb = cb;
  }
}
