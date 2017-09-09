import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import Leaderboard from '../Leaderboard/'
import Raffle from './Raffle'

export default class Dashboard extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Grid.Row>
              <Grid.Column>
                <Raffle />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column>
            <Leaderboard />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
