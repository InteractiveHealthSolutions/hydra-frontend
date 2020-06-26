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
  const [numberOfContact, setNumberOfContact] = useState([])
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

    console.log("format-Data", list)
    var formData = {
      data: JSON.stringify(list),
      metadata: JSON.stringify(metadata)
    }

  // dispatch(formAction.formSubmission(formData))
  
  }

  async function dataFormat(dataForm) {
    var formArray = []
    await form.form.formFields.forEach(element => {
      switch (element.field.fieldType.display) {
        case MULTIPLE_CHOICE:
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
            value: dataForm[element.field.fieldId].split("#")[0]
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
          formArray.push({
            payload_type: "ADDRESS",
            person_attribute: true,
            param_name: element.field.uuid,
            value: {
              Country: dataForm[element.field.fieldId + "-country"].value,
              "City/Village": dataForm[element.field.fieldId + "-province"].value,
              "Province/State": dataForm[element.field.fieldId + "-city"].value,
              address2: dataForm[element.field.fieldId + "-address"],
              address3: dataForm[element.field.fieldId + "-landmark"]
            }
          })
          break;
        case CONTACT_TRACING:
          formArray.push({
            payload_type: "CONTACT_TRACING",
            person_attribute: false,
            param_name: "ContactRegistry",
            createPatient: element.createPatient,
            numberOfPeople: parseInt(dataForm[element.field.name]),
            value: contactTracingDataFormat(
              dataForm['Contact Tracing'],
              element.field.fieldId,
              element.children,
              dataForm
            )
          })
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

    //console.log("final Product loop", formArray)
    //setFormatedDataForm(formArray)

    return formArray
  }

  function contactTracingDataFormat(numberOfContact, field, children, dataForm) {
    let numberOfContactArr = []
    let ageVal = ""
    let genderVal = ""
    let firstNameVal = ""
    let familyNameVal = ""
    let identifierVal = ""
    let relationshipVal = ""
    var i;
    for (i = 1; i <= numberOfContact; i++) {
      children.forEach((element, index) => {
        if (index < 6) {
          switch (element.field.uuid) {
            case "73e557b7-0be7-4e96-b1f2-11c39534ec29":
              ageVal = moment(dataForm[field + "-dob-" + i]).format('MM/DD/YY')
              break;

            case "73eb7357-7eb0-4e96-b1f2-11c39534ec29":
              genderVal = dataForm[field + "-gender-" + i]
              break;

            case "73e557b7-7eb0-4e96-2f1b-11c39534ec29":
              firstNameVal = dataForm[field + "-firstName-" + i]
              break;

            case "73e557b7-7eb0-4e96-b1f2-11c39534e92c":
              familyNameVal = dataForm[field + "-familyName-" + i]
              break;

            case "37e557b7-7eb0-4e96-b1f2-11c395ec4329":
              identifierVal = dataForm[field + "-identifier-" + i]
              break;

            case "37e557b7-0be7-4e96-b1f2-11c395ec4329":
              relationshipVal = dataForm[field + "-relationship-" + i]
              break;
          }
        }
      });
      numberOfContactArr.push({
        age: "",
        dob: ageVal,
        gender: genderVal,
        patientGivenName: firstNameVal,
        patientFamilyName: familyNameVal,
        patientID: identifierVal,
        relation: relationshipVal
      })
    }
    return numberOfContactArr
  }


  // const [reload, setReload] = useState(true)
  // const [initialValues ,setInitialValues]=useState({})

  // useEffect(() => {
  //   const initialValue = {};
  //   form.form.formFields.forEach(item => {
  //       const fieldName = item.field.fieldId
  //       const fieldType = item.field.attributeName
  //       if (fieldType === ADDRESS) {
  //           initialValue[fieldName + "-country"] = "";
  //           initialValue[fieldName + "-province"] = "";
  //           initialValue[fieldName + "-city"] = "";
  //           initialValue[fieldName + "-address"] = "";
  //       } else {
  //         initialValue[item.field.fieldId] = "";
  //       }
  //   });
  //   setInitialValues(initialValue)
  // }, [])


 

  // function handleAutoSelect(name, val) {
  //     console.log("handleAutoSelect ", name, val)
  //     initialValues[name] = val
  //     setReload(false)
  // }
  // console.log("handleAutoSelect  re i",reload, initialValues)

  return <FormView
    form={form.form}
    country={country}
    currentPatient={currentPatient}
    submitForm={submitForm}
  />
}
