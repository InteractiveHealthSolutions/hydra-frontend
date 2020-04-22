import React from 'react';
import { Link } from 'react-router-dom'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Modal from 'react-bootstrap/Modal';
import { history } from '../../../../history'
import { PatiendSideBackButton } from '../../common/sidebutton/SideBackButton'
import '../../common/sidebutton/sidebutton.css'
import './patientdetail.css';
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate'
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

class PatientDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            openGeneralActionsModal: false
        }
        this.currentPatient = JSON.parse(localStorage.getItem("active-patient"));
        this.openGeneralActionsModal = this.openGeneralActionsModal.bind(this);
        this.closeGeneralActionsModal = this.closeGeneralActionsModal.bind(this);
    }
    componentDidMount() {
        console.log("patient detail :", this.currentPatient)
    }
    openModal() {
        this.setState({ openModal: true });
    }
    openGeneralActionsModal() {
        this.setState({ openGeneralActionsModal: true })
    }
    closeGeneralActionsModal() {
        this.setState({ openGeneralActionsModal: false })
    }

    closeModal() {
        this.setState({ openModal: false });
    }
    render() {

        return (
            <>
                <CardTemplate
                    title={this.currentPatient.given + " " + this.currentPatient.familyname}
                    subTitle={
                            this.currentPatient.gender +
                            " - " + this.currentPatient.age + " year(s) (" + this.currentPatient.birthday + ")" +
                            " -  Identifier (" + this.currentPatient.identifier + ")"
                    }
                    action={
                        <>
                            <Chip
                                style={{ margin: '8px' }}
                                label={localStorage.getItem("selectedWorkflow")}
                                clickable={true}
                                deleteIcon={<Icon className="fa fa-plus-circle" />}
                                color="#4258d0"
                                variant="outlined"
                            />
                            {/* <button className="btn btn-primary workflowDisplay" >{localStorage.getItem("selectedWorkflow")}</button> */}
                            <button className="btn btn-primary " onClick={this.openGeneralActionsModal}> General Actions</button>
                        </>
                    }
                >
                    <div className="row pd-row-space">
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <span className="icon-padding gradient" ><i class="fas fa-diagnoses"></i></span>
                                    <Typography className="typography-space">Diagnoses</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >   <span className="icon-padding" ><i class="fas fa-procedures gradient"></i></span>
                                    <Typography >Patient Source</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                    {/* next row */}
                    <div className="row pd-row-space">
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <span className="icon-padding" ><i class="fas fa-heartbeat gradient"></i></span>
                                    <Typography className="typography-space">Vitals</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >   <span className="icon-padding" ><i class="fas fa-users gradient"></i></span>
                                    <Typography >Patient Type</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                    {/* next row */}
                    <div className="row pd-row-space">
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <span className="icon-padding" ><i class="fa fa-procedures gradient"></i></span>
                                    <Typography className="typography-space">Patient Risk Category</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >   <span className="icon-padding" ><i class="fas fa-diagnoses gradient"></i></span>
                                    <Typography >Outcome</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                    {/* next row  */}
                    <div className="row pd-row-space">
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <span className="icon-padding" ><i class="fas  fa-user-md gradient"></i></span>
                                    <Typography className="typography-space">Relationships</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >   <span className="icon-padding" ><i class="fa fa-calendar-alt gradient"></i></span>
                                    <Typography >Recent Visits</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                    {/* next row  */}
                    <div className="row pd-row-space">
                        <div className="col-md-6 col-sm-6">
                            <ExpansionPanel style={{ width: '100%' }}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <span className="icon-padding" ><i class="fas fa-calendar-alt gradient"></i></span>
                                    <Typography className="typography-space">Next Tb Appointment</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                </CardTemplate>
                {/* general acions  */}
                <Modal show={this.state.openGeneralActionsModal} onHide={() => this.closeGeneralActionsModal()} style={{ marginTop: '100px' }}>
                    <Modal.Header closeButton className="modal-header">
                        <Modal.Title>General Actions</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body style={{ height: '400px', overflowY: 'auto' }}>
                            <div className="form-group">
                                {/* <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa map-marker-alt gradient"></i></span>
                                        <Typography >Start Visits</Typography>
                                    </ExpansionPanelSummary>
                                </div> */}
                                <div class="card pd-actions-list">
                                    <Link to="/patient/detail/dataview">
                                        <ExpansionPanelSummary
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">
                                            <span className="icon-padding" ><i class="fa fa-plus gradient"></i></span>
                                            <Typography >Enter Data</Typography>
                                        </ExpansionPanelSummary>
                                    </Link>
                                </div>
                                {/* <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa  fa-link gradient"></i></span>
                                        <Typography >Merge Visits</Typography>
                                    </ExpansionPanelSummary>
                                </div> */}
                                {/* <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa fa-chart-pie gradient"></i></span>
                                        <Typography >Chart Search</Typography>
                                    </ExpansionPanelSummary>
                                </div> */}
                                <div class="card pd-actions-list">
                                    <Link to="/patient/detail/visit">
                                        <ExpansionPanelSummary
                                            aria-controls="panel1a-content"
                                            id="panel1a-header">

                                            <span className="icon-padding" ><i class="fa fa-calendar-alt gradient"></i></span>
                                            <Typography >Service History</Typography>
                                        </ExpansionPanelSummary>
                                    </Link>

                                </div>
                                {/* <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa fa-calendar-alt gradient"></i></span>
                                        <Typography >Request Appointment</Typography>
                                    </ExpansionPanelSummary>
                                </div> */}
                                <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fas fa-briefcase-medical  gradient"></i></span>
                                        <Typography >Mark Patient Deceased</Typography>
                                    </ExpansionPanelSummary>
                                </div>
                                <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa fa-user-times gradient"></i></span>
                                        <Typography >Void Patient</Typography>
                                    </ExpansionPanelSummary>
                                </div>
                                {/* <div class="card pd-actions-list">
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa fa-paperclip gradient"></i></span>
                                        <Typography >Attachments</Typography>
                                    </ExpansionPanelSummary>
                                </div> */}
                            </div>
                        </Modal.Body>
                    </form>

                </Modal>
            </>

        )
    }
}

export default PatientDetail

