import { jsxOpeningElement } from "@babel/types";


export function registrationJSON(user) {
 
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
                  "attributeType": "e97e58ba-6767-446a-b520-827528fae936",
                  "value": user.cnic
                }
            ]
        },
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