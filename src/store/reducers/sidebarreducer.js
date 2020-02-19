import {sidebarConstants} from '../../utilities/constants';

const initialState = {home : true , findPatient : false , registerPatient : false ,
                      reports : false , systemAdmin : false , dataManagement : false,
                      events : false , workflow : false};

export const showTab =(state = initialState , action) => {
    switch(action.type) {
        case sidebarConstants.SHOW_HOME :
          return {
            home : true , findPatient : false , registerPatient : false ,
            reports : false , systemAdmin : false , dataManagement : false,
            events : false , workflow : false
          }
        case sidebarConstants.SHOW_REGISTER_PATIENT :
          return {
            home : false , findPatient : false , registerPatient : true ,
            reports : false , systemAdmin : false , dataManagement : false,
            events : false , workflow : false
          };
        case sidebarConstants.SHOW_FIND_PATIENT :
          return {
            home : false , findPatient : true , registerPatient : false ,
            reports : false , systemAdmin : false , dataManagement : false,
            events : false , workflow : false
          };
        case sidebarConstants.SHOW_REPORTS :
          return {
            home : false , findPatient : false , registerPatient : false ,
            reports : true , systemAdmin : false , dataManagement : false,
            events : false , workflow : false
          };
        case sidebarConstants.SHOW_SYSTEM_ADMIN :
          return {
            home : false , findPatient : false , registerPatient : false ,
            reports : false , systemAdmin : true , dataManagement : false,
            events : false , workflow : false
          };
        case sidebarConstants.SHOW_DATA_MANAGEMENT :
          return {
            home : false , findPatient : false , registerPatient : false ,
            reports : false , systemAdmin : false , dataManagement : true,
            events : false , workflow : false
          }
        case sidebarConstants.SHOW_EVENTS :
          return {
            home : false , findPatient : false , registerPatient : false ,
            reports : false , systemAdmin : false , dataManagement : false,
            events : true , workflow : false
          };
        case sidebarConstants.SHOW_WORKFLOW :
          return {
            home : false , findPatient : false , registerPatient : false ,
            reports : false , systemAdmin : false , dataManagement : false,
            events : false , workflow : true
          };
        default :
          return state;
    }
}