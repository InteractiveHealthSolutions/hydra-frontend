import * as yup from "yup";

export function CreateYupSchema(schema, config) {
    console.log("CreateYupSchema", config)
    const { field: { fieldId }, mandatory, validationType, validations = [] } = config;
    console.log("", validations)
    if (!yup[validationType]) {
        return schema
    }
    let validator = yup[validationType]();
    validations.forEach(validation => {
        const { params, type } = validation;
        if (!validator[type]) {
            return;
        }
        console.log(type, params);
        validator = validator[type](...params);
    });
    schema[fieldId] = validator;
    return schema;
}

export function FormValidation(questionList, formValues){
   const errors = {}
   questionList.forEach(items => {
        const fieldName = items.field.fieldId
        console.log("Form-Field",items.mandatory, fieldName,formValues[fieldName])
        if(items.mandatory && (formValues[fieldName] === "" || formValues[fieldName] === null )){
                errors[fieldName] = items.errorMessage?items.errorMessage :"Field is required"
        }
    })  

    return errors
}

