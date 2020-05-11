import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormView from './FormView'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import { formAction } from '../../../../../state/ducks/form'
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
} from '../../../../../utilities/constants/globalconstants'
import moment from 'moment'

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

  async function submitForm(dataForm) {
    const list = await dataFormat(dataForm)
    const metadata = {
      authentication: {
        USERNAME: localStorage.getItem("username"),
        PASSWORD: localStorage.getItem("password"),
        provider: "be11d2d7-9178-4d59-845e-ac0704fb5adb"
      },
      ENCONTER_TYPE: form.form.encounterType.display,
      workflow: localStorage.getItem("selectedWorkflowId"),
      patient: {
        uuid: currentPatient.uuid,
        gender: currentPatient.gender === 'Male' ? 'M' : 'F',
        givenName: currentPatient.given,
        familyName: currentPatient.familyname,
        identifiers: [
          {
            "type": "MR Number",
            value: currentPatient.identifier
          }
        ]
      },
      formDetails: {
        componentFormId: form.componentFormId,
        uuid: form.uuid
      }
    }
    var formData = {
      data: JSON.stringify(list),
      metadata: JSON.stringify(metadata)
    }
    dispatch(formAction.formSubmission(formData))
  }

  async function dataFormat(dataForm) {
    var formArray = []
    await form.form.formFields.forEach(element => {
      switch (element.field.fieldType.display) {
        case MULTIPLE_CHOICE:
            console.log("dataForm :: ", dataForm[element.field.fieldId])
            formArray.push({
              payload_type: "OBS_CODED_MULTI",
              person_attribute: true,
              param_name: element.field.concept.uuid,
              value: dataForm[element.field.fieldId]
            })
          break;
        case SINGLE_SELECT_DROPDOWN:
          formArray.push({
            payload_type: "OBS_CODED",
            person_attribute: true,
            param_name: element.field.concept.uuid,
            value: dataForm[element.field.fieldId].value
          })
          break;
        case SINGLE_SELECT_RADIOBUTTON:
          formArray.push({
            payload_type: "OBS_CODED",
            person_attribute: true,
            param_name: element.field.concept.uuid,
            value: dataForm[element.field.fieldId]
          })
          break;
        case DATE_TIME_PICKER:
          formArray.push({
            payload_type: "OBS_DATE_TIME",
            person_attribute: true,
            param_name: element.field.concept.uuid,
            value: moment(dataForm[element.field.fieldId]).format('YYYY-MM-DD hh:mm:ss')
          })
          break;
        case AGE:
          formArray.push({
            payload_type: "AGE",
            person_attribute: true,
            param_name: element.field.concept.uuid,
            value: dataForm[element.field.fieldId]
          })
          break;
        case TEXT_BOX:
          if (element.field.attributeName === "Numeric") {
            formArray.push({
              payload_type: "OBS_NUMERIC",
              person_attribute: true,
              param_name: element.field.concept.uuid,
              value: dataForm[element.field.fieldId]
            })
          } else {
            formArray.push({
              payload_type: "OBS",
              person_attribute: true,
              param_name: element.field.concept.uuid,
              value: dataForm[element.field.fieldId]
            })
          }
          console.log("dataForm :: ", dataForm[element.field.fieldId])
          break;
        case ADDRESS:
          // console.log("dataForm :: ", dataForm[element.field.fieldId])
          break;
        case CONTACT_TRACING:
          // console.log("dataForm :: ", dataForm[element.field.fieldId])
          break;
        default:
          break;
      }
    })
    formArray.push(
      {
        param_name: "Date Entered",
        value: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        payload_type: "DATE_ENTERED",
        person_attribute: false
      }
    )
    formArray.push(
      {
        param_name: "location",
        value: "b90fe633-d2f8-47bc-b981-df38b77d9285",
        payload_type: "LOCATION",
        person_attribute: false
      }
    )
    formArray.push(
      {
        param_name: "Form Location GPS Coordinates",
        value: "24.9307738,67.1009169",
        payload_type: "GPS",
        person_attribute: false
      }
    )


    console.log("final Product loop", formArray)
    //setFormatedDataForm(formArray)

    return formArray
  }

  return <FormView
    form={form.form}
    country={country}
    currentPatient={currentPatient}
    submitForm={submitForm}
  />
}
