import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { questionAction } from '../../../../../state/ducks/questions';
import RadioGroup from "./formComponents/widgets/RadioGroup";
import TextArea from "./formComponents/widgets/TextArea";
import TextBox from "./formComponents/widgets/TextBox";
import CheckBox from "./formComponents/widgets/CheckBox";
import SingleSelect from "./formComponents/widgets/SingleSelect";
import { createNotification } from "../../../../../utilities/helpers/helper";
import AppForm from "./formComponents/AppForm";
import AutoSearchComplete from "./formComponents/widgets/AutoSearchComplete";
import { questionService } from "../../../../../services/questionservice";
import ButtonRenderer from '../../../../../utilities/helpers/ButtonRenderer';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './questionlist.css';
import Loaders from '../../../common/loader/Loader';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';

class QuestionList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quickFilterText: '',
            columnDefs: [
                {
                    headerName: "Name", field: "name"
                },
                {
                    headerName: "Description", field: "description"
                },
                {
                    headerName: "Data Type", field: "concept.datatype.display"
                },
                {
                    headerName: "Field Type", field: "fieldType.display"
                },
                {
                    headerName: "Edit",
                    field: "edit",
                    template:
                        `
                    <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                    `
                    , width: 80
                }
                // {
                //     headerName: "Edit", field: "edit", width: 200,
                //     cellRenderer: 'buttonRenderer'
                // }
            ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer,
            },
            ///from here add
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
                { title: "Textbox", key: "7d5e86fa-c2cc-11de-8d13-0010c6dffd0f" }
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
            variableNameReadOnly: "true",
            openQuestionModal: false,
            openEditQuestionModal: false,
            //for edit
            conceptnameforedit: '',
            conceptuuid: '',
            widgetType: '',
            isAttribute: '',
            variableName: '',
            displayTextEdit: '',
            dataTypeEdit: '',
            descriptionEdit: '',
            widgetsToShowEdit: [],
            fieldId: '',
        }
        this.onQuickFilterText = this.onQuickFilterText.bind(this);
        this.onChangeEdit = this.onChangeEdit.bind(this);
        this.handleSubmitEditForm = this.handleSubmitEditForm.bind(this);

    }
    static propTypes = {
        questionList: PropTypes.array.isRequired
    }
    async componentDidMount() {
        await this.props.getAllQuestion();
        if (this.props.questionList) {
            await this.setState({ rowData: this.props.questionList.fields })

        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.questionList !== undefined) {
            await this.setState({
                rowData: nextProps.questionList.fields
            });
        }
    }
    resetForm = () => {
        window.location.reload();
    };

    openQuestionModal() {
        this.setState({ openQuestionModal: true });
    }
    closeQuestionModal() {
        this.setState({ openQuestionModal: false })
    }
    openEditQuestionModal() {
        this.setState({ openEditQuestionModal: true });
    }
    closeEditQuestionModal() {
        this.setState({ openEditQuestionModal: false })
    }
    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };
    onItemSelectedFunc = e => {
        // if (e.target) {
        //   e.preventDefault();
        //   if (e.target.checked) {
        //     this.setState({ isAttribute: e.target.checked });
        //   }
        // }

        if (e.controlId == "isAttribute") {
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

    deleteOption = (e, key) => {
        var array = [...this.state.definedOptions]; // make a separate copy of the array
        array = array.filter(item => item.key !== key);
        this.setState({ definedOptions: array });
    };
    onItemCheck = e => {
        e.preventDefault();
    };
    openModall = e => {
        e.preventDefault();
        this.formatForOptionAndAddInState("");
    };
    fieldAnswerFormat() {
        let array = [];
        const { definedOptions } = this.state;
        definedOptions.forEach(element => {
            array.push({
                concept: element.key,
                field: ""
            });
        });

        return array;
    }
    formatForOptionAndAddInStateForEdit = e => {
        const { definedOptions } = this.state;
        var uniqueKey = "option" + Date.now();
        var option = {
            title: "Option",
            key: uniqueKey,
            controlId: "optionArray" + uniqueKey + Date.now()
        };
        if (e) {
            if (e.uuid) {
                option.key = e.concept.uuid;
                option.value = e.concept.display;
            }
        }

        // setting the new option in state
        this.setState({
            definedOptions: [...definedOptions, option]
        });
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
    async handleSubmitEditForm(e) {
        if (this.state.widgetsToShowEdit.length != 0) {

            var data = {
                fieldId: this.state.fieldId,
                name: this.state.displayTextEdit,
                description: this.state.descriptionEdit,
                fieldType: this.state.widgetType.key,
                concept: this.state.conceptuuid,
                selectMultiple:
                    this.state.widgetType.value === "Multiple Choice" ? true : false,
                tableName: this.state.isAttribute ? "Attribute" : ""
                ,
                answers: this.fieldAnswerFormat()
            };
            console.log('dataa' + JSON.stringify(data));

        }
        await questionService.saveEditedField(data).then(d => {
            createNotification("success", "Question Updated!"
            );
            this.closeEditQuestionModal();
            this.props.getAllQuestion()
            //    this.resetForm();
        });
    }
    submit = () => {
        var questionWidgetType = this.state.widgetType;
        var questionConcept = this.state.conceptName;
        var variableName = this.state.question;
        var questionDescription = this.state.description;
        var questionConceptClass = this.state.conceptClass;
        var options = this.state.definedOptions;
        var questionDataType = this.state.dataType;
        var displayText = this.state.displayText;
        if (displayText == '' || questionDataType == {}) {
            this.mandatoryFieldError();
            return;
        }
        if (!/[a-zA-Z]+\s?[a-zA-Z]/.test(questionConcept)) {
            createNotification('warning', 'Name can not contain special characters')
            return;
        }
        console.log("questionWidgetType", questionWidgetType);
        console.log("questionConcept", questionConcept);
        console.log("variableName", variableName);
        console.log("questionDescription", questionDescription);
        console.log("options", options);
        console.log("questionDataType", questionDataType);

        if (questionConceptClass) {
            if (questionConceptClass.value == "Option") {
                // Create conceptOnly
                if (questionConcept !== undefined) {
                    if (questionWidgetType != undefined) {
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

                            createNotification(
                                "success",
                                "Option Saved!"
                            );
                            this.props.getAllQuestion();
                            this.closeQuestionModal();
                            //this.resetForm();
                        });
                    }

                    //  return;
                }

            }
        }
        if (questionConcept !== undefined) {
            if (questionConcept.uuid) {
                if (questionWidgetType != undefined) {
                    var data = {

                        name: displayText,
                        description: questionDescription,
                        fieldType: questionWidgetType.key,
                        concept: questionConcept.uuid,
                        selectMultiple:
                            questionWidgetType.value === "Multiple Choice" ? true : false,
                        attributeName: questionDataType.value,
                        tableName: this.state.isAttribute ? "Attribute" : ""
                        ,
                        answers: this.fieldAnswerFormat()
                    };
                    console.log('data' + JSON.stringify(data))
                    questionService.saveField(data).then(d => {
                        createNotification(
                            "success",
                            "Question Saved!"
                        );
                        this.props.getAllQuestion();
                        this.closeQuestionModal();
                        // this.resetForm();
                    });
                    return;
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
                if (questionWidgetType != undefined) {
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
                            createNotification(
                                "success",
                                "Question Saved!"
                            );
                            this.closeQuestionModal();
                            this.props.getAllQuestion();
                            this.resetForm();

                        });
                    });
                }

                //return;
            }
        }
        else {
            this.mandatoryFieldError();
        }

    }; mandatoryFieldError() {
        createNotification('warning', 'Please fill mandatory fields');
    }
    async onCellClicked(event) {
        if (event.column.colId === "edit") {
            await this.setState({ definedOptions: [] });
            await this.setState({ widgetsToShowEdit: [] });
            if (event.data.fieldType.display == 'Single Select Dropdown' ||
                event.data.fieldType.display == 'Single Select Radiobuttons') {
                await this.state.widgetsToShowEdit.push({
                    title: "Single Select Dropdown",
                    key: "6d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
                });
                await this.state.widgetsToShowEdit.push({
                    title: "Single Select Radiobuttons",
                    key: "5d5e86fa-c2cc-11de-8d13-0010c6dffd0f"
                });
            }
            else {
                await this.state.widgetsToShowEdit.push({
                    title: event.data.fieldType.display,
                    key: event.data.fieldType.uuid
                })
            }

            await event.data.answers.map(option => this.formatForOptionAndAddInStateForEdit(option));
            await this.setState({
                fieldId: event.data.fieldId, conceptuuid: event.data.concept.uuid,
                conceptnameforedit: event.data.name, openEditQuestionModal: true,
                widgetType: {
                    title: event.data.fieldType.display,
                    key: event.data.fieldType.uuid
                }, isAttribute: event.data.tableName, variableName: event.data.name.toLowerCase().replace(/ /g, "_"),
                displayTextEdit: event.data.display, dataTypeEdit: event.data.concept.datatype.display, descriptionEdit: event.data.description
            })
            await console.log(JSON.stringify(this.state.widgetType))
        }

    }
    onChangeEdit(e) {
        if (e.controlId == "widgettype") {
            this.setState({ widgetType: e });

        }
        else if (e.controlId == "displaytext") {
            this.setState({ displayTextEdit: e.value });
        }
        else if (e.controlId == "isAttribute") {
            this.setState({ isAttribute: e.value })
        }
        else if (e.controlId == "description") {
            this.setState({ descriptionEdit: e.value })
        }
        else {

            if (e.uuid) {
                var array = this.state.definedOptions;
                var existingObj = array.filter(data => data.controlId == e.controlId);
                var index = array.indexOf(existingObj[0]);
                if (index >= 0) {
                    array[index] = e;
                } else {
                    this.setState({ definedOptions: [e] });
                }
            }
        }
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data);
    };


    render() {
        const {
            allWidgets,
            widgetsToShow,
            allDatatypes,
            dataTypesToShow,
            columnDefs,
            rowData
        } = this.state;
        if (this.props.isLoading) return <Loaders />;
        return (
            <div className="row questionlist-main-header">
                <CardTemplate
                    title=" Question List"
                    action={
                        <button className="fp-btn btn btn-primary " onClick={() => this.openQuestionModal()}><i class="fas fa-plus"></i> Add New Question</button>
                    }
                >
                    <div className="card-body rm-paadding">
                        <AgGrid
                            onGridReady={this.onGridReady}
                            columnDefs={columnDefs}
                            onRowSelected={this.onRowSelected}
                            rowData={rowData}
                            onCellClicked={this.onCellClicked}
                        />
                    </div>

                </CardTemplate>

                {/* <div className="questionlist-heading col-sm-8 col-md-8 col-lg-8">
                    <h2 className="header_title">Question List</h2>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">

                    <button type="button" onClick={() => this.openQuestionModal()} className="btn btn-sm btn-primary btn-questionlist">     
                 </button>
                </div> */}
        {/*  <div className="questionlist-main-card card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-8 col-sm-4">
                                <span className="text-muted"> Question List</span>
                            </div>
                            <div className="col-md-4 col-sm-2">
                                <button className="fp-btn btn btn-primary " onClick={() => this.openQuestionModal()}><i class="fas fa-plus"></i> Add New Question</button>
                            </div>
                        </div>
                    </div>
                  

                    <div className="row card-header">
                        <div className="input-group search-btn">
                            <input type="text" name="quickFilter" id="quickFilter" placeholder="Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small lt-input-search" aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div> 
                <div className="card-body rm-paadding">
                    <AgGrid
                        onGridReady={this.onGridReady}
                        columnDefs={columnDefs}
                        onRowSelected={this.onRowSelected}
                        rowData={rowData}
                        onCellClicked={this.onCellClicked}
                    />

                    />

                        <div className="d-flex justify-content-center">
                            <div className="ag-theme-balham" style={{ height: '415px', width: '100%' }}>
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    modules={AllCommunityModules}
                                    context={this.state.context}
                                    frameworkComponents={this.state.frameworkComponents}
                                    enableSorting
                                    enableFilter
                                    rowAnimation
                                    quickFilterText={this.state.quickFilterText}
                                    enableRangeSelection={true}
                                    pagination={true}
                                    paginationPageSize="12"
                                    isExternalFilterPresent={true}
                                    enableColResize="true"
                                    onCellClicked={event => { this.onCellClicked(event) }}
                                >
                                </AgGridReact>
                            </div>
                        </div>
                    </div> */}

           <Modal show={this.state.openQuestionModal} onHide={() => this.closeQuestionModal()} style={{ marginTop: '40px' }}>
            <Modal.Body>
                <AppForm title="Create New Question">
                    <AutoSearchComplete
                        controlId="conceptName"
                        title="Name"
                        onItemSelectedProp={this.onItemSelectedFunc}
                        isRequired={true}
                        pattern="[a-zA-Z]+\s?[a-zA-Z]"
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
                            isRequired="true"
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
            </Modal.Body>
        </Modal>
            <Modal show={this.state.openEditQuestionModal} onHide={() => this.closeEditQuestionModal()} style={{ marginTop: '40px' }} >
                <Modal.Body>
                    <AppForm title="Edit Question">
                        <TextBox
                            controlId="conceptnameforedit"
                            value={this.state.conceptnameforedit}
                            title="Name"
                            onItemSelectedProp={this.onChangeEdit}
                            readOnly="true"
                        ></TextBox>
                        <SingleSelect
                            title="Widget Type"
                            options={this.state.widgetsToShowEdit}
                            onItemSelectedProp={this.onChangeEdit}
                            isRequired="true"
                            controlId="widgettype"
                            disabled={this.state.widgetsToShowEdit.length == 1 ? true : false}
                        ></SingleSelect>
                        <CheckBox
                            controlId="isAttribute"
                            title="Attribute"
                            onItemSelectedProp={this.onChangeEdit}
                            checked={this.state.isAttribute == null ? 'false' : 'true'}
                        >
                            Is Attribute
              </CheckBox>

                        <TextBox
                            controlId="variablename"
                            value={this.state.variableName}
                            title="Variable Name"
                            onItemSelectedProp={this.onChangeEdit}
                            readOnly="true"
                        ></TextBox>
                        <TextBox
                            controlId="displaytext"
                            value={this.state.displayTextEdit}
                            title="Display Text"
                            onItemSelectedProp={this.onChangeEdit}
                            readOnly="false"
                            isRequired="true"
                        ></TextBox>
                        <TextBox
                            controlId="datatype"
                            value={this.state.dataTypeEdit}
                            title="Data Type"
                            onItemSelectedProp={this.onChangeEdit}
                            readOnly="true"
                        ></TextBox>
                        <TextArea
                            controlId="description"
                            value={this.state.descriptionEdit}
                            title="Description"
                            title="Description"
                            onItemSelectedProp={this.onChangeEdit}
                            isRequired="true"
                        ></TextArea>
                        {this.state.dataTypeEdit == 'Coded' ? (
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
                                                    onItemSelectedProp={this.onChangeEdit}
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
                        ) : ''}

                        <div className="form-group">
                            <button
                                name="submit"
                                type="button"
                                onClick={this.handleSubmitEditForm}
                                style={{ marginTop: "20px", float: "left" }}
                                className="btn btn-primary"
                            >
                                Submit
            </button>
                        </div>

                    </AppForm>
                </Modal.Body>
            </Modal>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    questionList: state.questions.questions,
    question: state.questions.question,
    answer: state.questions.answer,
    concept: state.questions.concept,
    isLoading: state.questions.loading
});

const mapDispatchToProps = {
    getAllQuestion: questionAction.getAllQuestion,
    saveAnswer: questionAction.saveAnswer,
    saveConcept: questionAction.saveConcept
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
