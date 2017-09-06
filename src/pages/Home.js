import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import RaffleEntry from '../components/RaffleEntry'
import Leaderboard from '../components/Leaderboard'
import ModalSignUp from '../components/ModalSignUp'
import { observer } from 'mobx-react'

@observer
export default class Home extends Component {
  state = {}

  render() {
    return (
      <Grid stackable>
        <Grid.Row centered>
          <Grid.Column width={16}>
            <ModalSignUp />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column width={8}>
            <RaffleEntry />
          </Grid.Column>
          <Grid.Column width={8}>
            <Leaderboard />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
