import React from 'react'
import Card from '@material-ui/core/Card';
import moment from 'moment'
import './eventlist.css';

export default function EventCardList({ event, switchPage, eventStatus ,deleteEvent}) {
    return (
        <Card style={{ margin: '2px' }} key={event.uuid}>
            <li className="list-group-item"  key={event.uuid} >
                <div className="row" >
                    <div className="col-md-1">
                        <img style={{ height: '45px', width: '45px' }}
                            src={require('../../../../assets/formo.png')}
                            alt="" />
                    </div>
                    <div className=" col-md-5" style={{ marginTop: '16px', marginBottom: 'auto' }}>
                        <h6>{event.name}</h6>
                    </div>
                    <div className="col-md-3" style={{ marginTop: '2px', marginBottom: 'auto' }}>
                        <p className="list-p">
                            <span style={{ fontSize: '12px' }}>
                                {moment(event.schedule.plannedDate).format('YYYY-MM-DD')}
                            </span>
                            <label style={{ marginRight: '6px', marginLeft: '6px' }}> to </label>
                            <span style={{ fontSize: '12px' }}>
                                {moment(event.schedule.endDate).format('YYYY-MM-DD')}
                            </span>
                        </p>
                        <p className="list-p">{event.location.display}</p>
                    </div>
                    <div className="col-sm-2" style={{ marginTop: '11px', marginBottom: 'auto' }}>
                        <button
                            onClick={() => switchPage(eventStatus(event), event)}
                            type="button"
                            className="btn btn-sm btn-primary btn-el-gobal"
                        >{eventStatus(event)}
                        </button>
                    </div>
                    <div className="col-lg-1 col-md-1 col-sm-1 align-middle hover-zoom" >
                        {
                            (event.uuid === '27f83f15-4980-42a7-8f3c-7e6468487084') ? "" :
                                <span 
                                 className="d-inline-block" 
                                 tabIndex="0"
                                 data-toggle="tooltip" 
                                 title="Remove" 
                                 onClick={() => deleteEvent(event)}
                                 >
                                    <i className="fas fa-times delete-icon-eventlist"></i>
                                </span>
                        }

                    </div>
                </div>
            </li>
        </Card>
    )
}
