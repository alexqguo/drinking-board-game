import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  render() {
    return html`
      <p>hello world</p>
    `;
  }
};

window.customElements.define('my-element', MyElement);