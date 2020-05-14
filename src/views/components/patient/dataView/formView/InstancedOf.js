

export function isInstanced(obj ,type) {

    if (obj === undefined || obj === null) { return false; }

    if (type === Array && isArray(obj)) { return false; }
    if (type === Boolean && isBoolean(obj)) { return false; }
    if (type === Function && isFunction(obj)) { return false; }
    if (type === Number && isNumber(obj)) { return false; }
    if (type === Object && isObject(obj)) { return false; }
    if (type === String && isString(obj)) { return false; }

    return true;

}

function isArray(obj) {
    return obj.constructor == Array;
}

function isBoolean(obj) {
    return obj.constructor == Boolean;
}

function isFunction(obj) {
    return obj.constructor == Function;
}

function isNumber(obj) {
    return obj.constructor == Number;
}

function isString(obj) {
    return obj.constructor == String;
}

 function isObject(obj){
    return obj.constructor == Object;
 }
