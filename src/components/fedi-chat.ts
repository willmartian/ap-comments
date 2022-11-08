import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit-labs/task";
import { repeat } from "lit/directives/repeat.js";
import type { Account, Comment, CommentsResponse } from "../types";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

@customElement("fedi-chat")
export class FediChat extends LitElement {
  static styles = css`
    :host {
      --color-muted: rgba(0, 0, 0, 45%);
      --font-family: inherit;

      font-family: var(--font-family);
    }

    *, ::before, ::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    article {
      display: block;

      margin-top: 1em;
      margin-bottom: 1em;
      
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

    .footer {
      margin-block-end: 1em;  
    }

    .content {
      line-height: 1.5;
    }

    .content > p {
      margin-top: 0;
      margin-bottom: 0;
    }

    .name {
      font-weight: bold;
    }

    .seperator {
      display: inline-block;
      width: .125rem;
      height: .125rem;
      background: currentColor;
    }

    .header a {
      color: var(--color-muted)
    }

    .details {
      margin-top: .25em;
      color: var(--color-muted);
      display: inline-flex;
      align-items: center;
      gap: .33rem;
      flex-wrap: wrap;
    }

    .action-bar {
      display: flex;
      margin-bottom: 1.5em;
      font-family: 
    }

    .action-bar > * {
      margin-right: 1.5em;
      overflow-wrap: no-wrap;
    }
   `;

  @property()
  src!: string;

  @property({ 
    type: Boolean, 
    reflect: true,
    attribute: 'hide-action-bar'
  })
  hideActionBar: boolean = false;

  private _repliesTask = new Task(
    this,
    ([src]) =>
      fetch(src).then((response) =>
        response.json() as Promise<CommentsResponse>
      ),
    () => [this.parseSrc(this.src) + '/context'],
  );

  private _actionTask = new Task(
    this,
    ([src]) =>
      fetch(src).then((response) =>
        response.json() as Promise<Comment>
      ),
    () => [this.parseSrc(this.src)],
  );

  private timeAgo = new TimeAgo('en-US')

  connectedCallback() {
    super.connectedCallback();
  }

  private parseSrc(src: string) {
    const id = src.split('/').at(-1)!;
    const url = new URL(src);
    return `https://${url.hostname}/api/v1/statuses/${id}`;
  }

  private getFullUsername(account: Account) {
    const url = new URL(account.url);
    return `@${account.username}@${url.hostname}`;
  }

  private getTimeAgo(created_at: string) {
    return this.timeAgo.format(new Date(created_at), 'twitter')
  }

  render() {
    if (!this.src) {
      return html`<div>Make sure you provided the link to a host comment in the "src" field.</div>`;
    }
    return html`
      ${this.hideActionBar ? nothing : this._actionTask.render({
        complete: (comment) => this.renderActionBar(comment.replies_count, comment.reblogs_count, comment.favourites_count),
      })}
      <div part="comment-container">
        ${this.renderCommentList()}
      </div>
    `
  }

  private renderComment(comment: Comment) {
    return html`<article class="comment" part="comment">
      <div class="header">
        <div class="name">${comment.account.display_name}</div>
        <div class="details">
          <a part="author-link" href=${comment.account.url}>${this.getFullUsername(comment.account)}</a>
          <span class="seperator"></span>
          <span>${this.getTimeAgo(comment.created_at)}</span>
        </div>
      </div>
      <div part="content" class="content" .innerHTML=${comment.content}></div>
    </article>`;
  }

  // TODO: allow better customization of icons
  private renderActionBar(replies_count: number, reblogs_count: number, favourites_count: number) {
    return html`<div class="action-bar" part="action-bar">
      <div>💬 ${replies_count}</div>
      <div>♻️ ${reblogs_count}</div>
      <div>⭐ ${favourites_count}</div>
      <div><a href=${this.src}>View on Mastodon</a></div>
    </div>`
  }

  private renderCommentList() {
    return this._repliesTask.render({
      pending: () => html`Loading comments...`,
      complete: (comments) => repeat(
        comments.descendants,
        (comment) => comment.id,
        this.renderComment.bind(this),
      ),
      error: () => html`Error. Unable to load comments from ${this.src}`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "fedi-chat": FediChat;
  }
}
