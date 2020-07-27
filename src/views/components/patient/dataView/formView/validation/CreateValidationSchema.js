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
    BARCODE_READER,
    CHECK_DECIMAL
} from '../../../../../../utilities/constants/globalconstants'
import { TextBoxValidation } from "./TextBoxValidations";
import { AddressValidation } from "./AddressValidations";
import { DateTimeValidation } from "./DateTimeValidations";

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
        const fieldAttributesName = items.field.attributeName

        console.log("Form Value :: " ,items.allowFutureDate,items.allowPastDate , fieldName , items.mandatory, formValues[fieldName] )
        if (items.mandatory &&
            (formValues[fieldName] === "" ||
                formValues[fieldName] === null ||
                formValues[fieldName].length <= 0)) {
             errors[fieldName] = items.errorMessage ? items.errorMessage : "Field is required"
        }
        else {
            console.log("Text Box :" ,formValues ,fieldTypeDisplayText)
            switch (fieldTypeDisplayText) {
                case TEXT_BOX:
                    errors[fieldName] = TextBoxValidation(items, formValues)
                    break;
                case BARCODE_READER:
                    errors[fieldName] = TextBoxValidation(items, formValues)
                    break;
                case SINGLE_SELECT_DROPDOWN:
                    break;
                case MULTIPLE_CHOICE:
                    break;
                case DATE_TIME:
                    errors[fieldName]  = DateTimeValidation(items, formValues)
                    break;
                case AGE:
                    break;
                case CONTACT_TRACING:
                    break;
                case ADDRESS:
                    errors = AddressValidation(items, formValues)
                    break;

            }
        }
    })

    return errors
}
