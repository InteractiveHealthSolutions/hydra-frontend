import { isInstanced } from "./InstancedOf"


export function sExpressionParser(configString) {

    let sepression = JSON.parse(configString)

    if (sepression.hiddenWhen !== undefined) {
       return parseLogic(sepression.hiddenWhen)
    }
    else if (sepression.autoselectWhen !== undefined) {

    }
}

function parseLogic(ruleArray) {
     let operator= ""
     let equalsList =[]
     let questionId ="" 
     let id =""

    for (var i = 0; i < ruleArray.length; i++) {
        questionId = ruleArray[i].questionId
        id = ruleArray[i].id
        if (isInstanced(ruleArray[i], String)) {
            operator = ruleArray[i]
        } else if (isInstanced(ruleArray[i],Object)) {
            for (var j = 0; j < ruleArray[i].equals.length; j++) {
                equalsList.push({
                    uuid: ruleArray[i].equals[j].uuid
                })
            }
        }
    }

    return logicChecker(operator, equalsList)
    
}

function logicChecker(operator ,){
  
    if(operator ==="OR"){

    }else if(operator === "AND"){

    }else if(operator === "lessThan"){

    }else if(operator === "greaterThan"){

    }
    
  return true
}

function autoSelectParse(ruleArray) {
    let targetFieldAnswer = ""
    for (var i = 0; i < ruleArray.length; i++) {
        targetFieldAnswer = ruleArray[i].targetFieldAnswer
         parseLogic(ruleArray[i].when)
    }
}


