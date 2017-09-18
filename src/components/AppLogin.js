import React, { Component } from 'react'
import { Grid, Form, Button, Message } from 'semantic-ui-react'
import { validateAppLogin } from '../utils/api'
import { inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

@inject('store')
class AppLogin extends Component {
  state = { hasError: false, errorMsg: '' }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleSubmit = async () => {
    const { username, password } = this.state
    const { store, history } = this.props

    validateAppLogin(username, password)
      .then(() => {
        this.setState({ hasError: false })

        store.login().then(res => {
          if (res) {
            toast.success('Successfully logged in!')
            store.setACtiveNavItem('Leaderboard')
            history.push('/')
          }
        })
      })
      .catch((error) => {
        this.setState({ hasError: true, errorMsg: error })
      })
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column width={8} mobile={16}>
            <Form unstackable onSubmit={this.handleSubmit} error={this.state.hasError}>
              <Form.Input label="Enter Username" placeholder="Username" name="username" type="password" onChange={this.handleChange} />
              <Form.Input label="Enter Password" placeholder="Password" name="password" type="password" onChange={this.handleChange} />
              <Button type="submit">Submit</Button>
              <Message error header={this.state.errorMsg} />
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(AppLogin)
