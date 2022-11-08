import { LitElement } from "lit";
export declare class FediChat extends LitElement {
    static styles: import("lit").CSSResult;
    src: string;
    hideActionBar: boolean;
    private _repliesTask;
    private _actionTask;
    private timeAgo;
    connectedCallback(): void;
    private parseSrc;
    private getFullUsername;
    private getTimeAgo;
    render(): import("lit-html").TemplateResult<1>;
    private renderComment;
    private renderActionBar;
    private renderCommentList;
}
declare global {
    interface HTMLElementTagNameMap {
        "fedi-chat": FediChat;
    }
}
