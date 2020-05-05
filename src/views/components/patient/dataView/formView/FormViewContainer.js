import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormView from './FormView'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import {formAction} from '../../../../../state/ducks/form'
export default function FormViewContainer() {
    const form = JSON.parse(localStorage.getItem("form"))
    const currentPatient = JSON.parse(localStorage.getItem("active-patient"));
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(systemSettingsAction.getSystemSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1'))
        
    }, [])

    const { country } = useSelector((state) => ({
        country: state.systemSettings.systemSetting

    }))

    console.log("currentPatient :: "  , form)

    function submitForm(dataForm){
      


       const data = [
             {
               param_name: "Date Entered",
               value: "2020-05-04 00:00:00",
               payload_type: "DATE_ENTERED",
               person_attribute: false
             },
             {
               param_name: "location",
               value: "b90fe633-d2f8-47bc-b981-df38b77d9285",
               payload_type: "LOCATION",
               person_attribute: false
             },
             {
               param_name: "Form Location GPS Coordinates",
               value: "24.9307738,67.1009169",
               payload_type: "GPS",
               person_attribute: false
             },
             {
               payload_type: "OBS_CODED",
               person_attribute: true,
               param_name: "91871b69-a510-41e7-9e64-d2d14fd96cdf",
               value: "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
             }
       ]
       
       const  metadata= {
            authentication:{
                USERNAME: localStorage.getItem("username"),
                PASSWORD: localStorage.getItem("password"),
                provider: "be11d2d7-9178-4d59-845e-ac0704fb5adb"              
            },
            ENCONTER_TYPE: form.encounterType.display,
            workflow: localStorage.getItem("selectedWorkflowId"),
            patient:{
                uuid: currentPatient.uuid,
                gender: currentPatient.gender ==='Male'? 'M':'F',
                givenName: currentPatient.given,
                familyName: currentPatient.familyname,
                identifiers: [
                {
                    "type": "MR Number",
                     value:currentPatient.identifier 
                }
                ]
            },
            formDetails:{
                componentFormId: form.componentFormId,
                uuid: form.uuid
            }
        }

      var form = {
            data: JSON.stringify(data),
            metadata: JSON.stringify(metadata)
        }
       console.log(form)

      // dispatch(formAction.formSubmission(form))
    }

    return <FormView
        form={form.form}
        country={country}
        currentPatient= {currentPatient}
        submitForm = {submitForm}
    />
}
