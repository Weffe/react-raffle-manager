import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import UsersTable from './UsersTable/'
import Raffle from './Raffle'

export default class Dashboard extends Component {
  render() {
    return (
      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Grid.Row>
              <Grid.Column>
                <Raffle />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column>
            <UsersTable />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
