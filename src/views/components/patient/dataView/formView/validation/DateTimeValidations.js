import moment from 'moment';

export function DateTimeValidation(items, formValues) {

    //  allowFutureDate , allowPastDate
    const fieldName = items.field.fieldId
    
    let resultanErrorMsg = ""
    if(items.allowFutureDate && items.allowPastDate){
        resultanErrorMsg =  "";
    } 
    else if (!items.allowFutureDate && !items.allowPastDate) {
        resultanErrorMsg = "Only current Date is allow";
    }
    else if (items.allowFutureDate &&
        (new Date() > new Date(moment(formValues[fieldName]).format('YYYY-MM-DD')))
    ) {
        resultanErrorMsg = "Past Date is not allow";
    }
    else if (items.allowPastDate  &&
        (new Date() < new Date(moment(formValues[fieldName]).format('YYYY-MM-DD')))
        
        ) {
        resultanErrorMsg = "Future Date is not allow";
    }
    console.log("Date Time" , resultanErrorMsg)

    return resultanErrorMsg;
}
