import {userConstants} from '../../utilities/constants';

//to check if the user is logged in or not

let user = localStorage.getItem('username');
const initialState = user ? { loggedIn: true, user ,authorized : true} : {};
export const authentication = (state = initialState , action) => {

    switch (action.type) {
        case userConstants.LOGIN_REQUEST :
         return {
            loggedIn : true ,
            user ,
            authorized : true
         };
        case userConstants.LOGOUT :
         return {
            loggedIn : false,
            authorized : false
         };
         case userConstants.LOGIN_SUCCESS:
         return {
            loggedIn: true,
            user: action.user,
            authorized : true
        };
        case userConstants.LOGIN_FAILURE :
         return {
             loggedIn : false,
             user,
             authorized : false
         };
         default : return state;
    }
      
}
// export const logIn = (state = initialState , action) => {

//     if(action.type === userConstants.LOGIN_REQUEST) {
//         return {
            
//         }
//     }
//     return state;
// };

// export const logOut = (state = initialState , action) => {
 
//     if(action.type === userConstants.LOGOUT) {
//         return {};
//     }
//     return state;
// };

