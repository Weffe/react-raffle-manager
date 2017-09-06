import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
export default class Admin extends Component {
  render() {
    const { loginStatus } = this.props.store.admin
    console.log(this.props.store.nav)
    return (
      <Grid centered>
        <Grid.Row columns={1}>
          <Grid.Column width={8}>{loginStatus ? <Dashboard /> : <Login />}</Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
