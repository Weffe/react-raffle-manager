import React, { Component } from 'react'
import { Form, Button, Message } from 'semantic-ui-react'
import { validateAdminLogin } from '../../utils/api'

export default class AdminLogin extends Component {
  state = { hasError: false }
  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = async () => {
    const { Key } = this.state

    const validStatus = await validateAdminLogin(Key)

    if (validStatus) {
      this.setState({ hasError: false })
      this.props.setAdminLoginStatus(true)
    } else {
      this.setState({ hasError: true })
    }
  }

  render() {
    return (
      <Form unstackable onSubmit={this.handleSubmit} error={this.state.hasError}>
        <Form.Input label="Enter Key" placeholder="Key" type="password" onChange={this.handleChange} />
        <Button type="submit">Submit</Button>
        <Message error header="Incorrect input values" />
      </Form>
    )
  }
}
