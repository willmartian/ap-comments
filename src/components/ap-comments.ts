import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Task } from "@lit-labs/task";
import { repeat } from "lit/directives/repeat.js";
import type { Account, Comment, CommentsResponse } from "../types";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';
import 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';

TimeAgo.addDefaultLocale(en)

@customElement("ap-comments")
export class Comments extends LitElement {
  static styles = css`
    :host {
      --color-muted: rgba(0, 0, 0, 45%);
      --font-family: 'Arial', sans-serif;

      max-width: 400px;
      font-family: var(--font-family);
    }

    *, ::before, ::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    article {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 14px 10px;
    }

    .content {
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;  
      line-height: 1.5;
      word-break: break-word;
    }

    .footer {
      margin-block-end: 1em;  
      display: flex;
      flex-direction: row;
      gap: .66rem;
      align-items: center;
    }

    .content > p {
      margin-top: 0;
      margin-bottom: 0;
    }

    .name {
      font-weight: bold;
      width: 100%;
      color: #1A1A1B;
      font-size: .9rem;
    }

    .name:hover {
      text-decoration: underline;
      text-decoration-thickness: 2px;
    }

    .seperator {
      display: inline-block;
      width: .125rem;
      height: .125rem;
      background: var(--color-muted);
    }

    .header {
      width: 100%;
      display: flex;
    }

    .details {
      display: inline-flex;
      flex-direction: column;
      width: 100%;
      overflow: auto;
    }

    a.muted {
      color: var(--color-muted);
      text-decoration: none;
    }

    .details a {
      margin-top: .25em;
    }

    .truncate {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .action-bar {
      display: flex;
      flex-direction: row;
      gap: .66rem;
      align-items: center;
    }

    .action-bar > * {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.33em;
      color: var(--color-muted)
    }

    .avatar {
      width: 48px;
      height: 48px;
      margin-right: 10px;
      position:relative;
    }

    .avatar > img {
      width: 48px;
      height: 48px;
      border-radius: 5px;
    }

    .avatar::before {
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 5px;
      position: absolute;
      background-color: rgba(0,0,255,0);

      transition-property: background-color;
      transition-duration: 0.2s;
    }

    .avatar:hover::before {
      background: rgba(0,0,0,0.05);
    }

    #comment-list {
      width: 100%;
      margin-top: 2em;
    }

    .time {
      color: var(--color-muted);
    }

    .nested-replies {
      margin-left: .5em;
      padding-left: .5em;
      border-left: 2px solid #edeff1;
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

  @property({
    type: Number,
    attribute: 'max-nested-depth'
  })
  maxNestedDepth: number = 3;

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

  private timeAgo = new TimeAgo('en-US');
  private commentId!: string;
  private replies: Comment[] = []

  connectedCallback() {
    super.connectedCallback();
  }

  private parseSrc(src: string) {
    const id = src.split('/').at(-1)!;
    this.commentId = id;
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
      return html`<div>Error: no "src" provided.</div>`;
    }
    return html`
      ${this.hideActionBar ? nothing : this._actionTask.render({
        complete: (comment) => this.renderActionBar(comment.replies_count, comment.reblogs_count, comment.favourites_count),
      })}
      <div part="comment-list" id="comment-list">
        ${this.renderCommentList()}
      </div>
    `
  }

  private renderComment(comment: Comment, currentDepth = 0): any {
    return html`<article class="comment" part="comment">
      <div class="header">
        <a class="avatar" href=${comment.account.url}>
          <img src=${comment.account.avatar}>
          <div class="avatar-overlay"></div>
        </a>
        <div class="details">
          <div class="name truncate">${comment.account.display_name}</div>
          <a part="author-link" class="truncate muted" href=${comment.account.url}>${this.getFullUsername(comment.account)}</a>
        </div>
      </div>
      <div 
        part="content" 
        class="content"
        .innerHTML=${comment.content}
      ></div>
      <div part="footer" class="footer">
        ${this.renderActionBar(comment.replies_count, comment.reblogs_count, comment.favourites_count)}
        <span class="seperator"></span>
        <a href="#" class="time muted">${this.getTimeAgo(comment.created_at)}</a>
      </div>
    </article>
    <!-- TODO fix -->
    <div class=${currentDepth < this.maxNestedDepth ? 'nested-replies' : 'nested-replies'}>
      ${repeat(this.replies.filter(reply => reply?.in_reply_to_id === comment?.id), reply => reply.id, (comment) => this.renderComment(comment, currentDepth + 1))}
    </div>
    `;
  }

  private renderActionBar(replies_count: number, reblogs_count: number, favourites_count: number) {
    return html`<div class="action-bar" part="action-bar">
      <span>
        <ion-icon name="chatbubble"></ion-icon>
        ${replies_count}
      </span>
      <span>
        <ion-icon name="repeat"></ion-icon>
        ${reblogs_count}
      </span>
      <span>
        <ion-icon name="heart"></ion-icon>
        ${favourites_count}
      </span>
    </div>`
  }

  private renderCommentList() {
    return this._repliesTask.render({
      pending: () => html`Loading comments...`,
      complete: (comments) => {

        this.replies = comments.descendants;

        return repeat(
          comments.descendants.filter(comment => comment.in_reply_to_id === this.commentId),
          (comment) => comment.id,
          this.renderComment.bind(this),
        )
      },
      error: () => html`Error. Unable to load comments from ${this.src}`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ap-comments": Comments;
  }
}
