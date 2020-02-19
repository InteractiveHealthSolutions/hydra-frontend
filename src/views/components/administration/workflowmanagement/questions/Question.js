import React from "react";
import ReactDOM from "react-dom";
import SingleSelect from "./formComponents/widgets/SingleSelect";
import CheckBoxes from "./formComponents/widgets/CheckBoxes";
import MultiSelect from "./formComponents/widgets/MultiSelect";
import RadioGroup from "./formComponents/widgets/RadioGroup";
import TextArea from "./formComponents/widgets/TextArea";
import TextBox from "./formComponents/widgets/TextBox";
import CheckBox from "./formComponents/widgets/CheckBox";
import AppForm from "./formComponents/AppForm";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { questionAction } from "../../../../../state/ducks/questions";
import AutoSearchComplete from "./formComponents/widgets/AutoSearchComplete";
import { questionService } from "../../../../../services/questionservice";
import {
  displayError,
  createNotification
} from "../../../../../utilities/helpers/helper";
import { Checkbox } from "material-ui";

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // #badPractice, these should be frtched from server.
      // But since we are shipping the database with application.
      // So doesn't matter much for now.
      allDatatypes: [
        { title: "", key: "0" },
        { title: "Text", key: "8d4a4ab4-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Numeric", key: "8d4a4488-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Coded", key: "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Datetime", key: "8d4a5af4-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      textDatatypes: [
        { title: "", key: "0" },
        { title: "Text", key: "8d4a4ab4-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      numericDatatypes: [
        { title: "", key: "0" },
        { title: "Numeric", key: "8d4a4488-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      textBoxDatatypes: [
        { title: "", key: "0" },
        { title: "Text", key: "8d4a4ab4-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Numeric", key: "8d4a4488-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      optionDatatype: {
        title: "N/A",
        key: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f"
      },
      codedDatatypes: [
        { title: "", key: "0" },
        { title: "Coded", key: "8d4a48b6-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      dateDatatypes: [
        { title: "", key: "0" },
        { title: "Datetime", key: "8d4a5af4-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      dataTypesToShow: [],
      allWidgets: [
        { title: "", key: "0" },
        { title: "Textbox", key: "7d5e86fa-c2cc-11de-8d13-0010c6dffd0f" }, // a unique key is required for the map to iterate
        {
          title: "Single Select Dropdown",
          key: "6d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        {
          title: "Single Select Radiobuttons",
          key: "5d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        {
          title: "Multiple Choice",
          key: "4d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        {
          title: "Date/ Time Picker",
          key: "3d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        // { title: "Age", key: "0d5e86fa-c2cc-11de-8d13-0010c6dffd0f" },
        // { title: "Address", key: "2d5e86fa-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Heading", key: "1d5e86fa-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      codedWidgets: [
        { title: "", key: "0" },
        {
          title: "Single Select Dropdown",
          key: "6d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        {
          title: "Single Select Radiobuttons",
          key: "5d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        },
        {
          title: "Multiple Choice",
          key: "4d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        }
      ],
      textWidgets: [
        { title: "", key: "0" },
        { title: "Textbox", key: "7d5e86fa-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Heading", key: "1d5e86fa-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      dateWidgets: [
        { title: "", key: "0" },
        {
          title: "Date/ Time Picker",
          key: "3d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
        }
      ],
      otherWidgets: [
        { title: "", key: "0" },
        { title: "Age", key: "0d5e86fa-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Address", key: "2d5e86fa-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      conceptClasses: [
        { title: "Question", key: "8d491e50-c2cc-11de-8d13-0010c6dffd0f" },
        { title: "Option", key: "8d492774-c2cc-11de-8d13-0010c6dffd0f" }
      ],
      dataToSubmit: {},
      hideIsOption: false,
      showWidgetType: false,
      showDataType: true,
      widgetsToShow: [],
      definedOptions: [],
      openModal: false,
      textBoxSelected: false,
      selectableSelected: false,
      questionListItem: [],
      concept: {},
      conceptClass: {},
      question: "",
      displayText: "",
      description: "",
      dataType: {},
      isAttribute: false,
      variableNameReadOnly: "true"
    };
  }

  resetForm = () => {
    window.location.reload();
  };

  submit = () => {
    var questionWidgetType = this.state.widgetType;
    var questionConcept = this.state.conceptName;
    var variableName = this.state.question;
    var questionDescription = this.state.description;
    var questionConceptClass = this.state.conceptClass;
    var options = this.state.definedOptions;
    var questionDataType = this.state.dataType;
    var displayText = this.state.displayText;

    console.log("questionWidgetType", questionWidgetType);
    console.log("questionConcept", questionConcept);
    console.log("variableName", variableName);
    console.log("questionDescription", questionDescription);
    console.log("options", options);
    console.log("questionDataType", questionDataType);
    
    if (questionConceptClass) {
      if (questionConceptClass.value == "Option") {
        // Create conceptOnly
        if(questionConcept !== undefined) {
          if(questionWidgetType != undefined) {
            var data = {
              names: [
                {
                  name: questionConcept.value.toUpperCase(),
                  locale: "en",
                  localePreferred: true,
                  conceptNameType: "FULLY_SPECIFIED"
                },
                {
                  name: variableName,
                  locale: "en",
                  conceptNameType: "SHORT"
                }
              ],
              datatype: this.state.optionDatatype.key,
              conceptClass: "Misc",
              descriptions: [questionDescription]
            };
            questionService.saveConcept(data).then(d => {
              createNotification({
                type: "success",
                text: "Option Saved!"
              });
            //  this.resetForm();
            });
          }
         
        //  return;
        }
        
      }
    }
    if(questionConcept !== undefined) {
      if (questionConcept.uuid) {
        if(questionWidgetType != undefined) {
          var data = {
            field: {
              name: displayText,
              description: questionDescription,
              fieldType: questionWidgetType.key,
              concept: questionConcept.uuid,
              selectMultiple:
                questionWidgetType.value === "Multiple Choice" ? true : false,
              attributeName: questionDataType.value,
              tableName: this.state.isAttribute ? "Attribute" : ""
            },
            answers: this.fieldAnswerFormat()
          };
          questionService.saveField(data).then(d => {
            createNotification({
              type: "success",
              text: "Question Saved!"
            });
        //    this.resetForm();
          });
         // return;
        }
        else {
          this.mandatoryFieldError()
        }
        
      } else {
        var conceptData = {
          names: [
            {
              name: questionConcept.value.toUpperCase(),
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED"
            },
            {
              name: variableName,
              locale: "en",
              conceptNameType: "SHORT"
            }
          ],
          datatype: questionDataType.key,
          conceptClass: "Question",
          descriptions: [questionDescription]
        };
        if(questionWidgetType != undefined) {
          questionService.saveConcept(conceptData).then(data => {
            console.log("Responsed received", data);
            var fieldData = {
              field: {
                name: displayText,
                description: questionDescription,
                fieldType: questionWidgetType.key,
                concept: data.uuid,
                selectMultiple:
                  questionWidgetType.value === "Multiple Choice" ? true : false,
                attributeName: questionDataType.value,
                tableName: this.state.isAttribute ? "Attribute" : ""
              },
              answers: this.fieldAnswerFormat()
            };
            questionService.saveField(fieldData).then(d => {
              createNotification({
                type: "success",
                text: "Question Saved!"
              });
             // this.resetForm();
            });
          });
        }
       
        //return;
      }
    }
    else {
      this.mandatoryFieldError();
    }
    
};
mandatoryFieldError() {
  createNotification('warning' , 'Please fill mandatory fields');
}
  fieldAnswerFormat() {
    let array = [];
    const { definedOptions } = this.state;
    definedOptions.forEach(element => {
      array.push({
        concept: element.key
      });
    });

    return array;
  }

  openModall = e => {
    e.preventDefault();
    this.formatForOptionAndAddInState("");
  };

  formatForOptionAndAddInState = e => {
    const { definedOptions } = this.state;
    var uniqueKey = "option" + Date.now();
    var option = {
      title: "Option",
      key: uniqueKey,
      controlId: "optionArray" + uniqueKey + Date.now()
    };
    if (e) {
      if (e.uuid) {
        option.key = e.uuid;
        option.value = e.name.display;
      }
    }

    // setting the new option in state
    this.setState({
      definedOptions: [...definedOptions, option]
    });
  };

  onItemSelectedFunc = e => {
    // if (e.target) {
    //   e.preventDefault();
    //   if (e.target.checked) {
    //     this.setState({ isAttribute: e.target.checked });
    //   }
    // }
    if (e.controlId == "isAttribute") {
      console.log("isAttribute", e.value);
      this.setState({ isAttribute: e.value });
    } else if (e.controlId == "class") {
      this.setState({ conceptClass: e });
      if (e.value == "Option")
        this.setState({ showWidgetType: false, showDataType: false });
      else this.setState({ showWidgetType: true, showDataType: true });
    } else if (e.controlId == "widgetType") {
      this.setState({ widgetType: e });
      if (
        e.value == "Single Select Dropdown" ||
        e.value == "Single Select Radiobuttons" ||
        e.value == "Multiple Choice"
      ) {
        this.setState({ dataTypesToShow: this.state.codedDatatypes });
      } else if (e.value == "Textbox") {
        this.setState({ dataTypesToShow: this.state.textBoxDatatypes });
      } else if (e.value == "Date/ Time Picker") {
        this.setState({ dataTypesToShow: this.state.dateDatatypes });
      }
    } else if (e.controlId == "variableName") {
      this.setState({ question: e.value });
    } else if (e.controlId == "displayText") {
      this.setState({ displayText: e.value });
    } else if (e.controlId == "dataType") {
      this.setState({ dataType: e });
      if (e.value == "Coded") {
        this.setState({ textBoxSelected: false, selectableSelected: true });
      } else if (e.value == "Text" || e.value == "Numeric") {
        this.setState({ textBoxSelected: true, selectableSelected: false });
      } else {
        this.setState({ textBoxSelected: false, selectableSelected: false });
      }
    } else if (e.controlId == "description") {
      this.setState({ description: e.value });
    } else if (e.controlId == "conceptName") {
      this.setState({ definedOptions: [] });
      if (e.uuid) {
        this.setState({
          hideIsOption: true,
          showWidgetType: true,
          showDataType: true,
          question: e.variableName,
          variableNameReadOnly: "true"
        });
      } else {
        this.setState({
          question: e.value.toLowerCase().replace(/ /g, "_"),
          hideIsOption: false,
          showWidgetType: false,
          variableNameReadOnly: "true"
        });
      }
      e.answers.map(option => this.formatForOptionAndAddInState(option));
      this.setState({ conceptName: e });

      this.setState({ description: e.description });
      if (e.dataType == "Coded") {
        this.setState({ widgetsToShow: this.state.codedWidgets });
        this.setState({ dataTypesToShow: this.state.codedDatatypes });
      } else if (e.dataType == "Text") {
        this.setState({ widgetsToShow: this.state.textWidgets });
        this.setState({ dataTypesToShow: this.state.textDatatypes });
      } else if (e.dataType == "Numeric") {
        this.setState({ widgetsToShow: this.state.textWidgets });
        this.setState({ dataTypesToShow: this.state.numericDatatypes });
      } else if (
        e.dataType == "Date" ||
        e.dataType == "Time" ||
        e.dataType == "Datetime"
      ) {
        this.setState({ widgetsToShow: this.state.dateWidgets });
        this.setState({ dataTypesToShow: this.state.dateDatatypes });
      } else {
        this.setState({ widgetsToShow: this.state.allWidgets });
        this.setState({ dataTypesToShow: this.state.allDatatypes });
      }
    } else {
      if (e.uuid) {
        var array = this.state.definedOptions;
        var existingObj = array.filter(data => data.controlId == e.controlId);
        var index = array.indexOf(existingObj[0]);
        if (index >= 0) {
          array[index] = e;
          // this.setState({ definedOptions: array });
        } else {
          this.setState({ definedOptions: [e] });
        }
      }
    }
  };

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.questionList !== undefined) {
      this.setState({
        questionListItem: nextProps.questionList
      });
    }
  }

  deleteOption = (e, key) => {
    var array = [...this.state.definedOptions]; // make a separate copy of the array
    array = array.filter(item => item.key !== key);
    this.setState({ definedOptions: array });
  };
  onItemCheck = e => {
    e.preventDefault();
  };

  render() {
    const {
      allWidgets,
      widgetsToShow,
      allDatatypes,
      dataTypesToShow
    } = this.state;
    return (
      <>
        <AppForm title="Create New Question">
          <AutoSearchComplete
            controlId="conceptName"
            title="Name"
            onItemSelectedProp={this.onItemSelectedFunc}
            isRequired={true}
          ></AutoSearchComplete>
          {this.state.hideIsOption ? (
            ""
          ) : (
            <RadioGroup
              title="Class"
              options={this.state.conceptClasses}
              onItemSelectedProp={this.onItemSelectedFunc}
              isRequired="true"
              controlId="class"
            ></RadioGroup>
          )}
          {this.state.showWidgetType ? (
            <>
              <SingleSelect
                title="Widget Type"
                onItemSelectedProp={this.onItemSelectedFunc}
                isRequired="true"
                controlId="widgetType"
                
                options={widgetsToShow.length == 0 ? allWidgets : widgetsToShow}
              ></SingleSelect>
              <CheckBox
                controlId="isAttribute"
                title="Attribute"
                onItemSelectedProp={this.onItemSelectedFunc}
              >
                Is Attribute
              </CheckBox>
            </>
          ) : (
            ""
          )}

          {this.state.showDataType ? (
            <TextBox
              controlId="displayText"
              title="Display Text"
              readOnly="false"
              onItemSelectedProp={this.onItemSelectedFunc}
            ></TextBox>
          ) : (
            ""
          )}

          <TextBox
            value={this.state.question}
            controlId="variableName"
            title="Variable Name"
            readOnly={this.state.variableNameReadOnly}
            onItemSelectedProp={this.onItemSelectedFunc}
            isRequired={true}
          ></TextBox>
          {this.state.showDataType ? (
            <SingleSelect
              title="Data Type"
              options={
                dataTypesToShow.length == 0 ? allDatatypes : dataTypesToShow
              }
              onItemSelectedProp={this.onItemSelectedFunc}
              isRequired="true"
              controlId="dataType"
            ></SingleSelect>
          ) : (
            ""
          )}
          <TextArea
            controlId="description"
            value={this.state.description}
            title="Description"
            title="Description"
            onItemSelectedProp={this.onItemSelectedFunc}
          ></TextArea>
          {this.state.textBoxSelected ? (
            <>
              <TextBox
                controlId="characters"
                title="Description"
                title="Allowed Characters"
                onItemSelectedProp={this.onItemSelectedFunc}
              ></TextBox>
            </>
          ) : (
            ""
          )}

          {this.state.selectableSelected ? (
            <div
              style={{
                overflow: "hidden",
                padding: "20px",
                backgroundColor: "#f2f2f2"
              }}
            >
              <div id="options-pane">
                {this.state.definedOptions.map(definedOption => (
                  <div className="row" key={definedOption.key}>
                    <div className="col-md-11">
                      <AutoSearchComplete
                        key={definedOption.key}
                        uniqueKey={definedOption.key}
                        value={definedOption.value}
                        fullData={definedOption}
                        controlId={definedOption.controlId}
                        title={definedOption.title}
                        onItemSelectedProp={this.onItemSelectedFunc}
                      ></AutoSearchComplete>
                    </div>
                    <div className="col-md-1" style={{ textAlign: "center" }}>
                      <span
                        onClick={e => this.deleteOption(e, definedOption.key)}
                      >
                        <label className="fas fa-times"></label>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                name="addOption"
                type="button"
                className="btn btn-secondary"
                style={{
                  textAlign: "center",
                  float: "right",
                  marginTop: "10px"
                }}
                onClick={this.openModall}
              >
                Add Option
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="form-group">
            <button
              name="submit"
              type="button"
              onClick={this.submit}
              style={{ marginTop: "20px", float: "left" }}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </AppForm>
      </>
    );
  }
}

const mapStateToProps = state => ({
  questionList: state.questions.questions,
  question: state.questions.question,
  answer: state.questions.answer,
  concept: state.questions.concept
});

const mapDispatchToProps = {
  saveQuestion: questionAction.saveQuestion,
  // getAllQuestion: questionAction.getAllQuestion,
  saveAnswer: questionAction.saveAnswer,
  saveConcept: questionAction.saveConcept
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
