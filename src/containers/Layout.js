import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import Nav from '../components/Nav'

export default class Layout extends Component {
  componentWillUnmount() {
    alert('Unmountin')
  }

  render() {
    return (
      <div>
        <Nav />

        <Grid container centered>
          <Grid.Row columns={1}>
            <Grid.Column width={16}>{this.props.children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
