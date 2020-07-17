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
        if (items.mandatory && (formValues[fieldName] === "" || formValues[fieldName] === null || formValues[fieldName].length <= 0)) {
            errors[fieldName] = items.errorMessage ? items.errorMessage : "Field is required"
        }
       else {
            switch (fieldTypeDisplayText) {
                case TEXT_BOX:
                      errors[fieldName] = TextBoxValidation(items,formValues)
                    break;
                case BARCODE_READER:       
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

