import { LitElement } from "lit";
import type { Comment } from "../types";
import "./fedi-action-bar";
export declare class FediChat extends LitElement {
    static styles: import("lit").CSSResult;
    src: string;
    private _commentsTask;
    renderComment(comment: Comment): import("lit-html").TemplateResult<1>;
    render(): unknown;
}
