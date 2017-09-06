import React, { Component } from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import { validateLogin } from '../utils/api'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

@inject('store')
class Login extends Component {
  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = () => {
    const { Username, Password } = this.state
    const { store } = this.props
    if (validateLogin(Username, Password)) {
      store.login().then((res) => {
        if (res) {
          toast.success('Successfully logged in!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500
          })
          store.setACtiveNavItem('Leaderboard')
          this.props.history.push('/')
        }
      })
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

export default withRouter(Login)