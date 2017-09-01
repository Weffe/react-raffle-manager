import React, { Component } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'

export default class RaffleEntry extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Form >
        <Form.Field>
          <label>User Name</label>
          <input placeholder='User Name' />
        </Form.Field>
        <Button type='submit'>Get Raffle Ticket</Button>
      </Form >
    )
  }
}