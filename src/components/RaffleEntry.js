import React, { Component } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { incrementRaffleTickets } from '../utils/api'
import { ToastContainer, toast } from 'react-toastify'

export default class RaffleEntry extends Component {
  constructor(props) {
    super(props)

    this.state = { username: '', password: '' }
  }

  handleSubmit = () => {
    const successStatus = incrementRaffleTickets(this.state.username, this.state.password)
    this.setState({ username: '', password: '' })

    switch (successStatus) {
      case 'success':
        toast.success('Successfully added a ticket!', {
          position: toast.POSITION.TOP_CENTER
        })
        break
      case 'error':
        toast.error('Username or Password was incorrect!', {
          position: toast.POSITION.TOP_CENTER
        })
        break
      case 'warn':
        toast.warn('Already added your weekly ticket!', {
          position: toast.POSITION.TOP_CENTER
        })
        break
    }
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  render() {
    return (
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
        <Button color="blue" type="submit">
          Get Raffle Ticket
        </Button>
        <ToastContainer />
      </Form>
    )
  }
}
