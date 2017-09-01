import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react'
import { registerNewUser } from '../utils/api'

const SignUpButton = () => {
  return (
    <Button animated="fade" color="green">
      <Button.Content visible>Sign-up for an account</Button.Content>
      <Button.Content hidden>It's Free!</Button.Content>
    </Button>
  )
}

export default class ModalSignUp extends Component {
  state = { pwsDontMatch: null, dirty: false }
  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value, dirty: true })
  handleSignUp = () => {
    const { firstName, lastName, username, email, repassword, password, dirty } = this.state
    if (repassword !== password) {
      this.setState({ hasError: true, errorType: 'pw_nomatch' })
    } else if (
      (firstName === '' || lastName === '' || username === '' || email === '' || password === '' || repassword === '') &&
      dirty === false
    ) {
      this.setState({ hasError: true, errorType: 'pw_empty' })
    } else {
      this.setState({ hasError: false })
      registerNewUser(firstName, lastName, username, password, email)
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
            <Message error hidden={!this.state.hasError}>
              {this.state.errorType == 'pw_nomatch' ? (
                <Message.Header>Your passwords don't match!</Message.Header>
              ) : (
                <Message.Header>A password field is empty!</Message.Header>
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
