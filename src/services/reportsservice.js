import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { existsTypeAnnotation } from '@babel/types';
export const reportService = {
    downloadReport
}
function downloadReport(params,name,ext) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/report?'+params, requestOptions).then(response=>handleResponse(response,name,ext)
        
    )
       }

function handleResponse(response,name,ext) {
    return response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = name+'.'+ext;
        a.click();    });
}