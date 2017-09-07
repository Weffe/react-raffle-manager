import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react' // eslint-disable-next-line

export default class Login extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <h1>This will be the dashboard. You are logged in!</h1>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
