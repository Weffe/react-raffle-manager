import React, { Component } from 'react'
import { client, usersList } from '../../../utils/deepstream'
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
        Header: 'Username',
        accessor: 'username'
    }
]

export default class UsersTable extends Component {
    state = { data: [], loading: true }

    componentDidMount() {
        const { data } = this.state
        usersList.whenReady(list => {
            let users = list.getEntries()
            let usersLength = users.length - 1

            users.forEach((userID, index) => {
                client.record.getRecord(userID).whenReady((record) => {
                    let userData = record.get()
                    data.push(userData)
                    if (index === usersLength)
                        this.setState({ loading: false, data })
                })
            })
        })
    }

    render() {
        const { data, loading } = this.state
        return (
            <div>
                <Header as="h2">Users Table</Header>
                <ReactTable loading={loading} data={data} columns={columns} className="-striped -highlight" defaultPageSize={10} />
            </div>
        )
    }
}
