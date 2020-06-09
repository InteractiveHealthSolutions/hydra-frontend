import React, { forwardRef } from "react";
import { connect } from "react-redux";
import { questionAction } from "../../../../../../state/ducks/questions";
import { encounterAction } from "../../../../../../state/ducks/encounter";
import { formAction } from "../../../../../../state/ducks/form";
import AutoSearchComplete from "../formComponents/widgets/AutoSearchComplete";
import './formbuilder.css';
import DraggedFormItem from "../formComponents/widgets/DraggedFormItem";
import DraggableFormItem from "../formComponents/widgets/DraggableFormItem";
import DefaultExpendable from "../formComponents/widgets/DefaultExpendable";
import TextBox from "../formComponents/widgets/TextBox";
import { createNotification } from '../../../../../../utilities/helpers/helper'
import { questionService } from '../../../../../../services/questionservice'
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate'
import TabPanel from '../../../../../ui/tabs/TabPanel'
import { LoaderDots } from "../../../../common/loader/LoaderDots";
import Sortable from 'react-sortablejs';
import * as _ from 'lodash';
import { history } from '../../../../../../history';

class FormBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      definedOptions: [],
      openModal: false,
      textBoxSelected: false,
      selectableSelected: false,
      questionListItem: [],
      concept: {},
      question: "",
      description: "",
      options: [],
      listItems: [],
      formListItems: [],
      currentObject: [],
      expanded: false,
      openModal: false,
      addFormList: [],
      encounterTypes: [],
      defaultQuestion: [
        {
          uuid: "4e1640ca-d264-4f8f-9210-66c535053393",
          description: "This question is need to separate the different section",
          value: "heading",
          label: "heading",
          dataType: "Heading"
        },
        {
          uuid: "97c5dc2b-a352-4847-b7f6-c0717e9b3dc7",
          description: "to show the address hierarchy",
          value: "Address",
          label: "Address",
          dataType: "Address"
        },
        {
          uuid: "1e4640ca-d264-4f8f-9210-66c053553933",
          description: "to show the Contact Tracing",
          value: "Contact Tracing",
          label: "Contact Tracing",
          dataType: "Contact Tracing"
        }
      ],
      formFieldList: [],
      formName: "",
      encounterType: "",
      formDescription: "",
      openModal: false,
      isFormExist: false,
      hydramoduleFormId: null,
      isEdit: false,
      formRetiredVal: false,
      CustomComponent: "",
      nestedSort: false,
      dragSorting: false
    };
    this.sortable = null;
    this.activeForm = []
  }

  resetForm = () => { };

  openModall = e => {
    this.setState({
      openModal: true
    });
  };

  formatForOptionAndAddInState = e => {
    const { definedOptions } = this.state;
    var option = { title: "Option", key: "option" + Date.now() };
    if (e) {
      if (e.uuid) {
        option.uuid = e.uuid;
        option.value = e.name.display;
      }
    }

    // setting the new option in state
    this.setState({
      definedOptions: [...definedOptions, option]
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false
    });
  };

  onItemSelectedFunc = val => {
    //console.log("quesion selected", val)
  };

  returnConceptList = value => {
    //   console.log("returnConceptList", value)
    this.setState({
      currentObject: value
    });
  }

  async UNSAFE_componentWillMount() {
    this.removeLocalStorage()
    this.activeForm = await JSON.parse(localStorage.getItem('active_form'))
    this.setActiveForm()
    await this.props.getAllEncounterType();
  }

  async setActiveForm() {
    let form = this.activeForm
    console.log("EditForm : ", form)
    if (form !== null && form.name !== undefined) {
      this.setState({
        hydramoduleFormId: form.hydramoduleFormId,
        formName: form.name,
        formDescription: form.description,
        addFormList: await this.editFormListFormat(form.formFields),
        formRetiredVal: form.retired,
        isEdit: form.retired,
        editeMood: true
      })
    }

  }

  formatFieldItem(element) {
    console.log("formatFieldItem", element.field.name, element.displayOrder)
    return {
      label: element.field ? element.field.name : element.field,
      value: element.field ? element.field.name : element.field,
      description: element.field ? element.field.description : "",
      dataType: element.field ? element.field.attributeName : "",
      uuid: element.field ? element.field.uuid : "",
      controlId: this.props.controlId,
      answers: element.field.answers ? element.field.answers : [],
      formFieldId: element.formFieldId,
      displayOrder: element.displayOrder,
      minOccurrence: element.minOccurrence,
      maxOccurrence: element.maxOccurrence,
      minValue: element.minValue,
      maxValue: element.maxValue,
      minLength: element.minLength,
      maxLength: element.maxLength,
      minSelections: element.minSelections,
      allowFutureDate: element.allowFutureDate,
      allowPastDate: element.allowPastDate,
      displayText: element.displayText,
      errorMessage: element.errorMessage,
      scoreable: element.scoreable,
      allowDecimal: element.allowDecimal,
      mandatory: element.mandatory,
      defaultValue: element.defaultValue,
      regix: element.regix,
      disabled: element.disabled,
      isCore: element.isCore,
      editeMood: false
    };
  }
  editFormListFormat(list) {
    let array = []
    if (list) {
      list.sort((a, b) => a.displayOrder - b.displayOrder).forEach((element, index) => {
        array.push
          ({
            ...this.formatFieldItem(element),
            displayOrder: index
          });
      });
    }
    //console.log("editFormListFormat", array)
    return array
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.encounterTypeList !== undefined && nextProps.encounterTypeList.results !== undefined) {
      await this.setState({
        encounterTypes: nextProps.encounterTypeList.results
      });
    }
  }


  submit = async () => {
    const { formName, hydramoduleFormId } = this.state
    if (await this.validation()) {
      this.setState({ formFieldList: [] })
      if (hydramoduleFormId !== null) {
        this.saveForm()
      } else {
        questionService.searchEncounterType(formName).then(data => {
          if (data.results.length > 0) {
            createNotification("error", "Form already exist.")
          } else {
            this.saveForm()
          }
        })
      }

    } else {
      createNotification("warning", "Please enter required field before submitting form.")
    }
  };

  async saveForm() {
    const { formName, formRetiredVal, formDescription, hydramoduleFormId } = this.state
    let formFieldList = await this.getAllField()
    // console.log("getAllField f",formFieldList )
    let newform = {
      hydramoduleFormId: hydramoduleFormId,
      name: formName,
      component: "",
      description: formDescription,
      formFields: formFieldList,
      retired: formRetiredVal
    }
    console.log("newform ", newform)
    // await this.props.saveFormFields(newform)
    // await this.setState({
    //   addFormList: [],
    //   formName: "",
    //   formDescription: ""
    // })
    // await createNotification("success", "Saved Successfully")
    // this.prevStep()
  }

  async validation() {
    let valid = true
    const { formName, formDescription, addFormList } = this.state
    if (formName === "" || formDescription === "" || addFormList.length <= 0) {
      valid = false
    }
    return valid
  }

  async removeLocalStorage() {
    const { addFormList } = this.state;
    
    await addFormList.forEach(element => {
      localStorage.removeItem(`${element.uuid}-displayOrder`)
      localStorage.removeItem(`${element.uuid}-score`)
      localStorage.removeItem(`${element.uuid}-errorMsg`)
      localStorage.removeItem(`${element.uuid}-minValue`)
      localStorage.removeItem(`${element.uuid}-maxValue`)
      localStorage.removeItem(`${element.uuid}-minLength`)
      localStorage.removeItem(`${element.uuid}-maxLength`)
      localStorage.removeItem(`${element.uuid}-futureDate`)
      localStorage.removeItem(`${element.uuid}-pastDate`)
      localStorage.removeItem(`${element.uuid}-headingTitle`)
      localStorage.removeItem(`${element.uuid}-mandatory`)
      localStorage.removeItem(`${element.uuid}-defaultValue`)
      localStorage.removeItem(`${element.uuid}-rxp`)
      localStorage.removeItem(`${element.uuid}-questionText`)
      localStorage.removeItem(`${element.uuid}-scorable`)
      localStorage.removeItem(`${element.uuid}-allowDecimal`)
      localStorage.removeItem(`${element.uuid}-patientContacts`)
      localStorage.removeItem(`${element.uuid}-patientId`)
      localStorage.removeItem(`${element.uuid}-patientIdMandatory`)
      localStorage.removeItem(`${element.uuid}-patientGivenName`)
      localStorage.removeItem(`${element.uuid}-patientGivenNameMandatory`)
      localStorage.removeItem(`${element.uuid}-patientFamilyName`)
      localStorage.removeItem(`${element.uuid}-patientFamilyNameMandatory`)
      localStorage.removeItem(`${element.uuid}-patientGender`)
      localStorage.removeItem(`${element.uuid}-patientGenderMandatory`)
      localStorage.removeItem(`${element.uuid}-patientAge`)
      localStorage.removeItem(`${element.uuid}-patientAgeMandatory`)
      localStorage.removeItem(`${element.uuid}-patientRelationship`)
      localStorage.removeItem(`${element.uuid}-patientRelationshipMandatory`)
      localStorage.removeItem(`${element.uuid}-disabled`)
    });
  }

  getAllField() {
    let array = []
    const { addFormList } = this.state

    console.log("getAllField", addFormList)
    addFormList.forEach(element => {
    
      let children = []
      if (element.uuid === "1e4640ca-d264-4f8f-9210-66c053553933") {
        children = [
          {
            name: "Given Name",
            field: "73e557b7-7eb0-4e96-2f1b-11c39534ec29",
            displayText: localStorage.getItem(`${element.uuid}-patientGivenName`),
            mandatory: localStorage.getItem(`${element.uuid}-patientGivenNameMandatory`) === null ? false : true
          },
          {
            "name": "Family Name",
            "field": "73e557b7-7eb0-4e96-b1f2-11c39534e92c",
            "displayText": localStorage.getItem(`${element.uuid}-patientFamilyName`),
            "mandatory": localStorage.getItem(`${element.uuid}-patientFamilyNameMandatory`) === null ? false : true
          },
          {
            "name": "Age",
            "field": "73e557b7-0be7-4e96-b1f2-11c39534ec29",
            "displayText": localStorage.getItem(`${element.uuid}-patientAge`),
            "mandatory": localStorage.getItem(`${element.uuid}-patientAgeMandatory`) === null ? false : true
          },
          {
            "name": "Gender",
            "field": "73eb7357-7eb0-4e96-b1f2-11c39534ec29",
            "displayText": localStorage.getItem(`${element.uuid}-patientGender`),
            "mandatory": localStorage.getItem(`${element.uuid}-patientGenderMandatory`) === null ? false : true
          },
          {
            "name": "Relationship",
            "field": "37e557b7-0be7-4e96-b1f2-11c395ec4329",
            "displayText": localStorage.getItem(`${element.uuid}-patientRelationship`),
            "mandatory": localStorage.getItem(`${element.uuid}-patientRelationshipMandatory`) === null ? false : true
          },
          {
            "name": "Identifier",
            "field": "37e557b7-7eb0-4e96-b1f2-11c395ec4329",
            "displayText": localStorage.getItem(`${element.uuid}-patientId`),
            "mandatory": localStorage.getItem(`${element.uuid}-patientIdMandatory`) === null ? false : true
          },
        ]
      }
      let defaultUUid = ""

      try {
        defaultUUid = JSON.parse(localStorage.getItem(`${element.uuid}-defaultValue`)).value
      } catch (err) {
        //console.log("defaultValue", localStorage.getItem(`${element.uuid}-defaultValue`))
        defaultUUid = localStorage.getItem(`${element.uuid}-defaultValue`)

      }
      let field = {
        name: element.label,
        field: element.uuid,
        displayOrder: element.displayOrder,
        scoreable: localStorage.getItem(`${element.uuid}-score`) ? true : false,
        errorMessage: localStorage.getItem(`${element.uuid}-errorMsg`),
        minOccurrence: 0,
        maxOccurrence: 0,
        allowDecimal: localStorage.getItem(`${element.uuid}-allowDecimal`) === "true" ? true : false,
        minValue: localStorage.getItem(`${element.uuid}-minValue`) ? parseInt(localStorage.getItem(`${element.uuid}-minValue`)) : null,
        maxValue: localStorage.getItem(`${element.uuid}-maxValue`) ? parseInt(localStorage.getItem(`${element.uuid}-maxValue`)) : null,
        minLength: localStorage.getItem(`${element.uuid}-minLength`) ? parseInt(localStorage.getItem(`${element.uuid}-minLength`)) : null,
        maxLength: localStorage.getItem(`${element.uuid}-maxLength`) ? parseInt(localStorage.getItem(`${element.uuid}-maxLength`)) : null,
        minSelections: 0,
        allowFutureDate: localStorage.getItem(`${element.uuid}-futureDate`) ? localStorage.getItem(`${element.uuid}-futureDate`) : false,
        allowPastDate: localStorage.getItem(`${element.uuid}-pastDate`) ? localStorage.getItem(`${element.uuid}-pastDate`) : false,
        displayText: localStorage.getItem(`${element.uuid}-questionText`) ? localStorage.getItem(`${element.uuid}-questionText`) : localStorage.getItem(`${element.uuid}-headingTitle-${element.displayOrder}`) ? localStorage.getItem(`${element.uuid}-headingTitle-${element.displayOrder}`) : "",
        mandatory: localStorage.getItem(`${element.uuid}-mandatory`) === "Yes" ? true : false,
        disabled: localStorage.getItem(`${element.uuid}-disabled`) === "Yes" ? true : false,
        defaultValue: defaultUUid,
        regix: localStorage.getItem(`${element.uuid}-rxp`),
        characters: "",
        isCore: localStorage.getItem(`${element.uuid}-isCore`) === "Yes" ? true : false,
        createPatient: localStorage.getItem(`${element.uuid}-patientContacts`) === "Yes" ? true : false,
        children: children ? children : []
      }
      if (element.dataType === 'Heading') {
        field.field = "4e1640ca-d264-4f8f-9210-66c535053393"
      }
      array.push(field)
    });

    return array
  };

  async setFieldList(object) {
    await this.setState({
      formFieldList: [...this.state.formFieldList, object]
    }, () => {

    })
  }

  deleteOption = (e, key) => {
    var array = [...this.state.definedOptions];
    array = array.filter(item => item.key !== key);
    //console.log("array", array);
    this.setState({ definedOptions: array });
  };

  onDragOver = (e) => {
    e.preventDefault();

  }

  onDragStart = (ev, uuid) => {
    // console.log("onDrag start", ev)
    this.setState({ nestedSort: false })
    ev.dataTransfer.setData('id', uuid)
  }
  handleExpandClick = (ev, category) => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleDelete = (ev, key) => {

    const filterList = this.state.addFormList.filter(data => !(data.uuid === ev && data.displayOrder === key))
    //console.log("filterList" ,filterList)
    this.setState({
      addFormList: filterList
    })
  }

  onDrop = async (ev) => {
    const { currentObject, defaultQuestion } = this.state
    const uuid = ev.dataTransfer.getData('id')
    const activeItem = ev.dataTransfer.getData('comingfrom')
    let dropArray = []
    if (activeItem === "default") {
      dropArray = defaultQuestion.filter(data => data.uuid == uuid)
    } else {
      dropArray = currentObject.filter(data => data.uuid == uuid)
    }
    await this.setState({
      addFormList: (this.state.addFormList.length > 0) ? [...this.state.addFormList, dropArray[0]] : dropArray
    })
    this.addOrder();
  }

  addOrder = () => {
    var reOrder = []
    var formList = this.state.addFormList;
    for (var i = 0; i < formList.length; i++) {
      if (formList[i].dataType === 'Heading') {
        formList[i].uuid = Math.random().toString(36).substr(2, 9)
      }
      reOrder.push({
        ...formList[i],
        displayOrder: i
      });
    }
    this.setState({
      addFormList: reOrder
    })
  }



  onItemSelectedProp = (e) => {
    if (e.controlId === "formDescription") {
      this.setState({
        formDescription: e.value
      })
    } else if (e.name === "formName") {
      this.setState({
        formName: e.value
      })
    }
    // console.log("encounter type selected value :", e)
  }
  openModall = () => {
    this.setState({
      openModal: true
    })
  }
  closeModal = () => {
    this.setState({
      openModal: false
    })
  }
  prevStep = async (e) => {
    // e.preventDefault()
    localStorage.removeItem('active_form')
    await this.removeLocalStorage()
    history.push('/administration/form')
    //this.props.prevStep()
  }
  handleRetiredChecked = (param) => {
    this.setState({
      formRetiredVal: param.target.checked,
    })
  }
  reorder(order) {
    // console.log("reorder " , order)
    let tempArray = [];
    for (var i = 0; i < order.length; i++) {
      for (var j = 0; j < this.state.addFormList.length; j++) {
        if (order[i] === this.state.addFormList[j].uuid) {
          tempArray.push({
            ...this.state.addFormList[j],
            displayOrder: i
          });
        }
      }
    }
    //console.log("tempArray ", tempArray)
    this.setState({ addFormList: tempArray, dragSorting: true });
  }

  handleNested = () => {
    (this.state.nestedSort) ? this.setState({ nestedSort: false }) : console.log("")
  }

  render() {

    const { addFormList, editeMood, currentObject, formRetiredVal, isEdit, hydramoduleFormId, defaultQuestion } = this.state;
    var disabled = {}; if (formRetiredVal === true && isEdit === true) { disabled['disabled'] = 'disabled'; }
    // console.log("addFormList ",  addFormList)
    return (
      <div className="row">
        <div className="form_adjustment col-sm-6 col-md-4">
          <CardTemplate
            title="Search Question"
            height="500"
            contentPadding="0"
            header="true"
          >
            <TabPanel
              height={760}
              defaultTab={
                <DefaultExpendable
                  controlId="default"
                  title="Default Questions"
                  data={defaultQuestion}
                  handleNested={this.handleNested}
                />
              }
              searchTab={
                <>
                  <AutoSearchComplete
                    controlId="conceptName"
                    title="Search Question"
                    placeholderText="Search Question"
                    returnConceptList={this.returnConceptList}
                    parentType="formbuilder"
                    name="conceptName"
                    searchFor="Field"
                    showLable="false"
                  />
                  <hr className="divider_left" />
                  {
                    (this.props.isSubLoading) ?
                      <LoaderDots withMargin="true" height={40} width={40} />
                      :
                      <ul className="ul_form">
                        {currentObject.map((item, index) => {
                          return (
                            <DraggableFormItem
                              controlId="field"
                              key={index}
                              data={item}
                              handleNested={this.handleNested}
                            />
                          )
                        })}
                      </ul>
                  }
                </>
              }
              padding='0'
            />

          </CardTemplate>
        </div>
        <div className="form_adjustment col-sm-6 col-md-8">
          <CardTemplate
            height="500"
            contentPadding="16"
            title="Form Builder"
            action={
              <div className="row">
                <div className="col-md-4">
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" checked={formRetiredVal} onChange={this.handleRetiredChecked} />
                    <label class="form-check-label">Retired</label>
                  </div>
                </div>
                <div className="col-md-8">
                  <button
                    className="service-btn btn btn-primary "
                    {...disabled}
                    onClick={this.submit}
                  >
                    <i class="fas fa-save"></i>
                    <span className="icon_space"></span>
                    Save
                  </button>
                </div>
              </div>
            }
          >
            <div className="row">
              <div className="col-md-4">
                <TextBox
                  controlId="formName"
                  name="formName"
                  hydramoduleFormId={hydramoduleFormId}
                  value={this.state.formName}
                  isRequired="true"
                  title="Form Name"
                  onItemSelectedProp={this.onItemSelectedProp}
                />
              </div>
              <div className="col-md-8">
                <TextBox
                  controlId="formDescription"
                  name="formDescription"
                  isRequired="true"
                  value={this.state.formDescription}
                  title="Description"
                  onItemSelectedProp={this.onItemSelectedProp}
                />
              </div>
            </div>
            <hr className="divider_right" />
            <div
              className="ul_form"
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => { this.state.nestedSort ? console.log("") : this.onDrop(e) }}
            >
              <Sortable
                options={{
                  onStart: (evt) => { this.setState({ nestedSort: true }); },
                  onEnd: (evt) => { console.log(evt.newIndex) }
                }}
                onChange={(e) => this.reorder(e)}
                tag="ul"
              >
                {
                  addFormList.sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((item, index) => {
                      return (
                        <DraggedFormItem
                          key={index}
                          data={item}
                          editeMood={editeMood}
                          handleDelete={this.handleDelete}
                        />
                      )
                    })
                }
              </Sortable>
            </div>
          </CardTemplate>
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  encounterTypeList: state.encounter.encounterType,
  formObject: state.formField.form,
  searchEncounterTypeList: state.encounter.searchEncounterType,
  isLoading: state.formField.loading,
  isSubLoading: state.questions.loading
});

const mapDispatchToProps = {
  saveQuestion: questionAction.saveQuestion,
  getAllEncounterType: encounterAction.fetchEncounterType,
  saveFormFields: formAction.saveForm,
  searchEncounterType: encounterAction.searchEncounterType
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
