import React, { Component } from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import { validateAppLogin } from '../utils/api'
import { inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

@inject('store')
class AppLogin extends Component {
  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = async () => {
    const { Username, Password } = this.state
    const { store } = this.props

    const validStatus = await validateAppLogin(Username, Password)

    if (validStatus) {
      store.login().then(res => {
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
        <Grid.Row>
          <Grid.Column width={8} mobile={16}>
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

export default withRouter(AppLogin)
