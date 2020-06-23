import * as yup from "yup";
import {
    NUMERIC,
    CODED,
    TEXT,
    DATE_TIME,
    CONTACT_TRACING,
    DATE_TIME_PICKER,
    TEXT_BOX,
    SINGLE_SELECT_DROPDOWN,
    MULTIPLE_CHOICE,
    SINGLE_SELECT_RADIOBUTTON,
    HEADING,
    AGE,
    ADDRESS,
    BARCODE_READER
} from '../../../../../../utilities/constants/globalconstants'

export function CreateYupSchema(schema, config) {
    //console.log("CreateYupSchema", config)
    const { field: { fieldId }, mandatory, validationType, validations = [] } = config;
    // console.log("", validations)
    if (!yup[validationType]) {
        return schema
    }
    let validator = yup[validationType]();
    validations.forEach(validation => {
        const { params, type } = validation;
        if (!validator[type]) {
            return;
        }
        //  console.log(type, params);
        validator = validator[type](...params);
    });
    schema[fieldId] = validator;
    return schema;
}

export function FormValidation(questionList, formValues) {
    const errors = {}
    questionList.forEach(items => {
        const fieldName = items.field.fieldId
        const fieldType = items.field.attributeName
        const fieldTypeDisplayText = items.field.fieldType.display
        // console.log("Form-Field", items.mandatory, fieldName, formValues[fieldName])
        if (items.mandatory && (formValues[fieldName] === "" || formValues[fieldName] === null || formValues[fieldName].length <= 0)) {
            errors[fieldName] = items.errorMessage ? items.errorMessage : "Field is required"
        }
        // console.log("Text Validation :: ", fieldTypeDisplayText)
        if (formValues[fieldName]) {
            switch (fieldTypeDisplayText) {
                case TEXT_BOX:
                    // after implement all cases should do refactor cycle .
                    console.log("Text Validation", items.regix, formValues[fieldName])
                    if (items.minLength && items.maxLength) {
                        if (formValues[fieldName].length < items.minLength || formValues[fieldName].length > items.maxLength) {
                            errors[fieldName] = "Minimum length should be" + items.minLength + " and Maximum length should be " + items.maxLength
                        }
                    } else if (items.minLength && formValues[fieldName].length < items.minLength) {
                        errors[fieldName] = "Minimum length should be" + items.minLength
                    } else if (items.maxLength && formValues[fieldName].length > items.minLength) {
                        errors[fieldName] = "Maximum length should be" + items.maxLength
                    }
                    if (items.regix) {
                        var rex = new RegExp(items.regix);
                        if (!rex.test(formValues[fieldName])) {
                            errors[fieldName] = "Your input value is not valid"
                        }
                    }


                    break;
                case BARCODE_READER:
                    // console.log("Barcode Reader ff ", items.minValue, items.maxValue)
                    if (items.minValue && items.maxValue) {
                        if (
                            Number(formValues[fieldName]) > Number(items.minValue)
                            && Number(formValues[fieldName]) < Number(items.maxValue)
                        ) {
                            errors[fieldName] = "Minimum value should be" + items.minLength + " and Maximum length should be " + items.maxLength
                        }
                    } else if (items.minValue && Number(formValues[fieldName]) > Number(items.minValue)) {
                        errors[fieldName] = "Minimum value should be" + items.minValue
                    }
                    else if (items.maxValue && Number(formValues[fieldName]) < Number(items.maxValue)) {
                        errors[fieldName] = "Maximum value should be" + items.maxValue
                    }
                    //check allow decimal                    
                    break;
                case SINGLE_SELECT_DROPDOWN:
                    break;
                case MULTIPLE_CHOICE:
                    break;
                case DATE_TIME:

                    break;
                case AGE:

                    break;
                case CONTACT_TRACING:

                    break;
                case ADDRESS:
                    if (formValues[fieldName + "-country"] === "") {
                        errors[fieldName + "-country"] = items.errorMessage ? items.errorMessage : "Field is required"
                    }
                    if (formValues[fieldName + "-province"] === "") {
                        errors[fieldName + "-province"] = items.errorMessage ? items.errorMessage : "Field is required"
                    }
                    if (formValues[fieldName + "-city"] === "") {
                        errors[fieldName + "-city"] = items.errorMessage ? items.errorMessage : "Field is required"
                    }
                    if (formValues[fieldName + "-address"] === "") {
                        errors[fieldName + "-address"] = items.errorMessage ? items.errorMessage : "Field is required"
                    }
                    break;

            }
        }
    })


    return errors
}

function checkTypeValidation() {

}

