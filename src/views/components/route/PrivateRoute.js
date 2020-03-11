import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { privilegeValidate } from '../../../utilities/helpers/PrivilegeValidator'

export const PrivateRoute = ({ component: Component, ...rest }) => (

    <Route {...rest} render={props => (
        localStorage.getItem('username')
            ? (privilegeValidate(props)) ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)