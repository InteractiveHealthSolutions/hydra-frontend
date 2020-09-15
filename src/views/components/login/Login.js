import React from 'react';
import './css/login.css'
import './css/util.css'
import './css/main-login.css'
import './css/animate.css'
import { Form, Formik } from 'formik';

export const Login = ({
    loginSchema,
    handleSubmitForm,
    isLoading,
    authorizedCredential,
    submitted
}) => (
        <>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <div className={(isLoading) ? "login100-pic rotate" : "login100-pic"}>
                            <img src={require('../../../assets/logo.png')} alt="IMG" />
                        </div>
                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            validationSchema={loginSchema}
                            validateOnChange={false}
                            validateOnBlur={false}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmitForm(values)
                                // resetForm({})
                            }}

                        >{({
                            values,
                            errors,
                            handleChange,
                            handleSubmit
                        }) => (
                                <Form
                                    className="login100-form validate-form"
                                    onSubmit={handleSubmit}
                                >
                                    <span className="login100-form-title">Sign In</span>
                                    <div className="wrap-input100 ">
                                        <input
                                            className="input100"
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            onChange={handleChange}
                                        />
                                        <span className="focus-input100"></span>
                                        <span className="symbol-input100">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    {errors.username ? <span className="help-block error_spn">Username is required</span> : ""}
                                    <div className="wrap-input100 extra-margin" >
                                        <input
                                            className="input100"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={handleChange}
                                        />
                                        <span className="focus-input100"></span>
                                        <span className="symbol-input100">
                                            <i className="fa fa-lock" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    {errors.password ? <span className="help-block error_spn">Password is required</span> : ""}
                                    <div className="container-login100-form-btn">
                                        {(authorizedCredential === false && submitted) ?
                                            (<div className="help-block error_spn">Invalid Credentials</div>)
                                            : ""
                                        }
                                        <button className={isLoading ? "login100-form-btn disabled_btn" : "login100-form-btn"} disabled={isLoading} >Login</button>
                                    </div>
                                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                    <div className="text-center p-t-136">
                                        <label className="txt2"> Powered by </label>
                                        <a href="http://www.ihsinformatics.com/"><b style={{ fontSize: '12px' }}> IHS</b></a>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
