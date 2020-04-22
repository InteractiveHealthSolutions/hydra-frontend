import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormView from './FormView'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
export default function FormViewContainer() {
    const form = JSON.parse(localStorage.getItem("form"))
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(systemSettingsAction.getSystemSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1'))
    }, [])

    const { country } = useSelector((state) => ({
        country: state.systemSettings.systemSetting

    }))
    console.log("country main " ,country)

    return <FormView
        form={form}
        country={country}
    />
}
