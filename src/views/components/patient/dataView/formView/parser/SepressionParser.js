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

export async function sExpressionParser(configString, values, type) {

    let sepression = JSON.parse(configString)
    if (sepression.hiddenWhen !== null && sepression.hiddenWhen !== undefined) {
        let isHide = await parseLogic(sepression.hiddenWhen, values, type)
        return isHide
    }
    else if (sepression.autoselectWhen !== undefined) {

    }
}

function parseLogic(ruleArray, values, type) {
    var operator = ""
    var ruleFormatData = {}
    var ruleVal = []
    for (var i = 0; i < ruleArray.length; i++) {
        const element = ruleArray[i]
        if (typeof element == "string") {
            operator = element
        } else if (typeof element == "object") {
            const questionId = element.questionId
            const val = getTypeValue(values, questionId, type)
            ruleVal.push({
                questionId: element.questionId,
                value: val,
                rule: element
            })
        }
    }

    ruleFormatData = {
        operator: operator,
        data: ruleVal
    }

    return logicChecker(ruleFormatData)
}

function logicChecker(ruleList) {
    if (ruleList.operator === "OR") {
        // check one by one 
        for (let index = 0; index < ruleList.data.length; index++) {
            const element = ruleList.data[index].rule;
            const val = ruleList.data[index].value
            //console.log("logicChecker", element, val)
            let orCondition = orLogic(element, val);
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
            //console.log("logicChecker", element, val)
            let orCondition = orLogic(element, val);
            if (!orCondition) {
                return false
            }
        }

        return true
    }
    return false
}

function orLogic(element, value) {

    if (element.notEquals !== null && element.notEquals !== undefined) {
        return element.notEquals.filter(data => data.uuid !== value).length > 0  //is contain (value !== element.notEquals[0].uuid)
    } else if (element.equals !== null && element.equals !== undefined) {
        return element.equals.filter(data => data.uuid === value).length > 0
    }

    else if (element.equalTo !== null && element.equalTo !== undefined) { //numeric values  
        return (value === element.equals[0].uuid)
    }
    else if (element.notEqualTo !== null && element.equalTo !== undefined) {
        return (value === element.equals[0].uuid)
    }
    else if (element.lessThan !== null && element.equalTo !== undefined) {
        return element.equals.filter(data => data.uuid < value).length > 0
    }
    else if (element.greaterThan !== null && element.equalTo !== undefined) {
        return element.equals.filter(data => data.uuid > value).length > 0
    }

}

function andLogic(element, questionId) {

}

function getTypeValue(values, questionId, type) {
    //console.log("orLogic inside ", questionId, type, values["" + questionId].label)
    switch (type) {
        case TEXT_BOX:
            // console.log("orLogic inside " , values["" + questionId + ""])
            return values["" + questionId + ""]
        case SINGLE_SELECT_DROPDOWN:
            //console.log("orLogic inside sel ",questionId ,values[""+questionId])
            return values["" + questionId + ""].label
        case SINGLE_SELECT_RADIOBUTTON:
            // console.log("orLogic inside radio ", questionId, values["" + questionId])
            return values["" + questionId + ""].label
    }

}

function autoSelectParse(ruleArray) {
    let targetFieldAnswer = ""
}


