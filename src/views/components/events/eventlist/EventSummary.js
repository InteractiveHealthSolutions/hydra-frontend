import React, { useState, useEffect, useCallback } from 'react'
import Modal from 'react-bootstrap/Modal';
import './eventlist.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BarChart from '../../common/barchart';
import moment from 'moment'
import { ModalTemplate } from '../../../ui/modal/modalTemplate/ModalTemplate';

export default function EventSummary({ openModal, closeModal, event }) {

    const [memberList, setMemberList] = useState([])
    const [serviceList, setServiceList] = useState([])
    const [assetList, setAssetList] = useState([])
    const [personnelCost, setPersonnelCost] = useState(0)
    const [assetCost, setAssetCost] = useState(0)
    const [eventType, setEventType] = useState("")
    const [eventName, setEventName] = useState("")
    const [location, setLocation] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [currentActiveEvent, setCurrentActiveEvent] = useState("")


    function calculateCost(activeEvent) {
        let totalAssetCost = 0
        if (activeEvent.eventAssets !== undefined) {
            activeEvent.eventAssets.forEach(data => {
                totalAssetCost = totalAssetCost + data.quantity * data.actualCost
            })
        }
        setAssetCost(totalAssetCost)
    }

    function calculatePersonnel(activeEvent) {
        console.log("calculatePersonnel", activeEvent)

        var hours = Math.abs(moment(activeEvent.schedule.endDate).toDate() - moment(activeEvent.schedule.plannedDate).toDate()) / 3600000
        var totalCost = 0;
        activeEvent.eventParticipants.forEach(element => {
            if (element.participant.salaryType.name === "Daily") {
                totalCost = totalCost + (element.participant.salaryValue / 8) * hours
            } else if (element.participant.salaryType.name === "Monthly") {
                totalCost = totalCost + (element.participant.salaryValue / 173) * hours
            }
            else if (element.participant.salaryType.name === "Annual") {
                totalCost = totalCost + (element.participant.salaryValue / 2080) * hours
            }
        });
        setPersonnelCost(totalCost)
    }


    useEffect(() => {
        if (event !== undefined) {
            showEventSummary(event)
        }
    }, [event])


    function showEventSummary(activeEvent) {
        if (activeEvent.length <= 0) {
            return
        }
        calculateCost(activeEvent)
        calculatePersonnel(activeEvent)
        setCurrentActiveEvent(activeEvent.uuid)
        setEventType(activeEvent.eventType.name)
        setEventName(activeEvent.name)
        setStartDate(moment(activeEvent.schedule.plannedDate).format("YYYY-MM-DD"))
        setEndDate(moment(activeEvent.schedule.endDate).format('YYYY-MM-DD'))
        setLocation(activeEvent.location.display)
        setMemberList(activeEvent.eventParticipants.map(data => {
            return <label key={data.participant.uuid} style={{ textAlign: 'center', color: 'gray', margin: 'inherit' }}>{data.participant.display}</label>
        }))
        setServiceList(activeEvent.eventServices.map(data => {
            return <tr>
                <td>{data.service.name}</td>
                <td>{"$ " + data.actualCost ? data.actualCost : 0}</td>
            </tr>
        }))
        setAssetList(activeEvent.eventAssets.map(data => {
            return <tr>
                <td>{data.asset.name}</td>
                <td>{data.quantity}</td>
                <td>{"$ " + data.actualCost ? data.actualCost : 0}</td>
            </tr>
        }))
    }
    console.log("showEventSummary", openModal)
    return (
        <Modal
            size="lg"
            show={openModal}
            onHide={closeModal}
            style={{ marginTop: '80px' }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Event Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }} >
                <div className="form-group">
                    {
                        calculatePersonnel(activeEvent)
                            (currentActiveEvent === '40513427-a6cf-4a9a-a64f-cad0a131533f') ?
                            <>
                                <div className="row">
                                    <ExpansionPanel style={{ width: '100%', margin: '18px' }}>
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            style={{ backgroundColor: "var(--label-color)", height: '45px' }}
                                        >
                                            <div className='row'>
                                                <div className='col-sm-6'>
                                                    <label style={{ color: '#fff' }} >Total Cost</label>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <label style={{ marginLeft: '349px', color: '#fff' }}>$712.15</label>
                                                </div>
                                            </div>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>

                                            <table className="" id="assetsTable">
                                                <thead>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Total cost per screening</td>
                                                        <td>$ 1.78</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total cost per presumptive</td>
                                                        <td>$ 11.87</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total cost per patient</td>
                                                        <td>$ 356.08</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cost per hour</td>
                                                        <td>$ 178.04</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </div>
                                <div className='row' style={{ marginBottom: '50px' }} >
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <div class="card" >
                                            <div class="card-header" style={{ background: '#fff', height: '40px', height: '45px' }}>
                                                <label style={{ fontSize: '13px', marginLeft: '18px' }}>Number Needed to Screen</label>
                                            </div>
                                            <div class="card-body" style={{ background: 'var(--label-color)', height: '50px', color: '#fff' }}>
                                                <h2 style={{ marginTop: '-15px', marginLeft: '67px' }} >200</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div class="card" >
                                            <div class="card-header" style={{ background: '#fff', height: '40px' }}>
                                                <label style={{ fontSize: '13px', marginLeft: '66px' }}> Yield  (%)</label>
                                            </div>
                                            <div class="card-body" style={{ background: 'var(--label-color)', height: '54px', color: '#fff' }}>
                                                <h2 style={{ marginTop: '-12px', marginLeft: '60px' }} >0.50</h2>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-sm-2"></div>
                                </div>
                                <BarChart></BarChart>
                            </>
                            : ""
                    }
                    {/* total cost */}
                    <div className="row">
                        <div className="card" style={{ width: '100%', margin: '20px' }}>
                            <div className="card-header" style={{ background: 'var(--label-color)', color: 'white', height: '45px' }}>
                                <label>Asset And Personnel Cost</label>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Asset Cost:</label> &nbsp;&nbsp; <label >{assetCost}</label>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Personnel Cost:</label> &nbsp;&nbsp; <label >{personnelCost.toFixed(2)}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="row">
                        <div className="card" style={{ width: '100%', margin: '20px' }}>
                            <div className="card-header" style={{ background: 'var(--label-color)', color: 'white', height: '45px' }}>
                                <label>Event Details</label>
                            </div>
                            <div className="card-body">

                                <div className="row">
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Event Type:</label> &nbsp;&nbsp; <label >{eventType}</label>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Event Name:</label> &nbsp;&nbsp; <label >{eventName}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Start Date:</label> &nbsp;&nbsp; <label >{startDate}</label>
                                    </div>
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>End Date:</label> &nbsp;&nbsp; <label >{endDate}</label>
                                    </div>
                                </div>
                                <div className="row">
                                    {/* <div className='col-sm-6'>
                                    <label style={{ fontWeight: 'bold' }}>Location Type:</label>&nbsp;&nbsp; <label>Hospital</label>
                                </div> */}
                                    <div className='col-sm-6'>
                                        <label style={{ fontWeight: 'bold' }}>Location :</label>&nbsp;&nbsp; <label>{location}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* member */}
                    <div className="row">
                        <div className="card" style={{ width: '100%', margin: '20px' }}>
                            <div className="card-header" style={{ background: "var(--theme-secondary-color)", color: 'white', height: '45px' }}>
                                <label>Members</label>
                            </div>
                            <div className="card-body" style={{ marginRight: '24px' }}>
                                {memberList}
                            </div>
                        </div>
                    </div>
                    {/* service */}
                    <div className="row">
                        <div className="card" style={{ width: '100%', margin: '20px' }}>
                            <div className="card-header" style={{ background: "var(--label-color)", color: 'white', height: '45px' }}>
                                <label>Services</label>
                            </div>
                            <div className="card-body">
                                <table className="" id="assetsTable">
                                    <thead>
                                        <tr className="header">
                                            <th style={{ width: '20%' }}>Service Name</th>
                                            <th style={{ width: '20%' }}>Service Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceList}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Assets */}
                    <div className="row">
                        <div className="card" style={{ width: '100%', margin: '20px' }}>
                            <div className="card-header" style={{ background: "var(--theme-secondary-color)", color: 'white', height: '45px' }} >
                                <label>Assets</label>
                            </div>
                            <div className="card-body">
                                <table className="" id="assetsTable">
                                    <thead>
                                        <tr className="header">
                                            <th style={{ width: '20%' }}>Asset Name</th>
                                            <th style={{ width: '20%' }}>Quantity</th>
                                            <th style={{ width: '20%' }}>Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assetList}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal.Body>
        </Modal>


    )
}


