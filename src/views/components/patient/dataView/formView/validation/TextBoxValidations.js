import {
    CHECK_DECIMAL
} from '../../../../../../utilities/constants/globalconstants'


export function TextBoxValidation(items, formValues) {
    const fieldName = items.field.fieldId
    const fieldAttributesName = items.field.attributeName
    let resultanErrorMsg = ""
    if (fieldAttributesName === 'Numeric') {
        resultanErrorMsg = numericValidations(items, formValues,fieldName)
    }
    if (fieldAttributesName === 'Text') {
        resultanErrorMsg = textValidations(items, formValues,fieldName)
    }
    return resultanErrorMsg;
}


function numericValidations(items, formValues,fieldName) {
    let errorMsg = "";
    if (items.minValue && items.maxValue) {
        if (
            Number(formValues[fieldName]) > Number(items.minValue)
            && Number(formValues[fieldName]) < Number(items.maxValue)
        ) {
            errorMsg =
                items.errorMessage ? items.errorMessage :
                    "Minimum value should be" + items.minLength + " and Maximum length should be " + items.maxLength
        }
    } else if (items.minValue && Number(formValues[fieldName]) > Number(items.minValue)) {
        errorMsg = items.errorMessage ? items.errorMessage : "Minimum value should be" + items.minValue
    }
    else if (items.maxValue && Number(formValues[fieldName]) < Number(items.maxValue)) {
        errorMsg = items.errorMessage ? items.errorMessage : "Maximum value should be" + items.maxValue
    }

    if (!items.allowDecimal && CHECK_DECIMAL.test(formValues[fieldName])) {
        errorMsg = items.errorMessage ? items.errorMessage : "Decimal value is not allowed"
    }

    return errorMsg;

}

function textValidations(items, formValues,fieldName) {
    let errorMsg = "";
    if (items.minLength && items.maxLength) {
        if (formValues[fieldName].length < items.minLength || formValues[fieldName].length > items.maxLength) {
            errorMsg = "Minimum length should be" + items.minLength + " and Maximum length should be " + items.maxLength
        }
    } else if (items.minLength && formValues[fieldName].length < items.minLength) {
        errorMsg = "Minimum length should be" + items.minLength
    } else if (items.maxLength && formValues[fieldName].length > items.minLength) {
        errorMsg = "Maximum length should be" + items.maxLength
    }

    return errorMsg
}