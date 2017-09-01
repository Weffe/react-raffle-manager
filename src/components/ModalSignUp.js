import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react'
import { registerNewUser } from '../utils/api'
import { isEmpty, forEach } from 'lodash'
import { toast } from 'react-toastify'

const SignUpButton = () => {
  return (
    <Button animated="fade" color="green">
      <Button.Content visible>Sign-up for an account</Button.Content>
      <Button.Content hidden>It's Free!</Button.Content>
    </Button>
  )
}

export default class ModalSignUp extends Component {
  state = { pwsDontMatch: null }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleSignUp = () => {
    const { firstName, lastName, username, email, repassword, password } = this.state
    let someFieldIsEmpty = false
    forEach([firstName, lastName, username, email, repassword, password], item => {
      if (isEmpty(item)) someFieldIsEmpty = true
    })

    if (someFieldIsEmpty) {
      this.setState({ hasError: true, errorType: 'pw_empty' })
    } else if (repassword !== password) {
      this.setState({ hasError: true, errorType: 'pw_nomatch' })
    } else {
      this.setState({ hasError: false })
      registerNewUser(firstName, lastName, username, password, email)
      toast.success('Successfully signed up!', {
        position: toast.POSITION.TOP_CENTER
      })
      this.signUpNode.state.open = false
    }
  }

  render() {
    return (
      <Modal ref={node => (this.signUpNode = node)} trigger={SignUpButton()} closeIcon closeOnRootNodeClick={false}>
        <Header icon="add user" content="Create Account" />
        <Modal.Content>
          <Form>
            <Form.Input
              label="Enter First Name"
              placeholder="First Name"
              name="firstName"
              type="text"
              onChange={this.handleChange}
              required
            />
            <Form.Input label="Enter Last Name" placeholder="Last Name" name="lastName" type="text" onChange={this.handleChange} required />
            <Form.Input label="Enter Username" placeholder="Username" name="username" type="text" onChange={this.handleChange} required />
            <Form.Input label="Enter Email" placeholder="Email" name="email" type="email" onChange={this.handleChange} required />
            <Form.Input
              label="Enter Password"
              placeholder="Password"
              name="password"
              type="password"
              onChange={this.handleChange}
              required
            />
            <Form.Input
              label="Re-Enter Password"
              placeholder="RePassword"
              name="repassword"
              type="password"
              onChange={this.handleChange}
              required
            />
            <Message error visible={this.state.hasError}>
              {this.state.errorType == 'pw_nomatch' ? (
                <Message.Header>Your passwords don't match!</Message.Header>
              ) : (
                <Message.Header>A form field is empty!</Message.Header>
              )}
            </Message>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.handleSignUp}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
