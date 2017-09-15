import React, { Component } from 'react'
import { Button, Form, Divider } from 'semantic-ui-react'
import { incrementRaffleTickets } from '../utils/api'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'

@inject('store')
class RaffleEntry extends Component {
  constructor(props) {
    super(props)

    this.state = { username: '', password: '' }
  }

  handleForgotAccountClick = () => {
    const { store, history } = this.props

    store.setACtiveNavItem('ForgotAccount')
    history.push('/forgotaccount')
  }

  handleSubmit = async () => {
    // clear values
    this.setState({ username: '', password: '' })
    const successStatus = await incrementRaffleTickets(this.state.username, this.state.password)

    switch (successStatus) {
      case 'SUCCESS':
        toast.success('Successfully added a ticket!')
        break
      case 'ERROR':
        toast.error('Username or Password was incorrect!')
        break
      case 'WARN':
        console.log('hello?')
        toast.warn('Already added your weekly ticket!')
        break
      default:
        toast.error('There was an unexpected error!')
    }

  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label="Enter Username"
            placeholder="Username"
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <Form.Input
            label="Enter Password"
            placeholder="Password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <Button fluid color="blue" type="submit">
            Get Raffle Ticket
        </Button>
        </Form>
        <Divider horizontal>Or</Divider>
        <Button fluid secondary onClick={this.handleForgotAccountClick}>Forgot my account...</Button>
      </div>
    )
  }
}
export default withRouter(RaffleEntry)