import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import { inject, observer } from 'mobx-react'

@inject('store')
@observer
export default class Admin extends Component {
  componentDidMount() {
    const { store } = this.props
    console.log(store.loginStatus.get())
  }

  render() {
    const { loginStatus } = this.props.store
    return (
      <Grid centered>
        <Grid.Row columns={1}>
          <Grid.Column width={8}>{loginStatus ? <Dashboard /> : <Login />}</Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
