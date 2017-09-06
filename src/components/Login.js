import React, { Component } from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import { validateLogin } from '../utils/api'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
export default class Login extends Component {
  state = {}

  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = () => {
    const { Username, Password } = this.state
    const { store } = this.props
    console.log(store)
    if (validateLogin(Username, Password)) {
      store.loginStatus.set(true)
    }
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1}>
          <Grid.Column width={8}>
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
