import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit-labs/task";
import { repeat } from "lit/directives/repeat.js";
import type { Comment, CommentsResponse } from "../types";

import "./fedi-action-bar";

@customElement("fedi-chat")
export class FediChat extends LitElement {
  static styles = css`
    :host {
      --border-color: none;
      --border-width: 1px;
      --border-radius: 8px;
      --background-color: white;
    }

    article {
      display: block;

      margin-top: 1em;
      margin-bottom: 1em;

      border-style: solid;
      border-width: var(--border-width);
      border-color: var(--border-color);
      border-radius: var(--border-radius);

      background-color: var(--background-color);
      
      max-width: 400px;
      min-width: 250px;
      padding: 1em;
      padding-bottom: 0;
    }

    .content {
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;  
    }

    .content > p {
      margin-top: 0;
      margin-bottom: 0;
    }

    .author {
      font-weight: bold;
    }
  `;

  @property()
  src!: string;

  private _commentsTask = new Task(
    this,
    ([src]) =>
      fetch(src).then((response) =>
        response.json() as Promise<CommentsResponse>
      ),
    () => [this.src],
  );

  renderComment(comment: Comment) {
    return html`<article class="comment">
      <div class="author">
        <sl-avatar label="User avatar"></sl-avatar>
        ${comment.account.display_name}
      </div>
      <div class="content" .innerHTML=${comment.content}></div>
    </article>`;
  }

  render() {
    if (!this.src) {
      return html`Make sure you provided the link to a host comment in the "src" field. `;
    }
    return this._commentsTask.render({
      pending: () => html`Loading comments...`,
      complete: (comments) =>
        html`
        <slot name="header">
          <div id="default-header">
            <small>Comments provided by Fedichat. Join the conversation on Mastodon.</small>
            <!-- <fedi-action-bar src="https://fosstodon.org/api/v1/statuses/109285848751638736"></fedi-action-bar> -->
          </div>
        </slot>
        ${
          repeat(
            comments.descendants,
            (comment) => comment.id,
            this.renderComment.bind(this),
          )
        }
      `,
      error: () => html`Error. Unable to load comments from ${this.src}`,
    });
  }
}
