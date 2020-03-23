import React from "react";
import AppForm from "../formComponents/AppForm";
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
import QuestionListModal from "../questionlist/QuestionListModal";
import { questionService } from '../../../../../../services/questionservice'

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
      formRetiredVal: false
    };

    this.activeForm = JSON.parse(localStorage.getItem('active_form'))
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
    console.log("quesion selected", val)
  };

  returnConceptList = value => {
    console.log("returnConceptList", value)
    this.setState({
      currentObject: value
    });
  }

  async componentWillMount() {
    this.setActiveForm()
    await this.props.getAllQuestion();
    await this.props.getAllEncounterType();
  }

  async setActiveForm() {
    let form = this.activeForm
    if (form.name !== undefined) {
      this.setState({
        hydramoduleFormId: form.hydramoduleFormId,
        formName: form.name,
        formDescription: form.description,
        addFormList: await this.editFormListFormat(form.formFields),
        formRetiredVal: form.retired
      })
    }

  }

  formatFieldItem(element) {
    console.log("formatFieldItem", element)
    return {
      label: element.field ? element.field.name : element.field,
      value: element.field ? element.field.name : element.field,
      description: element.field ? element.field.description : "",
      dataType: element.field ? element.field.attributeName : "",
      uuid: element.field ? element.field.uuid : "",
      controlId: this.props.controlId,
      answers: element.answers ? element.answers : [],
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
      regix: element.regix
    };
  }
  editFormListFormat(list) {
    let array = []
    if (list) {
      list.forEach(element => {
        array.push(this.formatFieldItem(element));
      });
    }
    console.log("editFormListFormat", array)
    return array
  }

  async componentWillReceiveProps(nextProps) {
    console.log("formObject", nextProps.formObject)
    if (nextProps.questionList !== undefined) {
      await this.setState({
        questionListItem: nextProps.questionList
      });
    }
    if (nextProps.encounterTypeList !== undefined && nextProps.encounterTypeList.results !== undefined) {
      await this.setState({
        encounterTypes: nextProps.encounterTypeList.results
      });
    }
    if (nextProps.formObject !== undefined && nextProps.formObject.uuid !== undefined) {
      // createNotification("success", "Saved Successfully")
      // await this.removeLocalStorage()
      // this.setState({
      //   addFormList: [],
      //   formName: "",
      //   formDescription: ""
      // })
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount", "called")
    this.removeLocalStorage();
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
    let newform = {
      hydramoduleFormId: hydramoduleFormId,
      name: formName,
      component: "",
      description: formDescription,
      formFields: formFieldList,
      retired: formRetiredVal
    }
    console.log("newform", newform)
    await this.props.saveFormFields(newform)
    await createNotification("success", "Saved Successfully")
    await this.setState({
      addFormList: [],
      formName: "",
      formDescription: ""
    })
    this.prevStep()
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
    const { addFormList } = this.state
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
    });

  }

  getAllField() {
    let array = []
    const { addFormList } = this.state
    addFormList.forEach(element => {
      let field = {
        name: element.label,
        field: element.uuid,
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
        displayText: localStorage.getItem(`${element.uuid}-questionText`) ? localStorage.getItem(`${element.uuid}-questionText`) : "",
        mandatory: localStorage.getItem(`${element.uuid}-mandatory`) === "Yes" ? true : false,
        defaultValue: localStorage.getItem(`${element.uuid}-defaultValue`),
        regix: localStorage.getItem(`${element.uuid}-rxp`),
        characters: ""
      }
      array.push(field)
    });

    return array
  };

  async setFieldList(object) {
    await this.setState({
      formFieldList: [...this.state.formFieldList, object]
    }, () => {
      console.log("setFieldList", this.state.formFieldList);
    })

  }

  deleteOption = (e, key) => {
    var array = [...this.state.definedOptions];
    array = array.filter(item => item.key !== key);
    console.log("array", array);
    this.setState({ definedOptions: array });
  };

  onDragOver = (e) => {
    e.preventDefault();

  }

  onDragStart = (ev, uuid) => {
    console.log("onDrag start", ev)
    ev.dataTransfer.setData('id', uuid)
  }
  handleExpandClick = (ev, category) => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleDelete = (ev) => {
    console.log("handle delete :: ", ev)
    this.setState({
      addFormList: this.state.addFormList.filter(data => data.uuid !== ev)
    })
  }

  onDrop = (ev) => {
    const { currentObject, defaultQuestion } = this.state
    const uuid = ev.dataTransfer.getData('id')
    const activeItem = ev.dataTransfer.getData('comingfrom')
    let dropArray = []
    if (activeItem === "default") {
      dropArray = defaultQuestion.filter(data => data.uuid == uuid)
    } else {
      dropArray = currentObject.filter(data => data.uuid == uuid)
    }
    this.setState({
      addFormList: (this.state.addFormList.length > 0) ? [...this.state.addFormList, dropArray[0]] : dropArray
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
    console.log("encounter type selected value :", e)
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
    this.props.prevStep()
  }
  handleRetiredChecked = (param) => {
    this.setState({
      formRetiredVal: param.target.checked,
    })
  }

  render() {
    const { addFormList, currentObject, hydramoduleFormId, encounterTypes, defaultQuestion } = this.state;
    // if (this.props.isLoading) return <Loaders />;
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="card" style={{ width: "100%", height: '100%' }}>
            <div className="card-header">
              <div className="row">
                <div className="col-sm-4 col-md-8 ">
                  <h4 style={{ marginLeft: '50px' }}>Search Question</h4>
                </div>
                <div className="col-sm-2 col-md-4" >
                  <button className="service-btn btn btn-primary " onClick={this.openModall}><i class="fas fa-eye"></i> Question</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* <DefaultExpendable
                controlId="default"
                title="Default Questions"
                data={defaultQuestion}
              /> */}
              <AutoSearchComplete
                showLable="true"
                controlId="conceptName"
                title="Search Question"
                returnConceptList={this.returnConceptList}
                parentType="formbuilder"
                name="conceptName"
                searchFor="Field"
              />
              <hr style={{ height: '2px', backgroundColor: 'var(--bg)' }} />
              <ul style={{ height: '500px', width: '100%', overflowY: 'scroll' }} >
                {currentObject.map((item, index) => {
                  return (
                    <DraggableFormItem
                      controlId="field"
                      key={index}
                      data={item}
                    />
                  )
                })}
              </ul>
            </div>
            <div className="card-footer  text-center">
            </div>
          </div>
        </div >

        {/* form List */}

        <div className="col-md-8">
          <AppForm title="Form Builder"
            handleSubmited={this.submit}
            handleRetiredChecked={this.handleRetiredChecked}
            edit={this.state.formRetiredVal}
          >
            <div className="row">
              <div className="col-md-4">
                <TextBox
                  controlId="formName"
                  name="formName"
                  hydramoduleFormId={hydramoduleFormId}
                  value={this.state.formName}
                  isRequired="true"
                  title="Form Display Name"
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

            <hr style={{ height: '2px', backgroundColor: 'var(--bg)' }} />
            <ul
              style={{ height: '562px', width: '100%', overflowY: 'scroll' }}
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(e) => this.onDrop(e)}
            >
              {addFormList.map((item, index) => {
                return (
                  <DraggedFormItem
                    key={index}
                    data={item}
                    handleDelete={this.handleDelete}
                  />
                )
              })}
            </ul>
          </AppForm>
        </div>
        <QuestionListModal
          openModal={this.state.openModal}
          closeModal={this.closeModal}
        />
        <div id="formbuilderSidenav" className="sidenav">
          <a id="formback" className="pd-actions-btn" onClick={this.prevStep}>
            <span className='back-arrow'><i class="fa fa-arrow-left"></i></span>
            Go Back
            </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questionList: state.questions.questions,
  encounterTypeList: state.encounter.encounterType,
  formObject: state.formField.form,
  searchEncounterTypeList: state.encounter.searchEncounterType,
  isLoading: state.formField.loading
});

const mapDispatchToProps = {
  saveQuestion: questionAction.saveQuestion,
  getAllQuestion: questionAction.getAllQuestion,
  getAllEncounterType: encounterAction.fetchEncounterType,
  saveFormFields: formAction.saveForm,
  searchEncounterType: encounterAction.searchEncounterType
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
