import { userConstants } from '../../utilities/constants'
import { userService } from '../../services';
import { providerJSON } from '../../utilities/helpers';
import { history } from '../../history'
import { registrationJSON } from '../../utilities/helpers'


export const userActions = {
    login,
    logout,
    register
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.logInService(username, password)
            .then(
                user => {
                    if (user === 'authorized') {
                        console.log('user ' + JSON.stringify(user))
                        const username = localStorage.getItem('username');
                        dispatch(success(username));
                        history.push("/");
                    }
                    else {
                        console.log('here');
                        dispatch(failure(username));
                        // history.push("/login");
                        // window.location.reload();
                    }
                }
            );

    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } };
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } };
    function failure(user) { return { type: userConstants.LOGIN_FAILURE, user } };
}

function register(user) {
    const userJSON = registrationJSON(user);
    return dispatch => {
        dispatch(request(user));
        userService.registrationService(userJSON)
            .then(userCreated => {
                if (userCreated) {
                    if (user.provider === 'yes') {
                        const providerjson = providerJSON(userCreated.person, userCreated.systemId);
                        userService.addProviderService(providerjson);
                    }
                    dispatch(success(userCreated));

                    alert("User Successfully Registered!");
                    //history.push("/");

                }
            },
                error => {
                    dispatch(failure(error.toString()));
                    //alert(error);
                });
    };

    function request(user) { return { type: userConstants.REGISTRATION_REQUEST, user } };
    function success(user) { return { type: userConstants.REGISTRATION_SUCCESS, user } };
    function failure(error) { return { type: userConstants.REGISTRATION_FAILURE, error } };
}

function logout() {

    userService.logOutService();
    history.push('/login');

    return { type: userConstants.LOGOUT };
}



