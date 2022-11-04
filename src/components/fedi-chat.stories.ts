import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Example/Post',
} as Meta;

type PostProps = {
    author: string,
    content: string,
    likes: number,
    replies: number,
    boosts: number
}

const Template: Story<Partial<PostProps>> = (args) => html`<fedi-comment author=${args.author} content=${args.content} likes=${args.likes} replies=${args.replies} boosts=${args.boosts}></fedi-comment>`;


export const Primary = Template.bind({});
Primary.args = {
    author: 'Will Martin',
    content: 'Hello world!',
    likes: 1,
    replies: 0,
    boosts: 0
}
