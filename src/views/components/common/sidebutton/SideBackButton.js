
import React from 'react'
import { history } from '../../../../history'
import './sidebutton.css'

export {
    PatiendSideBackButton,
    WorkflowSideBackButton,
    EventSideBackButton,
}

function PatiendSideBackButton({navigateTo}) {
    return (
        <div id="patientSidenav" className="sidenav">
            <a id="back" className="pd-actions-btn" onClick={() => history.push(`/${navigateTo}`)} >
                <span className ='back-arrow'><i class="fa fa-arrow-left"></i></span>
                Go Back
            </a>
        </div>
    )
}

function WorkflowSideBackButton({navigateTo}) {
    return (
        <div id="workflowSidenav" className="sidenav">
            <a id="back" className="pd-actions-btn" onClick={() => history.push(`/${navigateTo}`)} >
              <span className ='back-arrow'><i class="fa fa-arrow-left"></i></span>
              Go Back 
            </a>
        </div>
    )
}

function EventSideBackButton({navigateTo}) {
    return (
        <div id="eventSidenav" className="sidenav">
            <a id="back" className="pd-actions-btn" onClick={() => history.push(`/${navigateTo}`)} >
              <span className ='back-arrow'><i class="fa fa-arrow-left"></i></span>
              Go Back 
            </a>
        </div>
    )
}
