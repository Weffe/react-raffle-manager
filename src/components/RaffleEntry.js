import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { incrementRaffleTickets } from '../utils/api'
import { ToastContainer, toast } from 'react-toastify'

export default class RaffleEntry extends Component {
  constructor(props) {
    super(props)

    this.state = { username: '', password: '' }
  }

  handleSubmit = async () => {
    // clear values
    this.setState({ username: '', password: '' })

    const successStatus = await incrementRaffleTickets(this.state.username, this.state.password)

    switch (successStatus) {
      case 'SUCCESS':
        toast.success('Successfully added a ticket!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        })
        break
      case 'ERROR':
        toast.error('Username or Password was incorrect!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        })
        break
      case 'WARN':
        toast.warn('Already added your weekly ticket!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        })
        break
      default:
        toast.error('There was an unexpected error!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        })
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
