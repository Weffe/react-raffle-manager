import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-table/react-table.css'
import Nav from '../components/Nav'
import { ToastContainer } from 'react-toastify'

export default class Layout extends Component {
  render() {
    return (
      <div>
        <Nav />

        <Grid container centered>
          {/* Defining Global Toast Container for the entire app */}
          <ToastContainer position="top-center" autoClose={1650} newestOnTop={true} />

          <Grid.Row columns={1}>
            <Grid.Column width={16}>{this.props.children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
