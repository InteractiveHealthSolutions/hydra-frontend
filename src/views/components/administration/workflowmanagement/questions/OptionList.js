import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import Loaders from '../../../common/loader/Loader';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';
import {conceptsAction} from '../../../../../state/ducks/concepts';
import ButtonRenderer from '../../../../../utilities/helpers/ButtonRenderer';
import TextArea from "./formComponents/widgets/TextArea";
import TextBox from "./formComponents/widgets/TextBox";
import { createNotification } from "../../../../../utilities/helpers/helper";
import { questionService } from "../../../../../services/questionservice";

//import { history } from '../history';
import AppForm from "./formComponents/AppForm";
import AutoSearchComplete from "./formComponents/widgets/AutoSearchComplete";

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './optionlist.css';


class OptionList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    headerName: "Name", field: "display"
                },
                {
                    headerName: "Category", field: "conceptClass.display"
                },
                {
                    headerName: "Data Type", field: "datatype.display"
                },
                // {
                //     headerName: "Edit",
                //     field: "edit",
                //     template:
                //         `
                //     <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                //     `
                //     , width: 80
                // }
              ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer,
            },
            openOptionModal : false,
            alreadyExist : false
        }
    }
    static propTypes = {
        optionList: PropTypes.array.isRequired
    }
    async componentDidMount() {
        await this.props.getAllOptions()
        if (this.props.optionList) {
            await this.setState({ rowData: this.props.optionList.results })

        }
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.optionList !== undefined) {
            await this.setState({
                rowData: nextProps.optionList.results
            });
        }
    }
    openOptionModal() {
        this.setState({ openOptionModal: true });
    }
    closeOptionModal() {
        this.setState({ openOptionModal: false,alreadyExist:false });
        this.resetForm();
    }
    onItemSelectedFunc = e => {
    if (e.controlId == "variableName") {
            this.setState({ question: e.value });
    }
    else if (e.controlId == "description") {
            this.setState({ description: e.value });
    } 
    else if (e.controlId == "conceptName") {
        if (e.uuid) {
          createNotification('info','Option already exist');
          this.setState({alreadyExist:true})
        } 
        else {
            this.setState({
                question: e.value.toLowerCase().replace(/ /g, "_"),
                variableNameReadOnly: "true",
                alreadyExist: false
            });
        }
        this.setState({ conceptName: e });

    }
    };
    resetForm = () => {
        
        window.location.reload();
    };

    async onCellClicked(event) {
        if (event.column.colId === "edit") {
            //alert('hi')
        }

    }
    submit = () => {
        if(this.state.alreadyExist) {
            createNotification('error','Option with this name already exist');
            //this.setState({alreadyExist:false})
            return;
        }
        var questionConcept = this.state.conceptName;
        var variableName = this.state.question;
        var questionDescription = this.state.description;
        if(( questionConcept == undefined) || (questionDescription == '' || questionDescription == undefined)) {
            createNotification('error','Please fill mandatory fields');
            return;
        }
        else if(questionConcept.value == '') {
            createNotification('error','Please fill mandatory fields');
            return;
        }
        if (!/[a-zA-Z]+\s?[a-zA-Z]/.test(questionConcept)) {
            createNotification('warning', 'Name can not contain special characters')
            return;
        }
        if (questionConcept !== undefined) {
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
                datatype: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                conceptClass: "Misc",
                descriptions: [questionDescription]
                };
                questionService.saveConcept(data).then(d => {
   
                createNotification("success","Option Saved!");
                this.props.getAllOptions();
                this.setState({alreadyExist:false})
                this.closeOptionModal();
            });
            return;
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

    render() {
        const {
            columnDefs,
            rowData
        } = this.state;
        if (this.props.isLoading) return <Loaders />;
        return (
            <>
                <CardTemplate
                    title=" Options List"
                    action={
                        <button className="fp-btn btn btn-primary " onClick={() => this.setState({openOptionModal:true})}><i class="fas fa-plus"></i> Add New Option</button>
                    }
                >
                    <div className="card-body rm-paadding">
                        <AgGrid
                            onGridReady={this.onGridReady}
                            columnDefs={columnDefs}
                         //   onRowSelected={this.onRowSelected}
                            rowData={rowData}
                            onCellClicked={event => this.onCellClicked(event)}
                        />
                    </div>

                </CardTemplate>
                <Modal show={this.state.openOptionModal} backdrop="static" onHide={() => this.closeOptionModal()} style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body >
                        <AppForm title="Create New Option">
                            <AutoSearchComplete
                                controlId="conceptName"
                                title="Name"
                                onItemSelectedProp={this.onItemSelectedFunc}
                                isRequired={true}
                                pattern="[a-zA-Z]+\s?[a-zA-Z]"
                                parentComponent="Options"
                            ></AutoSearchComplete>
                            <TextBox
                                value={this.state.question}
                                controlId="variableName"
                                title="Variable Name"
                                readOnly={this.state.variableNameReadOnly}
                                onItemSelectedProp={this.onItemSelectedFunc}
                                isRequired={true}
                            ></TextBox>
                            <TextArea
                                controlId="description"
                                value={this.state.description}
                                title="Description"
                                title="Description"
                                onItemSelectedProp={this.onItemSelectedFunc}
                            ></TextArea>
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
            </>
        )

    }
   

}
const mapStateToProps = state => ({
    optionList: state.concepts.concepts,
    isLoading: state.concepts.loading
});

const mapDispatchToProps = {
    getAllOptions : conceptsAction.getAllConcepts
    // getAllQuestion: questionAction.getAllQuestion,
    // saveAnswer: questionAction.saveAnswer,
    // saveConcept: questionAction.saveConcept
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionList);
