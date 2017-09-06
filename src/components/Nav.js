import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

@inject('store')
@observer
export default class Nav extends Component {

  handleItemClick = (e, { name }) => this.props.store.setACtiveNavItem(name)

  render() {
    const { activeItem } = this.props.store.nav

    return (
      <Menu stackable inverted color="blue" style={{ borderRadius: 0 }}>
        <Menu.Item header as="h2">
          Raffle Manager
        </Menu.Item>

        <Menu.Item name="Leaderboard" active={activeItem === 'Leaderboard'} color="red" onClick={this.handleItemClick} as={Link} to="/">
          <Icon name="ordered list" />
          Leaderboard
        </Menu.Item>

        <Menu.Item name="Admin" active={activeItem === 'Admin'} onClick={this.handleItemClick} position="right" as={Link} to="/admin">
          <Icon name="user" />
          Admin
        </Menu.Item>
      </Menu>
    )
  }
}


