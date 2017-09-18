import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import AppLogin from '../components/AppLogin'
import Dashboard from '../components/Dashboard/'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
export default class Admin extends Component {
  render() {
    // const { loginStatus } = this.props.store.admin
    const loginStatus = true
    return (
      <Grid centered>
        <Grid.Row columns={1}>
          <Grid.Column width={loginStatus ? 16 : 8}>{loginStatus ? <Dashboard /> : <AppLogin />}</Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
