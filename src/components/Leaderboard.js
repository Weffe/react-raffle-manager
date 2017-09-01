import React, { Component } from 'react'
import { Table, Dimmer, Loader } from 'semantic-ui-react'
import { client, raffleList } from '../utils/deepstream'

const DimmerWithLoader = () => {
  return (
    <Dimmer active inverted>
      <Loader content="Loading Leaderboard" />
    </Dimmer>
  )
}
const fakeInitData = [
  { firstName: 'Name 1', lastName: 'Name 1', tickets: 0 },
  { firstName: 'Name 2', lastName: 'Name 2', tickets: 0 },
  { firstName: 'Name 3', lastName: 'Name 3', tickets: 0 },
  { firstName: 'Name 4', lastName: 'Name 4', tickets: 0 },
  { firstName: 'Name 5', lastName: 'Name 5', tickets: 0 }
]

export default class Leaderboard extends Component {
  constructor(props) {
    super(props)
    this.state = { data: fakeInitData, ready: false }
  }

  componentDidMount() {
    const data = []

    raffleList.whenReady(list => {
      const entries = list.getEntries()
      let records = entries.map(id => client.record.getRecord(id))
      for (let r of records) {
        r.whenReady(x => data.push(x.get()))
      }
      console.log(data)
      this.setState({ ready: true, data })
    })
  }

  render() {
    const { ready, data } = this.state
    if (!ready) return <DimmerWithLoader />

    return (
      <Table unstackable striped sortable columns={3}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Amount of Tickets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map(({ firstName, lastName, tickets }) => {
            console.log(firstName, lastName, tickets)
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
