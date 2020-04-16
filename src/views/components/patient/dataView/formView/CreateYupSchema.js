import * as yup from "yup";

export function CreateYupSchema(schema, config) {
    console.log("CreateYupSchema", config)
    const { field: { fieldId }, mandatory, validationType, validations = [] } = config;
    console.log("", validations)
    if (!yup[validationType]) {
        return schema[fieldId] = mandatory ? "required" : "";
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

