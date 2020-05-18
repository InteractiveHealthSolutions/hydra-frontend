import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomSelect from './CustomSelect'
import { locationAction } from '../../../../../../state/ducks/location';
import {
    FormGroup,
}
    from '@material-ui/core'
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate' 
import styles from '../fromview.module.css';

export default function AddressWidget({
    fieldId,
    setFieldValue,
    errors,
    touched,
    country,
    values,
    displayText,
    name,
    mandatory
}) {

    const [dumy, setDumy] = useState([])
    const [provinceList, setProvinceList] = useState([])
    const [cityList, setCityList] = useState([])

    const dispatch = useDispatch()

    const { childLocations } = useSelector((state) => ({
        childLocations: state.location.childLocations
    }))

    useEffect(() => {
        if (country !== undefined && country.value !== undefined) {
           // console.log("childLocations inside", country)
            dispatch(locationAction.getChildLocations(country.value))
        }

    }, [country])

    function handleProvinceChange(name, value) {
        dispatch(locationAction.getChildLocations(value.value))
        setFieldValue(name, value)
    }

    useEffect(() => {
        if (childLocations !== undefined && childLocations.tags !== undefined) {
            if(childLocations.tags[0].display === "Country"){
                    setProvinceList(childLocations.childLocations)
            }
            else if (childLocations.tags[0].display === "Province/State") {
                setCityList(childLocations.childLocations)
            }
        }
    }, [childLocations])

  

    return (
        <CardTemplate
         title ={<label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>}
        >
            <FormGroup>
                <label>Country</label>
                <CustomSelect
                    name={fieldId + "-country"}
                    handleChange={setFieldValue}
                    options={country ? [{ label: country.value, value: country.uuid }] : dumy}
                    error={errors}
                    touched={touched}
                    isMulti={false}

                />
                {
                    errors[fieldId + "-country"]? <span className ={styles.error}>{errors[fieldId + "-country"]}</span> :""
                }
            </FormGroup>
            <FormGroup>
                <label >Province/State</label>
                <CustomSelect
                    name={fieldId + "-province"}
                    handleChange={handleProvinceChange}
                    options={provinceList? provinceList.map(element => ({
                        label: element.display,
                        value: element.uuid
                    })) : dumy}
                    error={errors}
                    touched={touched}
                    isMulti={false}

                />
                 {
                    errors[fieldId + "-province"]? <span className ={styles.error}>{errors[fieldId + "-province"]}</span> :""
                }
            </FormGroup>
            <FormGroup>
                <label >City/Village</label>
                <CustomSelect
                    name={fieldId + "-city"}
                    handleChange={setFieldValue}
                    options={cityList ? cityList.map((element) => ({
                        label: element.display,
                        value: element.uuid
                    }
                    ))  :dumy}
                    error={errors}
                    touched={touched}
                    isMulti={false}
                />
                 {
                    errors[fieldId + "-city"]? <span className ={styles.error}>{errors[fieldId + "-city"]}</span> :""
                }
            </FormGroup>
            <FormGroup>
                <label >Address</label>
                <input
                    placeholder=""
                    type="text"
                    name={fieldId + "-address"}
                    className='form-control'
                    onChange={value => setFieldValue(fieldId + "-address", value.target.value)}
                />
                 {
                    errors[fieldId + "-address"]? <span className ={styles.error}>{errors[fieldId + "-address"]}</span> :""
                }
            </FormGroup>
            <FormGroup>
                <label >Nearest Landmark</label>
                <input
                    placeholder=""
                    type="text"
                    name={fieldId + "-landmark"}
                    className='form-control'
                    onChange={value => setFieldValue(fieldId + "-landmark", value.target.value)}
                />
            </FormGroup>
        </CardTemplate>
    )
}
