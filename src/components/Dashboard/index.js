import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import AdminLogin from './AdminLogin'
import Dashboard from './Dashboard'

export default class Login extends Component {
  state = { adminLoginStatus: false }

  setAdminLoginStatus = status => this.setState({ adminLoginStatus: status })

  render() {
    const { adminLoginStatus } = this.state
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>{adminLoginStatus ? <Dashboard /> : <AdminLogin setAdminLoginStatus={this.setAdminLoginStatus} />}</Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
