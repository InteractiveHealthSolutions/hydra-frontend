import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { existsTypeAnnotation } from '@babel/types';
import {BASE_URL} from '../utilities/constants/globalconstants'

export const reportService = {
    downloadReport,downloadDump
}
function downloadReport(params,name,ext) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch(`${BASE_URL}/hydra/report?`+params, requestOptions).then(response=>handleResponse(response,name,ext)
        
    )
       }
	 
function downloadDump(params,name,ext) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch(`${BASE_URL}/hydra/report/dump/`+name+'?'+params, requestOptions).then(response=>handleResponse(response,name,ext)
        
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