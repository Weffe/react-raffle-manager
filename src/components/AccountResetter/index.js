import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import UsernameResetter from './UsernameResetter'
import PasswordResetter from './PasswordResetter'

const panes = [
  {
    menuItem: 'Reset Username',
    render: () => (
      <Tab.Pane attached={false}>
        <UsernameResetter />
      </Tab.Pane>
    )
  },
  {
    menuItem: 'Reset Password',
    render: () => (
      <Tab.Pane attached={false}>
        <PasswordResetter />
      </Tab.Pane>
    )
  }
]

export default class AccountResetter extends Component {
  render() {
    return <Tab menu={{ pointing: true, color: 'blue' }} panes={panes} />
  }
}
