import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit-labs/task";

import { Comment } from "../types";

@customElement('fedi-action-bar')
export class FediActionBar extends LitElement {
  static styles = css``;

  @property()
  src!: string;

  private _commentTask = new Task(
    this,
    ([src]) =>
      fetch(src).then((response) =>
        response.json() as Promise<Comment>
      ),
    () => [this.src],
  );

  render() {
    return this._commentTask.render({
      pending: () => html`<div>Loading...</div>`,
      complete: (comment) => html`<div>
        <sl-icon-button name="gear" label="Settings" href="https://example.com" target="_blank"><sl-badge pill>30</sl-badge></sl-icon-button>
        <sl-badge pill>30</sl-badge>
        <sl-icon-button name="gear" label="Settings" href="https://example.com" target="_blank"></sl-icon-button>
        <sl-icon-button name="gear" label="Settings" href="https://example.com" target="_blank"></sl-icon-button>
        <!-- <div>${comment.replies_count}</div>
        <div>${comment.reblogs_count}</div>
        <div>${comment.favourites_count}</div> -->
      </div>`,
      error: () => html`<div>Could not load action bar.</div>`
    });
  }
}
