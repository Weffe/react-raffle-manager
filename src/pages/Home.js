import React, { Component } from 'react'
import { Grid, Segment, Header, Divider } from 'semantic-ui-react'
import RaffleEntry from '../components/RaffleEntry'
import Leaderboard from '../components/Leaderboard/'
import ModalSignUp from '../components/ModalSignUp'
import { observer, inject } from 'mobx-react'

@inject('store')
@observer
export default class Home extends Component {
  renderModalSignUp = loginStatus => {
    if (!loginStatus) return null

    return (
      <Grid.Row centered>
        <Grid.Column width={16}>
          <Segment>
            <Header as="h1">
              Welcome!
              <Header.Subheader>If you don't already have a free account then register for one!</Header.Subheader>
            </Header>
            <ModalSignUp />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRaffleLeaderboard = loginStatus => {
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
          <Segment>
            <Header as="h2">
              Raffle Entry
              <Header.Subheader>Enter your information to get your weekly raffle ticket!</Header.Subheader>
            </Header>
            <Divider />
            <RaffleEntry />
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <Leaderboard />
        </Grid.Column>
      </Grid.Row>
    )
  }

  render() {
    const { loginStatus } = this.props.store.admin
    return (
      <Grid stackable>
        {this.renderModalSignUp(loginStatus)}

        {this.renderRaffleLeaderboard(loginStatus)}
      </Grid>
    )
  }
}
