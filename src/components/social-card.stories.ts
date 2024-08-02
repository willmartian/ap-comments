import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';

import './social-card';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Example/Social Card',
} as Meta;

type CardProps = {
    src: string
}

const Template: Story<Partial<CardProps>> = (args) => html`<social-card></social-card>`;

export const Primary = Template.bind({});
Primary.args = {
    src: 'https://fosstodon.org/@willmartian'
}
