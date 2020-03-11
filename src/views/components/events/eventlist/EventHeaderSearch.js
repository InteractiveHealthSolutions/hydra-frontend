import React, { useState, useEffect } from 'react'
import './eventlist.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import Select from 'react-select';
import { LoaderDots } from "../../common/loader/LoaderDots"
import { locationAction } from '../../../../state/ducks/location';
import { history } from '../../../../history';


function EventHeaderSearch(props) {

    const [locationData, setLocationData] = useState([])
    const [selectedLocation, setSelectedLocation] = useState("")
    const [availableLocation, setAvailableLocation] = useState([])

    useEffect(() => {
        if (props.locationList !== undefined && props.locationList.results !== undefined) {
            filterLocation(props.locationList.results)
        }
    }, [props.locationList])

    useEffect(() => {
        props.getAllLocation()
    }, [])

    async function filterLocation(list) {
        let array = []
        if (list) {
            await list.forEach(element => {
                if (element.tags) {
                    if (filterLocationByTag(element.tags).length > 0) {
                        array.push(element)
                    }
                }
            });
        }
        await locationListFormat(array);
    }

    function filterLocationByTag(list) {
        let array = []
        let valid = true;
        if (list) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].name === "Country" || list[index].name === "City/Village" || list[index].name === "Province/State") {
                    valid = false
                    break;
                }
            }
            if (valid) {
                return list
            }
        }
        return array
    }

    async function locationListFormat(list) {
        let array = []
        array.push(
            {
                label: "",
                value: ""
            })
        list.forEach(data => {
            array.push(
                {
                    label: data.name,
                    value: data.uuid
                }
            )
        })

        await setLocationData(array)
    }

    function handleChangeLocation(location) {
        setSelectedLocation(location)
        props.handleChangeLocation(location)
    }
    function handleAddEvent() {
        localStorage.setItem("active-event", JSON.stringify(""))
        history.push('/eventplanner');
    }

    if (props.isLoading) return <LoaderDots withMargin="true" height={40} width={40} />;
    return (

        <div className="row event-maincard-header">
            <div className="col-sm-2 col-md-3"><h4 className="header_title">Events List</h4></div>
            <div className="col-sm-8 col-md-6"><label className="tags">Location</label>
                <Select
                    value={selectedLocation}
                    onChange={handleChangeLocation}
                    options={locationData}
                    className="select-dropdown sizing"
                    name="statetype"
                />
            </div>
            <div className="col-sm-2 col-md-3">
                <Link to="/eventcalendar">
                    <button className="btn btn-primary btn_custom_e">Calendar View</button>
                </Link>
                <button className="btn btn-primary btn_custom_e_add" onClick={handleAddEvent}>Add Event</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    locationList: state.location.locations,
    isLoading: state.event.loading
})
const mapDispatchToProps = {
    getAllLocation: locationAction.fetchLocations,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventHeaderSearch)  
