import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import Nav from '../components/Nav'

export default class Layout extends Component {
  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            <Nav />
          </Grid.Column>
        </Grid.Row>

        {this.props.children}
      </Grid>
    )
  }
}
