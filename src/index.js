import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Layout from './containers/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'

const Router = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
      </Switch>
    </Layout>
  </BrowserRouter>
)

ReactDOM.render(<Router />, document.getElementById('root'))
