import React, { Component } from 'react'
import { Grid, Form, Button, Message } from 'semantic-ui-react'
import { resetUserPassword } from '../../utils/api'
import { toast } from 'react-toastify'

export default class UsernameResetter extends Component {
    state = { hasError: false, errorMsg: '' }

    handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

    handleSubmit = () => {
        const { email, username, password, repassword } = this.state

        if (password !== repassword) {
            this.setState({ hasError: true, errorMsg: 'Passwords do not match.' })
        }
        else {
            this.setState({ hasError: false, email: '', username: '', password: '', repassword: '' })
            resetUserPassword(email, username, password)
                .then(() => {
                    toast.success('Successfully reset your password!')
                })
                .catch((error) => this.setState({ hasError: true, errorMsg: error }))
        }
    }

    render() {
        const { email, username, password, repassword } = this.state

        return (
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={8} mobile={16}>
                        <Form unstackable onSubmit={this.handleSubmit} error={this.state.hasError}>
                            <Form.Input
                                label="Enter Email"
                                placeholder="Email"
                                name="email"
                                type="email"
                                onChange={this.handleChange}
                                value={email}
                                required />
                            <Form.Input
                                label="Enter Username"
                                placeholder="Username"
                                name="username"
                                onChange={this.handleChange}
                                value={username}
                                required />
                            <Form.Input
                                label="Enter New Password"
                                placeholder="New Password"
                                name="password"
                                type="password"
                                onChange={this.handleChange}
                                value={password}
                                required
                            />
                            <Form.Input
                                label="Re-Enter New Password"
                                placeholder="New Password"
                                name="repassword"
                                type="password"
                                onChange={this.handleChange}
                                value={repassword}
                                required
                            />
                            <Button color="blue" type="submit">Submit</Button>
                            <Message error header={this.state.errorMsg} />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}