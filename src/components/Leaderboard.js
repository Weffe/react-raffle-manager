import React, { Component } from 'react'
import { Table, Dimmer, Loader } from 'semantic-ui-react'
import { raffleEntriesRecord } from '../utils/deepstream'
import { sortBy } from 'lodash'

const DimmerWithLoader = () => {
  return (
    <Dimmer active inverted>
      <Loader content="Loading Leaderboard..." />
    </Dimmer>
  )
}

export default class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.state = { data: [], ready: false }
  }

  componentDidMount() {
    raffleEntriesRecord.whenReady(record => {
      let entries = record.get()
      console.log(entries)
      this.setState({ ready: true, data: entries })

      // subscribe to changes
      record.subscribe(payload => {
        if (this.state.column) {
          const sortedData = sortBy(payload, [this.state.column])

          if (this.state.direction && this.state.direction === 'descending') {
            sortedData.reverse()
          }

          this.setState({ data: sortedData })
        } else {
          this.setState({ data: payload })
        }
      })
    })
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: sortBy(data, [clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    })
  }

  render() {
    const { ready, data, direction, column } = this.state
    if (!ready) return <DimmerWithLoader />

    return (
      <Table striped sortable columns={3}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={column === 'firstName' ? direction : null} onClick={this.handleSort('firstName')}>
              First Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'lastName' ? direction : null} onClick={this.handleSort('lastName')}>
              Last Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={column === 'tickets' ? direction : null} onClick={this.handleSort('tickets')}>
              Amount of Tickets
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data &&
            data.map(({ firstName, lastName, tickets }) => {
              return (
                <Table.Row key={`${firstName}-${lastName}`}>
                  <Table.Cell>{firstName}</Table.Cell>
                  <Table.Cell>{lastName}</Table.Cell>
                  <Table.Cell>{tickets}</Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
    )
  }
}
