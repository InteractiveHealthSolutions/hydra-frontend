import React from "react";
import AppForm from "./formComponents/AppForm";
import { connect } from "react-redux";
import { questionAction } from "../../../../state/ducks/questions";
import { encounterAction } from "../../../../state/ducks/encounter";
import { formAction } from "../../../../state/ducks/form";
import AutoSearchComplete from "./formComponents/widgets/AutoSearchComplete";
import './formbuilder.css';
import DraggedFormItem from "./formComponents/widgets/DraggedFormItem";
import DraggableFormItem from "./formComponents/widgets/DraggableFormItem";
import SingleSelect from './formComponents/widgets/SingleSelect';
import DefaultExpendable from "./formComponents/widgets/DefaultExpendable";
import TextBox from "./formComponents/widgets/TextBox";
import { displayError, createNotification } from '../../../../utilities/helpers/helper'

class FormBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataToSubmit: {},
      allWidgets: [
        { title: "", key: "0" },
        { title: "Textbox", key: "1" }, // a unique key is required for the map to iterate
        { title: "Single Select Dropdown", key: "2" },
        { title: "Single Select Radiobuttons", key: "3" },
        { title: "Multiple Choice", key: "4" },
        { title: "Date/ Time Picker", key: "5" },
        { title: "Age", key: "6" },
        { title: "Address", key: "7" },
        { title: "Title Only", key: "8" }
      ],
      codedWidgets: [
        { title: "", key: "0" },
        { title: "Single Select Dropdown", key: "2" },
        { title: "Single Select Radiobuttons", key: "3" },
        { title: "Multiple Choice", key: "4" }
      ],
      textWidgets: [
        { title: "", key: "0" },
        { title: "Textbox", key: "1" },
        { title: "Title Only", key: "8" }
      ],
      dateWidgets: [
        { title: "", key: "0" },
        { title: "Date/ Time Picker", key: "5" }
      ],
      otherWidgets: [
        { title: "", key: "0" },
        { title: "Age", key: "6" },
        { title: "Address", key: "7" }
      ],
      widgetsToShow: [],
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
      formDescription: ""
    };
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
    // this.setState({
    //   currentObject: val,
    //   listItems: (
    //     <li
    //       className='block-list-workflow'
    //       key={val.uuid}
    //       data-id={val.uuid}
    //       draggable
    //       onDragStart={(e) => this.onDragStart(e, val.uuid)}
    //     >
    //       <Card className='wf-Card'>
    //         <CardHeader
    //           title={val.value}
    //           subheader={`Data Type : ${val.dataType}`}
    //           style={{ fontSize: '16px !important' }}
    //         />
    //         <CardContent>
    //           <label style={{ padding: '8px' }}>{val.description}</label>
    //         </CardContent>
    //       </Card>
    //     </li>
    //   )
    // });
  };

  returnConceptList = value => {
    console.log("returnConceptList", value)
    this.setState({
      currentObject: value
    });
  }

  async componentWillMount() {
    await this.props.getAllQuestion();
    await this.props.getAllEncounterType();
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
      createNotification("success", "Saved Successfully")
      await this.removeLocalStorage()
      window.location.reload();
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount", "called")
    this.removeLocalStorage();
  }

  submit = async () => {
    console.log("newform list", this.state.addFormList)
    if (this.validation()) {
      this.setState({
        formFieldList: []
      })
      await this.getAllField();
      const { formName, formDescription, formFieldList } = this.state
      let newform = {
        name: formName,
        component: "",
        description: formDescription,
        formFields: formFieldList[0]
      }
      console.log("newform", newform)
      this.props.saveFormFields(newform)
    } else {
      createNotification("warning", "Please enter required field before submitting form.")
    }
  };

  validation() {
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

  async getAllField() {
    let array = []
    const { addFormList } = this.state
    await addFormList.forEach(element => {
      let field = {
        name: element.label,
        field: element.uuid,
        displayOrder: localStorage.getItem(`${element.uuid}-displayOrder`),
        scoreable: localStorage.getItem(`${element.uuid}-score`) ? true : false,
        errorMessage: localStorage.getItem(`${element.uuid}-errorMsg`),
        minOccurrence: 0,
        maxOccurrence: 0,
        allowDecimal: localStorage.getItem(`${element.uuid}-allowDecimal`) === "true" ? true : false,
        minValue: localStorage.getItem(`${element.uuid}-minValue`) ? parseInt(localStorage.getItem(`${element.uuid}-minValue`)) : 0,
        maxValue: localStorage.getItem(`${element.uuid}-maxValue`) ? parseInt(localStorage.getItem(`${element.uuid}-maxValue`)) : 0,
        minLength: localStorage.getItem(`${element.uuid}-minLength`) ? parseInt(localStorage.getItem(`${element.uuid}-minLength`)) : 0,
        maxLength: localStorage.getItem(`${element.uuid}-maxLength`) ? parseInt(localStorage.getItem(`${element.uuid}-maxLength`)) : 0,
        minSelections: 0,
        allowFutureDate: localStorage.getItem(`${element.uuid}-futureDate`) ? localStorage.getItem(`${element.uuid}-futureDate`) : false,
        allowPastDate: localStorage.getItem(`${element.uuid}-pastDate`) ? localStorage.getItem(`${element.uuid}-futureDate`) : false,
        displayText: localStorage.getItem(`${element.uuid}-headingTitle`) ? localStorage.getItem(`${element.uuid}-headingTitle`) : localStorage.getItem(`${element.uuid}-questionText`),
        mandatory: localStorage.getItem(`${element.uuid}-mandatory`),
        defaultValue: localStorage.getItem(`${element.uuid}-defaultValue`),
        regix: localStorage.getItem(`${element.uuid}-rxp`),
        characters: "Character to allow from keyboard"
      }
      array.push(field)
    });
    await this.setFieldList(array);
  };

  async setFieldList(object) {
    console.log("setFieldList", object)
    await this.setState({
      formFieldList: [...this.state.formFieldList, object]
    }, () => {
      console.log("setFieldList", this.state.formFieldList);
    })

  }

  deleteOption = (e, key) => {
    var array = [...this.state.definedOptions]; // make a separate copy of the array

    // return  console.log('array',array)
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


  render() {
    const { addFormList, currentObject, encounterTypes, defaultQuestion } = this.state;
    return (
      <div className="row">
        <div className="col-md-4">
          <AppForm
            title="Search Question"
            openModall={this.openModall}
          >

            <DefaultExpendable
              controlId="default"
              title="Default Questions"
              data={defaultQuestion}
            />
            {/* Search */}
            <AutoSearchComplete
              controlId="conceptName"
              title="Search Question"
              onItemSelectedProp={this.onItemSelectedFunc}
              returnConceptList={this.returnConceptList}
              parentType="formbuilder"
              search="Questions"
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
          </AppForm>
        </div>
        <div className="col-md-8">
          <AppForm title="Form Builder"
            handleSubmited={this.submit}
          >
            <div className="row">
              <div className="col-md-4">
                <TextBox
                  controlId="formName"
                  name="formName"
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
                  title="Description"
                  onItemSelectedProp={this.onItemSelectedProp}
                />
                {/* <SingleSelect
                  controlId="encounterType"
                  title="Form Type"
                  name="encounterType"
                  isRequired="true"
                  options={encounterTypes}
                  onItemSelectedProp={this.onItemSelectedProp}
                /> */}
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questionList: state.questions.questions,
  encounterTypeList: state.encounter.encounterType,
  formObject: state.formField.form
});

const mapDispatchToProps = {
  saveQuestion: questionAction.saveQuestion,
  getAllQuestion: questionAction.getAllQuestion,
  getAllEncounterType: encounterAction.fetchEncounterType,
  saveFormFields: formAction.saveForm
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
