import {combineReducers} from 'redux';
import {authentication} from './authenticationreducer';
import {registration} from './registrationreducer';
import {showTab} from './sidebarreducer';
import {workflowreducer} from './workflowreducer';
import {eventplannerreducer} from './eventplannerreducer';
import {formdesignerreducer} from './formdesignerreducer';
import {phasesreducer} from './phasesreducer';
import {ruleenginereducer} from './ruleenginereducer';
import {patientreducer} from './patientreducer';
const rootReducer =  combineReducers({
    authentication,
    registration,
    showTab,
    workflowreducer,
    eventplannerreducer,
    formdesignerreducer,
    phasesreducer,
    ruleenginereducer,
    patientreducer
 });

 export default rootReducer;