import {userConstants} from '../../utilities/constants';

const initialState = {registered : false , inProgress : false , message : ''};

export const registration = (state=initialState, action) => {
    switch(action.type) {
        case userConstants.REGISTRATION_REQUEST :
             return {inProgress : true};
        case userConstants.REGISTRATION_SUCCESS :
             return {
                 registered : true ,
                 inProgress : false
            };
        case userConstants.REGISTRATION_FAILURE : 
             return {
                registration : false,
                inProgress : false,
                message : action.error
             };
        default : return state;
    }
}