import {formdesignerconstants} from '../../utilities/constants';

const initialFormDesignState = {
    propData :[
       {
        dataName: 'Data Name' , 
        labelName: 'Label name' ,
        defaultValue : 'Default value',
        required: false,
        fieldLength : '0',
        showQuestion: '',
        errorMessage: ''
       }
    ]

};

export const formdesignerreducer  = (state = initialFormDesignState , action) => {
    console.log(action.payload);
    switch(action.type){
        case formdesignerconstants.SAVE:
            return{
                ...state,
                propData: action.payload
            }   
        default: return state;
    }
}