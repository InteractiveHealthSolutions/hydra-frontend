const initialEventPlannerState = {
    eventPlannerData :[
       {
        eventType: 'Field Trip' , 
        eventName: 'Field Trip' ,
        description : 'Field Trip',
        startDate: '01/10/2019',
        endDate : '01/10/2019',
        locationType: 'Hospital',
        locationName: 'Indus Hospital'
       }
    ]

};

export const eventplannerreducer = (state = initialEventPlannerState , action) => {
         console.log(action.payload);
        switch(action.type){
            case 'SAVE_EVENT':
                return{
                    
                    // ...state,
                    // eventPlannerData: action.payload
                }   
            default: return state;
        }
}
