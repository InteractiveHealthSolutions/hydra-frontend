import * as types from './types';

const initialstate = {all_roles : [],role:{}}

const rolesReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
    console.log('action payload '+JSON.stringify(action.payload));

    switch(action.type) {
        case types.GET_ROLES: 
             return {
                allRoles : action.payload 
             }
        case types.ADD_ROLES : 
             return {
               role : action.payload
             }
             default: return state

    }
}

export default rolesReducer;