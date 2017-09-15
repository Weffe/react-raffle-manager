import React, { Component } from 'react'
import { Button, Header, Modal, Form, Message } from 'semantic-ui-react'
import { registerNewUser } from '../utils/api'
import { isEmpty, forEach } from 'lodash'
import { toast } from 'react-toastify'

export default class ForgotPasswordModal extends Component {
    state = { pwsDontMatch: null }

    handleChange = ({ target: { name, value } }) => this.setState({ [name]: value.trim() })

    handleSubmission = () => {
        const { firstName, lastName, username, email, repassword, password } = this.state
        let someFieldIsEmpty = false
        forEach([firstName, lastName, username, email, repassword, password], item => {
            if (isEmpty(item)) someFieldIsEmpty = true
        })

        if (someFieldIsEmpty) {
            this.setState({ hasError: true, errorType: 'PW_EMPTY' })
        } else if (repassword !== password) {
            this.setState({ hasError: true, errorType: 'PW_NOMATCH' })
        } else {
            registerNewUser(firstName, lastName, username, password, email).then(() => {
                toast.success('Successfully signed up and received 1 raffle ticket!')
                this.setState({ hasError: false, modalActive: false })
            })
        }
    }

    render() {
        const { modalActive, hasError, errorType } = this.state
        const { isOpen } = this.props
        return (
            <Modal trigger={<Button fluid onClick={this.handleForgotPasswordClick}>Forgot password</Button>}
                closeIcon
                closeOnRootNodeClick={false}>
                <Header icon="lock" content="Reset Password" />
                <Modal.Content>
                    <Form error={hasError}>
                        <Form.Input label="Enter Username" placeholder="Username" name="username" type="text" onChange={this.handleChange} required />
                        <Form.Input label="Enter Email" placeholder="Email" name="email" type="email" onChange={this.handleChange} required />
                        <Form.Input
                            label="Enter New Password"
                            placeholder="New Password"
                            name="password"
                            type="password"
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            label="Re-Enter New Password"
                            placeholder="New Password"
                            name="repassword"
                            type="password"
                            onChange={this.handleChange}
                            required
                        />
                        <Message error header={errorType === 'PW_NOMATCH' ? "Your passwords don't match!" : 'A form field is empty!'} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.handleSubmission}>Submit</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
