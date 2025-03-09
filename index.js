const render = (x) => `
  <div part="header" class="header">
    <h3 part="greeting">${x.greeting.toUpperCase()}</h3>
    <h4 part="message">${messageText}</h4>
  </div>

  <div part="body" class="body">
    <slot></slot>
  </div>

  <div part="footer" class="footer"></div>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    --default-color: purple;
    --default-radius: 5px;
    --default-depth: 4px;

    display: inline-block;
    contain: content;
    color: white;
    text-align: center;
    background: var(--color, var(--default-color));
    border-radius: var(--radius, var(--default-radius));
    min-width: 330px;
    box-shadow: 0 0 var(--depth, var(--default-depth)) rgba(0,0,0,.5);
  }

  .header {
    margin: 14px 0;
  }

  h3 {
    font-family: system-ui;
    font-weight: bold;
    font-size: 34px;
    letter-spacing: 4px;
    padding: 0;
    margin: 0;
  }

  h4 {
    font-family: system-ui;
    font-size: 20px;
    padding: 0;
    margin: 0;
  }

  .body {
    font-family: cursive;
    font-size: 42px;
    color: black;
    background: white;
    padding: 32px 8px;
  }

  .footer {
    background: var(--color, var(--default-color));
    height: 16px;
    border-radius: 0 0 var(--radius, var(--default-radius)) var(--radius, var(--default-radius));
  }
`);

class NameTag extends HTMLElement {
  static get observedAttributes() {
    return ["greeting", "language"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      styles,
    ];
  }

  get greeting() {
    return this.getAttribute("greeting");
  }

  set greeting(value) {
    this.setAttribute("greeting", value);
  }

  get language() {
    return this.getAttribute("language");
  }

  set language(value) {
    this.setAttribute("language", value);
  }

  connectedCallback() {
    if (!this.greeting) {
      this.greeting = "Hello";
    }
    if (!this.language) {
      this.language = "en";
    }
    this.updateGreeting();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "greeting" || name === "language") {
      this.updateGreeting();
    }
  }

  updateGreeting() {
    let greetingText, messageText, spacing;
    if (this.language === "sv") {
      greetingText = "Hej";
      messageText = "heter jag";
      spacing = "1px";
    } else if (this.language === "ar") {
      greetingText = "مرحبا";
      messageText = "اسمي";
      spacing = "2px";
    } else {
      greetingText = "Hello";
      messageText = "my name is";
      spacing = "4px";
    }
    this.shadowRoot.innerHTML = `
      <div part="header" class="header">
        <h3 part="greeting" style="letter-spacing: ${spacing};">${greetingText.toUpperCase()}</h3>
        <h4 part="message" style="letter-spacing: ${spacing};">${messageText}</h4>
      </div>
      <div part="body" class="body">
        <slot></slot>
      </div>
      <div part="footer" class="footer"></div>
    `;
  }
}

customElements.define("name-tag", NameTag);

document.addEventListener("DOMContentLoaded", () => {
  const nameTag = document.querySelector("name-tag");
  const nameInput = document.getElementById("nameInput");
  const changeNameButton = document.getElementById("changeNameButton");
  const languageSelector = document.getElementById("languageSelector");

  changeNameButton.addEventListener("click", () => {
    nameTag.textContent = nameInput.value;
  });

  languageSelector.addEventListener("change", () => {
    nameTag.language = languageSelector.value;
  });

  nameTag.language = languageSelector.value;
  nameTag.textContent = nameInput.value;
});
