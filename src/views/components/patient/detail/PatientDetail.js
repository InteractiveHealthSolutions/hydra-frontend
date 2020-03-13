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
        console.log("patient detail :", this.currentPatient.identifier)
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
            <div className="row container-fluid pd-main-container">
              
                <CardTemplate
                    title={this.currentPatient.given + " " + this.currentPatient.familyname}
                    subTitle={
                        this.currentPatient.gender != "M" ? "Female" : "Male" +
                            " - " + this.currentPatient.age + " year(s) (" + this.currentPatient.birthday + ")" +
                            " -  Identifier (" + this.currentPatient.identifier + ")"
                    }
                    action={
                        <>
                            <button className="btn btn-primary workflowDisplay" >{localStorage.getItem("selectedWorkflow")}</button>
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


{/* 
                <div className="card fp-header">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6 col-sm-5">
                                <div className="col-sm-">
                                    <label htmlFor="patientName" className="right-space name-font" >{this.currentPatient.given + " " + this.currentPatient.familyname}</label></div>
                                <div class="col-sm-1 vl" style={{ display: "inline" }}></div>
                                <div className="col-sm-5">
                                    <div className="row" style={{ marginTop: "-55px" }}>
                                        <div className="col-sm-2">
                                            <label htmlFor="gender" className="right-space s-font" >{this.currentPatient.gender != "M" ? "Female" : "Male"}</label>
                                        </div>
                                        <div className="col-sm-10">
                                            <label htmlFor="birthday" className="right-space s-font" >{this.currentPatient.age + " year(s) (" + this.currentPatient.birthday + ")"}</label>
                                        </div>
                                    </div>
                                    <div className="row">

                                    </div>
                                    <div className="row">
                                        <div className="pd-lb">
                                            <label htmlFor="patientName">Identifier ({this.currentPatient.identifier})</label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-6">

                                <button className="btn btn-primary workflowDisplay" >
                                    {localStorage.getItem("selectedWorkflow")}
                                </button>
                                <button className="btn btn-primary general-act-btn" onClick={this.openGeneralActionsModal}>
                                    General Actions
                            </button>
                            </div>

                        </div>
                    </div>
                    {/* end header */}
                    {/* <div className="card-body">

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
                         */}
                        {/* next row */}
                        {/* <div className="row pd-row-space">
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
                         */}
                        {/* next row */}
                        {/* <div className="row pd-row-space">
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
                        */}
                        {/* next row  */}
                        {/* <div className="row pd-row-space">
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
                        </div> */}

                        {/* next row  */}
                        {/* <div className="row pd-row-space">
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
                    </div> */}
                    {/* end body */}
                {/* </div>
 */}

                <PatiendSideBackButton
                    navigateTo="FindPatient"
                ></PatiendSideBackButton>
                {/* <div id="SidenavModal" class="sidenav">
                    <a id="action" className="pd-actions-btn  btn-primary" onClick={() => this.openModal()} >General Actions</a>
                </div> */}
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
                                    <ExpansionPanelSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <span className="icon-padding" ><i class="fa fa-plus gradient"></i></span>
                                        <Typography >Enter Data</Typography>
                                    </ExpansionPanelSummary>
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
                                    <Link to="/visit">
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
                {/* <Modal show={this.state.openGeneralActionsModal}>
                 <Modal.Header closeButton>
                   General Actions
                 </Modal.Header>
                 <Modal.Body>
                     <ul>
                         <li> Service History </li>
                         <li> Enter Data </li>
                         <li> Mark Patient Deceased </li>
                         <li> Void Patient </li>
                     </ul>
                 </Modal.Body>
                </Modal> */}
            </div>

        )
    }
}

export default PatientDetail

