import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { userAction } from '../../../state/ducks/login';
import { Login } from './Login';
import * as Yup from 'yup';

export default function LoginContainer() {
    const dispatch = useDispatch();

    const { submitted, authorized, isLoading } = useSelector((state) => ({
        authorized: state.login.authorized,
        submitted: state.login.submitted,
        isLoading: state.login.loading
    }))


    function handleSubmit(loginData) {
         console.log("username" , loginData.username)
        dispatch(userAction.login(loginData.username,  loginData.password))
    }

    const loginSchema = Yup.object().shape({
        username: Yup.string()
            .required('Required'),
        password: Yup.string()
            .required('Required')
    });

console.log("authorizedCredential"  , authorized ,submitted)
    return <Login
        loginSchema={loginSchema}
        handleSubmitForm={handleSubmit}
        submitted={submitted}
        authorizedCredential={authorized}
        isLoading={isLoading}
    />
}
