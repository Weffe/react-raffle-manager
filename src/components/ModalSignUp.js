import React, { Component } from 'react'
import { Button, Header, Modal, Form, Message } from 'semantic-ui-react'
import { registerNewUser } from '../utils/api'
import { isEmpty, forEach } from 'lodash'
import { toast } from 'react-toastify'

const SignUpButton = () => {
  return (
    <Button animated="fade" color="green" size="big" circular>
      <Button.Content visible>Sign-up for an account</Button.Content>
      <Button.Content hidden>It's Free!</Button.Content>
    </Button>
  )
}

export default class ModalSignUp extends Component {
  state = { pwsDontMatch: null }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value.trim() })

  handleSignUp = () => {
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
      this.setState({ hasError: false })
      registerNewUser(firstName, lastName, username, password, email).then(() => {
        toast.success('Successfully signed up and received 1 raffle ticket!', {
          position: toast.POSITION.TOP_CENTER,
        })
        this.signUpNode.state.open = false
      })
    }
  }

  render() {
    return (
      <Modal ref={node => (this.signUpNode = node)} trigger={SignUpButton()} closeIcon closeOnRootNodeClick={false}>
        <Header icon="add user" content="Create Account" />
        <Modal.Content>
          <Form error={this.state.hasError}>
            <Form.Input label="Enter First Name" placeholder="First Name" name="firstName" type="text" onChange={this.handleChange} required />
            <Form.Input label="Enter Last Name" placeholder="Last Name" name="lastName" type="text" onChange={this.handleChange} required />
            <Form.Input label="Enter Username" placeholder="Username" name="username" type="text" onChange={this.handleChange} required />
            <Form.Input label="Enter Email" placeholder="Email" name="email" type="email" onChange={this.handleChange} required />
            <Form.Input label="Enter Password" placeholder="Password" name="password" type="password" onChange={this.handleChange} required />
            <Form.Input label="Re-Enter Password" placeholder="RePassword" name="repassword" type="password" onChange={this.handleChange} required />
            <Message error header={this.state.errorType === 'PW_NOMATCH' ? "Your passwords don't match!" : 'A form field is empty!'} />
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
