

export function AddressValidation(items, formValues) {
    const fieldName = items.field.fieldId
    const errors = {}

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

    return errors;
}