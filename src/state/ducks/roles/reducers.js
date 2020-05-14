import * as types from './types';

const initialstate = { all_roles: [], role: {}, loading: false ,systemIds: []}

const rolesReducer = (state = initialstate, action) => {
 // console.log('action ' + JSON.stringify(action.type));
  //console.log('action payload ' + JSON.stringify(action.payload));

  switch (action.type) {
    case types.GET_ROLES:
      return {
        allRoles: action.payload,
        loading: false
      }
    case types.SET_PROJECT: return {
      loading: true,
    }
    case types.ADD_ROLES:
      return {
        role: action.payload,
        loading: false
      }
    case types.DELETE_ROLE: 
      return {
        role : action.payload,
        loading : false
      }
    case types.GET_USERS_BY_ROLE:
      return {
        systemIds : action.payload,
        loading : false
      }
    default: return state

  }
}

export default rolesReducer;