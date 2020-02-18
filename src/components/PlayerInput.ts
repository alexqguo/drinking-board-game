import { LitElement, html, customElement, property } from 'lit-element';

const invalidChars: RegExp = new RegExp(/#|\$|\.|\/|\[|\]/);

@customElement('player-input')
export default class PlayerInput extends LitElement {

  @property({ type: Boolean })
  valid: boolean = null;

  createRenderRoot() {
    return this;
  }

  handleChange(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    this.valid = !!target.value && target.value.match(invalidChars) === null;
  }

  render() {
    // The inputs inexplicably have to be wrapped in a <span> otherwise the grid 
    // won't work properly. Thanks Picnic
    return html`
      <div class="flex">
        <span>
          <input @input="${this.handleChange}" data-valid="${this.valid}"
            class="three" type="text" placeholder="Name">
        </span>
        <span><input class="one" type="color" value="#aabbcc"></span>
      </div>
    `;
  }
}