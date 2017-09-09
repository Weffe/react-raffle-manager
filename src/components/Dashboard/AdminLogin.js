import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { validateAdminLogin } from '../../utils/api'

export default class AdminLogin extends Component {
  handleChange = ({ target: { placeholder, value } }) => this.setState({ [placeholder]: value })

  handleSubmit = async () => {
    const { Key } = this.state

    const validStatus = await validateAdminLogin(Key)

    if (validStatus) {
      this.props.setAdminLoginStatus(true)
    }
  }

  render() {
    return (
      <Form unstackable onSubmit={this.handleSubmit}>
        <Form.Input label="Enter Key" placeholder="Key" type="password" onChange={this.handleChange} />
        <Button type="submit">Submit</Button>
      </Form>
    )
  }
}
