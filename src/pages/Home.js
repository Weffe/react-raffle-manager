import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import RaffleEntry from '../components/RaffleEntry'
import Leaderboard from '../components/Leaderboard'
import ModalSignUp from '../components/ModalSignUp'
import { observer, inject } from 'mobx-react'

@inject('store')
@observer
export default class Home extends Component {
  renderModalSignUp = (loginStatus) => {
    if (!loginStatus) return null

    return (
      <Grid.Row centered>
        <Grid.Column width={16}>
          <ModalSignUp />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRaffleLeaderboard = (loginStatus) => {
    if (!loginStatus) {
      return (
        <Grid.Row>
          <Grid.Column width={16}>
            <Leaderboard />
          </Grid.Column>
        </Grid.Row>
      )
    }

    return (
      <Grid.Row>
        <Grid.Column width={8}>
          <RaffleEntry />
        </Grid.Column>
        <Grid.Column width={8}>
          <Leaderboard />
        </Grid.Column>
      </Grid.Row>
    )
  }

  render() {
    const { loginStatus } = this.props.store.admin
    console.log(this.props.store.nav)

    return (
      <Grid stackable>
        {this.renderModalSignUp(loginStatus)}

        {this.renderRaffleLeaderboard(loginStatus)}
      </Grid>
    )
  }
}
