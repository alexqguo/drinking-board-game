import { LitElement, html, customElement } from 'lit-element';

@customElement('player-input')
export class PlayerInput extends LitElement {

  createRenderRoot() {
    return this;
  }

  render() {
    // The inputs inexplicably have to be wrapped in a <span> otherwise the grid 
    // won't work properly. Thanks Picnic
    return html`
      <div class="flex">
        <span><input class="three" type="text" placeholder="Name"></span>
        <span><input class="one" type="color" value="#aabbcc"></span>
      </div>
    `;
  }
}