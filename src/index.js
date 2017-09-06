import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import Layout from './containers/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import store from './store'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()

const history = syncHistoryWithStore(browserHistory, routingStore)

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" component={Admin} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
