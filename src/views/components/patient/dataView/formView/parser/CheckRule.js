import React, { useState, useEffect } from 'react'
import { hideParser, autoSelectParser } from './Parser'
import WidgetSelector from '../WidgetSelector'

export default function CheckRule({
    values,
    type: {
        field: { parsedRule, fieldType: { display }, fieldId, answers, name },
        displayText,
        mandatory,
        children
    },
    temType,
    setFieldValue,
    handleChange,
    handleBlur,
    setFieldTouched,
    touched,
    errors,
    country,
    handleAutoSelect,
}) {
    console.log("CheckRule", parsedRule, answers)
    const [visible, setVisible] = useState(true)
    const [autoVal, setAutoVal] = useState(null)
    useEffect(() => {

        if (parsedRule !== null) {
            checkCondition()
        }
    })

    useEffect(() => {
        if (autoVal) setFieldValue(autoVal.name, autoVal.value);
    }, [autoVal]);
    async function checkCondition() {

        let sepression = JSON.parse(parsedRule)
        if (sepression.hiddenWhen !== null && sepression.hiddenWhen !== undefined) {
            let isHide = await hideParser(sepression.hiddenWhen, values, display)
            setVisible(isHide)
        }
        else if (sepression.autoselectWhen !== undefined && autoVal === null) {

            let autoSelectVal = await autoSelectParser(sepression.autoselectWhen, values, display, answers, setFieldValue, fieldId, handleAutoSelect, setFieldTouched)
            console.log("autoSelectVal ", autoSelectVal)
            if (autoSelectVal) {
                setAutoVal(autoSelectVal)
            }

        }

    }

    return (
        <>
            {
                visible ?
                    <WidgetSelector
                        type={temType}
                        setFieldValue={setFieldValue}
                        values={values}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldTouched={setFieldTouched}
                        touched={touched}
                        errors={errors}
                        country={country}
                        handleAutoSelect={handleAutoSelect}
                    />
                    : null
            }
        </>
    )
}
