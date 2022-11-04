import { Story, Meta } from '@storybook/web-components';
declare const _default: Meta<import("@storybook/web-components").Args>;
export default _default;
declare type PostProps = {
    author: string;
    content: string;
    likes: number;
    replies: number;
    boosts: number;
};
export declare const Primary: Story<Partial<PostProps>>;
