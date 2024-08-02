import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { Task } from "@lit-labs/task";

@customElement("social-card")
export class SocialCard extends LitElement {
  static styles = css`
    :host {
      width: max-content;
      max-width: 400px;
      position: absolute;
      top: 0;
      left: 0;
      border: 1px solid black;
      padding: .75rem;
      border-radius: 4px;
      background-color: white;
      box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
    }

    p {
      font-size: .9rem;
    }
  `;

  @property()
  account: string =
    "https://fosstodon.org/api/v1/accounts/109261310238319019";

  @property({
    type: Number,
  })
  showDelay: number = 500;

  @property({
    type: Number,
  })
  hideDelay: number = 500;

  private _accountTask = new Task(
    this,
    ([src]) => fetch(src).then((response) => response.json() as Promise<any>),
    () => [this.account],
  );

  private mouseEnterTimer!: NodeJS.Timeout;
  private mouseLeaveTimer!: NodeJS.Timeout;

  show(target?: HTMLAnchorElement) {
    if (target) {
      this.account = target.href + ".json";
    }

    clearTimeout(this.mouseLeaveTimer);
    this.mouseEnterTimer = setTimeout(() => {
      if (this.hidden && target) {
        computePosition(target, this, {
          placement: "bottom",
          middleware: [offset(6), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) => {
          Object.assign(this.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      }
      this.hidden = false;
    }, this.showDelay);
  }

  hide() {
    clearTimeout(this.mouseEnterTimer);
    this.mouseLeaveTimer = setTimeout(() => {
      this.hidden = true;
    }, this.hideDelay);
  }

  render() {
    return this._accountTask.render({
      pending: () => html`<div>Loading...</div>`,
      complete: (account) =>
        html`<div>
        ${account.name}
        <p .innerHTML=${account.summary}></p>
      </div>`,
      error: () => html`<div>Error!</div>`,
    });
  }
}

export const initOverlay = (hostEl: Element = document.body) => {
  const overlay = new SocialCard();
  overlay.hidden = true;
  document.body.append(overlay);
  hostEl.addEventListener("mouseenter", (ev) => {
    const target = ev.target as Element;
    if (!target || !target.classList.contains("u-url")) {
      return;
    }
    ev.stopPropagation();
    target.addEventListener("mouseleave", () => {
      overlay.hide();
    });
    overlay.show(target as HTMLAnchorElement);
  }, true);

  overlay.addEventListener("mouseenter", () => overlay.show());
  overlay.addEventListener("mouseleave", () => overlay.hide());
};

declare global {
  interface HTMLElementTagNameMap {
    "social-card-base": SocialCard;
  }
}
