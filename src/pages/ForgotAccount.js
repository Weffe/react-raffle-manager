import React, { Component } from 'react'
import { Grid, Segment, Header, Icon } from 'semantic-ui-react'
import AccountResetter from '../components/AccountResetter/'

export default class ForgotAccount extends Component {

    render() {
        return (
            <Grid container centered>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Segment>
                            <Header>
                                <Header.Content>
                                    Forgot your account?
                            </Header.Content>
                                <Header.Subheader>
                                    That's okay, you can reset your information <Icon name="smile" />
                                </Header.Subheader>
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <AccountResetter />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}