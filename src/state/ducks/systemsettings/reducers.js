import * as types from './types';

const initialstate = {systemSettings : {} , systemSetting : {}}

const systemSettingsReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
    console.log('concept '+JSON.stringify(action.payload))
    switch(action.type) {
        case types.GET_GLOBAL_PROPERTIES : 
             return {
                systemSettings : action.payload 
             }
        case types.GET_GLOBAL_PROPERTY_BY_UUID : 
             return {
                 systemSetting : action.payload
             }
        case types.POST_GLOBAL_PROPERTY : 
             return {
                 systemSetting : action.payload
             }
        case types.PUT_GLOBAL_PROPERTY : 
             return {
                 systemSetting : action.payload
             }
        default: return state

    }
}

export default systemSettingsReducer;