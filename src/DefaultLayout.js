import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import './defaultLayout.css'
// routes config
import routes from './routes/routes';
import Header from './views/components/header/Header'
import CustomBreadcrumbs from './views/components/breadcrumbs/CustomBreadcrumbs'

class DefaultLayout extends Component {

  UNSAFE_componentWillMount() {
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">
        <Header ></Header>
        <div className="app-body">
          <main className="main">
            <CustomBreadcrumbs />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return (route.component) ?
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                      : "";
                  })}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default DefaultLayout;
