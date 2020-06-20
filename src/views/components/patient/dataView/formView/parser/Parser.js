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
    ADDRESS
} from '../../../../../../utilities/constants/globalconstants'

//need to refactor 
export async function hideParser(sepression, values, type) {
    let isHide = await parseLogic(sepression, values, type)
    return isHide
}

export async function autoSelectParser(sepression, values, type, answers, setFieldValue, name, handleAutoSelect, setFieldTouched) {
    let targetFieldAnswer = ""
    let whenList = []
    for (let index = 0; index < sepression.length; index++) {
        const element = sepression[index];
        targetFieldAnswer = element.targetFieldAnswer
        whenList = element.when
    }
    console.log("isAutoSelectAble", whenList)
    let isAutoSelectAble = await parseLogic(whenList, values, type)
    console.log("isAutoSelectAble", isAutoSelectAble)
    if (isAutoSelectAble) {
        //find the concept against the values 
        let val = ""
        val = await answers ? answers.filter(element => element.concept.display === targetFieldAnswer) : null
        return {
            name, value: {
                label: val[0].concept.display,
                value: val[0].concept.uuid
            }
        }
        // // console.log("isAutoSelectAble", val[0].concept.uuid)
        // if (val) {
        //     console.log("isAutoSelectAble d", val[0].concept.display)
        //     handleAutoSelect(name, {
        //         label: val[0].concept.display,
        //         value: val[0].concept.uuid
        //     },
        //     setFieldValue,
        //     setFieldTouched
        //     )
        //     // setFieldValue(name, val[0].concept.uuid)
        // } else {
        //     console.log("isAutoSelectAble", val[0].concept.display)
        //     handleAutoSelect(name, null,setFieldValue,setFieldTouched)
        // }
    }
    return null
}


function parseLogic(ruleArray, values, type) {
    var operator = ""
    var ruleFormatData = {}
    var ruleVal = []
    for (var i = 0; i < ruleArray.length; i++) {
        const element = ruleArray[i]
        console.log("hide Parser", element)

        if (typeof element == "string") {
            operator = element
        } else if (typeof element == "object") {
            //const questionId = element.questionId
            const val = values["" + element.questionId + ""]   //getTypeValue(values, questionId, type)
            const displayLabel = val ? val.split("#")[1] : "";
            //console.log("getTypeValue vaue", displayLabel)

            ruleVal.push({
                questionId: element.questionId,
                value: displayLabel,
                rule: element
            })
        }
    }

    ruleFormatData = {
        operator: operator,
        data: ruleVal
    }
    console.log("getTypeValue", ruleFormatData)
    return logicChecker(ruleFormatData)
}

function logicChecker(ruleList) {
    if (ruleList.operator === "OR") {
        // check one by one 
        if (ruleList.data.length <= 0) {
            return true
        }
        for (let index = 0; index < ruleList.data.length; index++) {
            const element = ruleList.data[index].rule;
            const val = ruleList.data[index].value
            // console.log("logicChecker", element, val)
            let orCondition = orLogic(element, val);
            console.log("logicChecker f", orCondition)
            if (orCondition) {
                return true
            }
        }
        return false
    }
    else if (ruleList.operator === "AND") {
        for (let index = 0; index < ruleList.data.length; index++) {
            const element = ruleList.data[index].rule;
            const val = ruleList.data[index].value
            // console.log("logicChecker", element, val)
            let orCondition = orLogic(element, val);
            if (!orCondition) {
                return false
            }
        }

        return true
    }
}

function orLogic(element, value) {

    console.log("typeof orLogic ", value ? element.equals.filter(data => data.uuid === value).length > 0 : true)
    switch (typeof value) {
        case "string":
            console.log("typeof str", value)
        case "object":
            console.log("typeof object", value.label ? value.label : value[0])
    }
    if (element.notEquals !== null && element.notEquals !== undefined) {
        switch (typeof value) {
            case "string":
                return value ? element.notEquals.filter(data => data.uuid !== value).length > 0 : false  //is contain (value !== element.notEquals[0].uuid)
            case "object":
                return value ? element.notEquals.filter(data => {
                    return value.label ? data.uuid !== value.label :
                        value.filter(item => item !== data.uuid)
                }).length > 0 : false
        }

    } else if (element.equals !== null && element.equals !== undefined) {
        // return value ? element.equals.filter(data => data.uuid === value).length > 0 : false
        switch (typeof value) {
            case "string":
                return value ? element.equals.filter(data => data.uuid === value).length > 0 : true  //is contain (value !== element.notEquals[0].uuid)
            case "object":
                return value ? element.equals.filter(data => {
                    return value.label ? data.uuid === value.label :
                        value.filter(item => item === data.uuid)
                }).length > 0 : true
        }
    }

    else if (element.equalTo !== null && element.equalTo !== undefined) { //numeric values  
        return (value === element.equals[0].uuid)
    }
    else if (element.notEqualTo !== null && element.equalTo !== undefined) {
        return (value === element.equals[0].uuid)
    }
    else if (element.lessThan !== null && element.equalTo !== undefined) {
        return value ? element.equals.filter(data => data.uuid < value).length > 0 : false
    }
    else if (element.greaterThan !== null && element.equalTo !== undefined) {
        return value ? element.equals.filter(data => data.uuid > value).length > 0 : false
    }

}

function andLogic(element, questionId) {

}

function getTypeValue(values, questionId, type) {
    console.log("orLogic inside ", questionId, type, values["" + questionId])
    switch (type) {
        case TEXT_BOX:
            // console.log("orLogic inside " , values["" + questionId + ""])
            return values["" + questionId + ""]
        case SINGLE_SELECT_DROPDOWN:
            return values["" + questionId + ""].label
        case SINGLE_SELECT_RADIOBUTTON:
            return values["" + questionId + ""]
        case MULTIPLE_CHOICE:
            return values["" + questionId + ""]
    }

}



