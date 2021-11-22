import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Header from './index'
import { HeaderProps } from './types'

export default {
  title: 'Example/Header',
  component: Header,
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = (args: HeaderProps) => <Header {...args} />

export const LoggedIn = Template.bind({})

export const LoggedOut = Template.bind({})
LoggedOut.args = {}
