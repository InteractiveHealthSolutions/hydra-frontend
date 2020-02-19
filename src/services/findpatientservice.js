import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';
import moment from 'moment'

export const findpatientservice = {
    getAllPatients,
    savePatient,
    getSearchPatient
}

function getAllPatients() {

}

function getSearchPatient(query) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/patient?v=full&q=' + query, requestOptions)
        .then(handleResponse).then(patientData => {
            return filterPatient(patientData);
        }).catch(err => {
            console.log("Error :: ",err)
        });
}

function filterPatient(patientData) {
    let filteredPatient = [];
    patientData.results.forEach(element => {
        console.log("element patient  :: ",JSON.stringify(element))
        filteredPatient.push({
            "identifier":element.identifiers[0].identifier,
            "given":element.person.preferredName.givenName,
            "middle":element.person.preferredName.middleName,
            "familyname":element.person.preferredName.familyName,
            "age":element.person.age,
            "gender":element.person.gender,
            "birthday":element.person.birthdate !=null?moment(element.person.birthdate).format('YYYY-MM-DD'):"",
            "deathdate":element.person.deathDate !=null?moment(element.person.deathDate).format('YYYY-MM-DD'):"",
            "uuid" : element.uuid
        });
    });
    return filteredPatient;
}

function savePatient(component) {

}


function handleResponse(response) {
    if(!response.ok){
        throw Error(response.statusText +" - "+response.url)
    }
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                userService.logOutService();
                history.push('/login');
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}