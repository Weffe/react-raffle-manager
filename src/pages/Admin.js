import React, { Component } from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import RaffleEntry from '../components/RaffleEntry'
import Leaderboard from '../components/Leaderboard'
import { validateLogin } from '../utils/api'

export default class Home extends Component {
  state = {}

  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = () => {
    const { Username, Password } = this.state
    if (validateLogin(Username, Password)) {
      console.log('success!')
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            <Form unstackable onSubmit={this.handleSubmit}>
              <Form.Input label="Enter Username" placeholder="Username" type="password" onChange={this.handleChange} />
              <Form.Input label="Enter Password" placeholder="Password" type="password" onChange={this.handleChange} />
              <Button type="submit">Submit</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
