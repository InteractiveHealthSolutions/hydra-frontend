
export function editJSON(user) {
    return {
        "person" : {
            "names" : [{
                "givenName" : user.givenname,
                "familyName" : user.familyname
            }],
            "gender" : user.gender,
            "birthdate" : user.birthdate,
            "attributes": [
                 {
                   "attributeType": "03a15595-c156-439c-b1cf-9ccBac38f609",
                   "value": user.cnic
                 }
             ]
        },
        "name": user.givenName,
        "birthdate": user.dateofbirth,
        "username" : user.username,
        "roles" : user.role
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
        "name": user.givenName,
        "birthdate": user.birthdate,
        "username" : user.username,
        "password" : user.password,
        "roles" : user.role
    };
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
         "inheritedRoles" : iRole
    }
}