import { LitElement, html, customElement, property } from 'lit-element';

@customElement('game-modal')
export default class GameModal extends LitElement {

  createRenderRoot() {
    return this;
  }

  /*
    show()
    clearContent()
    openWithFragment()
    close()
    disableClose()
    enableClose()
    requireDiceRolls()
    requirePlayerSelection()
    requireChoice()
    addLinks()
    whenClosed()
  */

  render() {
    return html`
      hello
    `;
  }
}