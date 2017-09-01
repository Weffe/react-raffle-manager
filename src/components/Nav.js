import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  // set active menu.item on mount based on the initial route
  componentDidMount() {
    let initialRoute = this.props.location.pathname

    switch (initialRoute) {
      case '/':
        this.setState({ activeItem: 'Leaderboard' })
        break
      case '/Admin':
        this.setState({ activeItem: 'Admin' })
        break
      default:
        break
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu stackable inverted color="blue" style={{ borderRadius: 0 }}>
        <Menu.Item header as="h2">
          Raffle Manager
        </Menu.Item>

        <Menu.Item name="Leaderboard" active={activeItem === 'Leaderboard'} color="red" onClick={this.handleItemClick} as={Link} to="/">
          <Icon name="ordered list" />
          Leaderboard
        </Menu.Item>

        <Menu.Item name="Admin" active={activeItem === 'Admin'} onClick={this.handleItemClick} position="right" as={Link} to="/Admin">
          <Icon name="user" />
          Admin
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(Nav)
