import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Accordion from 'react-bootstrap/Accordion';
import { Form, Field } from 'react-advanced-form'
import {NotificationContainer} from 'react-notifications';
import { Input, Checkbox } from 'react-advanced-form-addons'
import {createNotification} from '../../../utilities/helpers/helper'
import Card from 'react-bootstrap/Card';
import { labtestAction } from '../../../state/ducks/labtest'
import {labtestOrderAction} from '../../../state/ducks/labtestorder'
import { encountersAction } from '../../../state/ducks/encounters';
import './AddTestOrder.css'
class AddTestOrder extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            rowData: [],
            selectedEncounter: '',
            selectedCaresetting: '',
            selecteduuid: [],
            showError: false


        }
        this.formData = [];
        this.optionsEncounter = [];
        this.optionsCareSetting = [
            { label: 'In Patient', value: '5485AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
            { label: 'Out Patient', value: '160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' }
        ]
        this.testType = ['BACTERIOLOGY', 'BIOCHEMISTRY', 'CARDIOLOGY', 'HEMATOLOGY', 'IMMUNOLOGY', 'OPTHALMOLOGY', 'RADIOLOGY'
            , 'SEROLOGY', 'SONOLOGY'];
        this.activePatient = JSON.parse(localStorage.getItem('active-patient'));
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEncounter = this.handleChangeEncounter.bind(this);
        this.handleChangeCareSetting = this.handleChangeCareSetting.bind(this);
    }
    static propTypes = {
        labtestlist: PropTypes.array.isRequired,
        encounters: PropTypes.array.isRequired
    };
    async componentWillMount() {
        await this.props.getAllLabTest();
        await this.props.getAllEncounters(this.activePatient.uuid);

        await this.setState({ rowData: this.props.labtestlist.results });
        await this.createEncounterTypeDropdown();
        //await this.setState({ rowData: ['a', 'b'] });
    }
    handleChangeEncounter = encounter => {
        this.setState({ selectedEncounter: encounter.value });
    }
    handleChangeCareSetting = caresetting => {
        this.setState({ selectedCaresetting: caresetting.value });
    }
    createEncounterTypeDropdown() {
        this.props.encounters.results.forEach(element => {
            this.optionsEncounter.push({
                "label": element.display,
                "value": element.uuid
            })
        });
    }
   
    saveOrder = ({ serialized }) => {
        const selectedMap = this.generateMap(serialized);
        let labTypeUuid = '';
        let reference = '';
        let instructions = '';

        this.state.selecteduuid.forEach(uuid => {
            selectedMap.map((element, i) => {
                if (uuid == element.id) {
                    labTypeUuid = element.id;
                    reference = element.reference;
                    instructions = (element.instructions == 'unefined' ? '' : element.instructions);
                }
            })
            this.state.rowData.map((value, i) => {
                if (labTypeUuid == value.uuid) {
                    this.formData.push({
                        // "labTestType": uuid,
                        // "labReferenceNumber": reference,
                        // "labInstructions": instructions,
                        // "order": {
                        //     "patient": this.activePatient.uuid,
                        //     "concept": value.referenceConcept.uuid,
                        //     "orderer": 'f233f9d1-f008-4984-b1c5-c057bdd44cb9',
                        //     "type":"testorder",
                        //     "caresetting": '6f0c9a92-6f24-11e3-af88-005056821db0',//this.state.selectedCaresetting'',
                        //     "encounter": this.state.selectedEncounter
                        
                        "order": {
                            "patient": this.activePatient.uuid,
                            "concept": value.referenceConcept.uuid,
                            "orderer": "f233f9d1-f008-4984-b1c5-c057bdd44cb9",
                            "type": "testorder",
                            "careSetting": "6f0c9a92-6f24-11e3-af88-005056821db0",
                            "encounter": this.state.selectedEncounter },
                            "labTestType": uuid,
                            "labReferenceNumber": reference
                        
                        
                    })
            }

            })


        })
        console.log('dataa '+JSON.stringify(this.formData))

        this.formData.forEach(element => {
            console.log(JSON.stringify(element));
            this.props.postTestOrder(element);
        })
        return new Promise((resolve) => resolve())
    }
    createJSONForSubmission(serialized) {
        let formData = [];
        return formData;
    }
    generateMap(serialized) {
        const result = Object.keys(serialized).map(key => ({
            ...serialized[key],
            id: key
        }));
        return result;
    }
    handleChange(e) {
        if (e.nextValue) {
            this.state.selecteduuid.push(e.fieldProps.name);
        }
        else {
            this.state.selecteduuid.pop(e.fieldProps.name)
        }


    }

    render() {
        const { encounter } = this.state.selectedEncounter;
        const { caresetting } = this.state.selectedCaresetting;
        return (
            <div className="row to-main-header">
                <div className="lt-heading col-sm-4 col-md-4 col-lg-4">
                    <h2 className="title">Request Test Order</h2>
                </div>
                <Card className="to-main-card">
                    <Form
                        ref={(form) => (this.form = form)}
                        action={this.saveOrder}
                    >
                        <Card.Header className="row card-header">

                            <div className="form-group required row" style={{ marginLeft: "5px" }}>
                                <label htmlFor="datatype" class="col-sm-2 col-form-label">Encounter</label>
                                <div class="col-sm-4">
                                    <Select
                                        value={encounter}
                                        onChange={this.handleChangeEncounter}
                                        options={this.optionsEncounter}
                                        className="to-select-dropdown"
                                        name="enc"

                                    />
                                </div>
                                <label htmlFor="datatype" class="col-sm-2 col-form-label">Caresetting</label>
                                <div class="col-sm-4">
                                    <Select
                                        value={caresetting}
                                        onChange={this.handleChangeCareSetting}
                                        options={this.optionsCareSetting}
                                        className="to-select-dropdown"
                                        name="cs"

                                    />
                                </div>
                            </div>

                        </Card.Header>
                        <Card.Body className="card-body">
                            <Accordion >
                                {this.testType.map((element, index) => {
                                    return (<Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={index}>
                                            {element}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={index}>
                                            <Card.Body>
                                                <table className="table table-bordered">
                                                    <tr>
                                                        <th></th>
                                                        <th>Test Type</th>
                                                        <th className="required">Lab Reference</th>
                                                        <th>Instructions</th>
                                                    </tr>
                                                    {this.state.rowData.map((value, i) => {
                                                        // return <div>{value.testGroup} {element}</div>
                                                        if (value.testGroup === element) {

                                                            return (

                                                                <tr>
                                                                    <Field.Group name={value.uuid}>
                                                                        <td><Checkbox className="form-control" name={value.uuid} onChange={this.handleChange} />
                                                                        </td>
                                                                        <td>{value.name}</td>
                                                                        <td><Input className="form-control" type="text" name='reference' initialValue={new Date()}
                                                                            /></td>
                                                                        <td><Input className="form-control" type="text" name='ins' /></td>
                                                                    </Field.Group>
                                                                </tr>
                                                            )
                                                        }
                                                    })}
                                                </table>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>)

                                })}
                            </Accordion>
                            <div className="row">
                                <button type="submit" className="btn btn-primary sb-button">Save Test Orders</button>
                                <button type="button" className="btn btn-danger cancel-button">Cancel</button>
                            </div>
                        </Card.Body>
                    </Form>
                </Card>
              </div>
        )
    }
}
const mapStateToPops = state => ({
    labtestlist: state.labtest.allLabTest,
    encounters: state.encounters.allEncounters
})

const mapsDispatchToProps = {
    getAllLabTest: labtestAction.getAllLabTest,
    getAllEncounters: encountersAction.getAllEncounter,
    postTestOrder: labtestOrderAction.postLabTestOrder
}
export default connect(mapStateToPops, mapsDispatchToProps)(AddTestOrder);