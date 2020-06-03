import React, { useState, useEffect } from 'react'
import { Form } from './Form'
import { formAction } from "../../../state/ducks/form";
import { useDispatch, useSelector } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function FormContainer() {
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [formToAdd, setFormToAdd] = useState('')
    const [forms, setForms] = useState([])
    const [reload ,setReload] = useState(false)
    const activeComponentUuid = localStorage.getItem("active-component-uuid")

    useEffect(() => {
        dispatch(formAction.getComponentFormRelation())
        dispatch(formAction.fetchForms())
    }, [])

    const { componentFormList, isloading, formList,componentFormRelation } = useSelector(state => ({
        componentFormList: state.formField.componentFormRelations,
        isloading: state.formField.loading,
        formList: state.formField.forms,
        componentFormRelation : state.formField.componentFormRelation

    }))

      useEffect(() => {
          if(componentFormRelation !== undefined){
            dispatch(formAction.getComponentFormRelation())
          }
      }, [componentFormRelation])

    useEffect(() => {
        if (formList !== undefined && formList.forms !== undefined && componentFormList !== undefined) {
            populateDropDown()
        }
    }, [formList, componentFormList])

    function openModal() {
        setModalIsOpen(true)
    }
    function closeModal() {
        setModalIsOpen(false)
    }
    function handleSubmit(e) {
        e.preventDefault();
        saveComponentForm()
        closeModal();
    }

    function deleteComponentForm(form) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(formAction.deleteComponentFormRelation(form.uuid))
                        //dispatch(formAction.getComponentFormRelation())
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

   async function saveComponentForm() {
        const updateForm = {
            form: formToAdd,
            component: activeComponentUuid,
            phase: localStorage.getItem("active-phases-uuid"),
            workflow: localStorage.getItem("active-workflow-uuid")
        };
        dispatch(formAction.saveComponentFormRelation(updateForm))
        setReload(!reload)
       // dispatch(formAction.getComponentFormRelation())
    }

    function handleOnClick(e, val) {
    }
    function handleDeleteOnClick(val) {
        deleteComponentForm(val)
    }
    function handleChange(e) {
        setFormToAdd(e.target.value);
    }

    function itemIncludes(element) {
        var includes = false;
        for (var i = 0; i < componentFormList.length; i++) {
            if (componentFormList[i].form.uuid === element.uuid) includes = true;
        }
        return includes;
    }

    async function populateDropDown() {
        let form = [];
        let nonVoidedList = await formList.forms.filter(x => x.retired !== true)
        nonVoidedList.forEach(element => {

            if (itemIncludes(element)) {
                form.push(
                    <option key={element.hydramoduleFormId} disabled style={{ color: 'gray' }}>
                        {element.name}
                    </option>
                );
            } else {
                form.push(
                    <option key={element.hydramoduleFormId} value={element.uuid}>
                        {element.name}
                    </option>
                );
            }
        });
        setForms(form)
    }


    return <Form
        isloading={isloading}
        openModal={openModal}
        componentFormList={componentFormList}
        formList={forms}
        handleOnClick={handleOnClick}
        handleDeleteOnClick={handleDeleteOnClick}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        formToAdd= {formToAdd}
    />
}
