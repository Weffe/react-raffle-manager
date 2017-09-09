import React, { Component } from 'react'
import { raffleEntriesRecord } from '../../utils/deepstream'
import { upperFirst } from 'lodash'
import ReactTable from 'react-table'
import { Header } from 'semantic-ui-react'
import './custom.css'

const columns = [
  {
    Header: 'First Name',
    id: 'firstName',
    accessor: d => upperFirst(d.firstName)
  },
  {
    Header: 'Last Name',
    id: 'lastName',
    accessor: d => upperFirst(d.lastName)
  },
  {
    Header: 'Amount of tickets',
    accessor: 'tickets'
  }
]

export default class Leaderboard extends Component {
  state = { data: [], loading: true }

  componentDidMount() {
    raffleEntriesRecord.whenReady(record => {
      let entries = record.get()
      this.setState({ data: entries, loading: false })

      // subscribe to changes
      record.subscribe(payload => {
        this.setState({ data: payload })
      })
    })
  }

  render() {
    const { data, loading } = this.state

    return (
      <div>
        <Header as="h2">Leaderboard</Header>
        <ReactTable loading={loading} data={data} columns={columns} className="-striped -highlight" />
      </div>
    )
  }
}
