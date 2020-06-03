
export function editJSON(user) {
    return {
        "person" : {
            "names" : [{
                "givenName" : user.givenname,
                "familyName" : user.familyname
            }],
            "gender" : user.gender,
            "birthdate" : user.dateofbirth,
            "attributes": [
                 {
                   "attributeType": "03a15595-c156-439c-b1cf-9ccBac38f609",
                   "value": user.cnic
                 }
             ]
        },
        "name": user.givenName,
        "username" : user.username,
        "roles" : user.role,
        "systemId" : user.systemId
    };
}
export function editUserJSONWithPassword(user) {
 
    return {
        "person" : {
            "names" : [{
                "givenName" : user.givenname,
                "familyName" : user.familyname
            }],
            "gender" : user.gender,
            "birthdate" : user.dateofbirth,
            "attributes": [
                 {
                   "attributeType": "03a15595-c156-439c-b1cf-9ccBac38f609",
                   "value": user.cnic
                 }
             ]
        },
        //"name": user.givenName,
        "username" : user.username,
        "password" : user.password,
        "roles" : user.role,
        "systemId" : user.systemId
    };
}
export function registrationJSON(user) {
 
    return {
        "person" : {
            "names" : [{
                "givenName" : user.givenname,
                "familyName" : user.familyname
            }],
            "gender" : user.gender,
            "birthdate" : user.dateofbirth,
            "attributes": [
                 {
                   "attributeType": "03a15595-c156-439c-b1cf-9ccBac38f609",
                   "value": user.cnic
                 }
             ]
        },
        //"name": user.givenName,
        "username" : user.username,
        "password" : user.password,
        "roles" : user.role
    };
}
export function personJSON(gender , givenName , familyName , dateofbirth,age) {
    if(dateofbirth != "" & age=="") {
        return {
            "gender": gender, 
            "names": [
                {"givenName":givenName, "familyName":familyName}
            ],
            "birthdate" : dateofbirth,
        }
    }
    else if(age != "" & dateofbirth == "") {
        return {
            "gender": gender, 
            "names": [
                {"givenName":givenName, "familyName":familyName}
            ],
            "age" : age
        }
    }
    else {
        return {
            "gender": gender, 
            "names": [
                {"givenName":givenName, "familyName":familyName}
            ],
            "birthdate" : dateofbirth,
            "age" : age
        }
    }
 
}
export function providerJSON(person,systemId)
{
    return {
            "name" : person.display,
            "person" : person.uuid,
            "identifier" : systemId
    }
}

export function roleJSON(role) {
    console.log('in role '+JSON.stringify(role));
    let iRole = [];

    if(role.selectedIRoles) {
        role.selectedIRoles.forEach(element => {
           iRole.push({
               "name" : element.label
           }) 
        });
    }
    let priv = [] ;

    if(role.selectedPriviliges) {
        role.selectedPriviliges.forEach(element => {
           priv.push({
               "name" : element.label,
               "description" : element.value
           })
        })
    }
    
    return {
        "name" : role.name,
        "description" : role.description,
        "privileges" : priv,
         "inheritedRoles" : iRole,
         "retired" : role.retire
    }
}