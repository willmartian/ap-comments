import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import './ap-comments.ts';
import { ifDefined } from 'lit-html/directives/if-defined.js';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Example/Post',
} as Meta;

type ChatProps = {
    src: string,
    hideActionBar: boolean,
    maxNestedDepth: number
}

const Template: Story<Partial<ChatProps>> = (args) => html`
  <ap-comments 
    src=${args.src!} 
    maxNestedDepth=${ifDefined(args.maxNestedDepth)} 
    ?hide-action-bar=${args.hideActionBar}
  ></ap-comments>
`;

export const Primary = Template.bind({});
Primary.args = {
    src: 'https://fosstodon.org/@willmartian/109285848751638736',
    hideActionBar: false,
    maxNestedDepth: 3
}
