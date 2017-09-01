import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Layout from './containers/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'

const RedirectToLeaderboard = () => <Redirect to="Leaderboard" />

const Router = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" render={RedirectToLeaderboard} />
        <Route exact path="/Leaderboard" component={Home} />
        <Route exact path="/Admin" component={Admin} />
      </Switch>
    </Layout>
  </BrowserRouter>
)

ReactDOM.render(<Router />, document.getElementById('root'))
