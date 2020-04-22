import React, { useState, useEffect } from 'react';
import './locationmanagement.css';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { locationAction } from '../../../../../state/ducks/location'
import Loaders from '../../../loader/Loader';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function LocationManagement(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "display", width: 300
        },
        {
            headerName: "Description", field: "description", width: 300
        },
        {
            headerName: "City/village", field: "cityVillage", width: 200
        },
        {
            headerName: "Address", field: "address1", width: 200
        },
        {
            headerName: "Action",
            template:
                `
            <button class ="edite" className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
            `
            , width: 165
        },
    ]);
    const [rowData, setRowData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [listItems, setListItems] = useState([]);
    const [locationToAdd, setLocationToAdd] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [activeLocation, setActiveLocation] = useState({});


    // useEffect(() => {
    //     let deleteListener = document.getElementsByClassName('delete');
    //     for (let i = 0; i < deleteListener.length; i++) {
    //         deleteListener[i].addEventListener("click", function (event) {
    //             alert('')
    //             //deleteLocation(event, "");
    //         })
    //     }

    // }, [])

    
    useEffect(() => {

        let edite = document.getElementsByClassName('edite');
        //console.log("edite docmuentdddd ",edite);
        for (let i = 0; i < edite.length; i++)
            edite[i].addEventListener("click",function(event) {
                event.preventDefault();
               // setOpenModal(true);
              }, false)

    }, [])

    useEffect(() => {
        if (props.locationLists !== undefined) {
           /// console.log("locationLists", props.locationLists);
            setRowData(props.locationLists.results)
        }

        let edite = document.getElementsByClassName('edite');
      //  console.log("edite docmuent ",edite);

    }, [props.locationLists])


    useEffect(() => {
        getLocation();

    }, []);

    async function getLocation() {
        await props.getAllLocation();
    }




    function onRowSelected(event) {

       // console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(event) {
        //console.log('onCellClicked: ' + JSON.stringify(event.data));
        setActiveLocation(event.data)
    };

    function openModall() {
        setOpenModal(true);
    }
    function closeModal() {
        setOpenModal(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const locationForm = {
            name: locationToAdd,
            description: description,
            address1: address,
            address2: landmark,
            cityVillage: city,
            stateProvince: state
        }
        await props.saveLocation(locationForm)
        await props.getAllLocation()
        closeModal();
    }
    function handleChange(e) {
      //  console.log("prope", e.target.name);
        switch (e.target.name) {
            case "locationName":
                setLocationToAdd(e.target.value);
                break;
            case "description":
                setDescription(e.target.value);
                break;
            case "address":
                setAddress(e.target.value);
                break;
            case "landmark":
                setLandmark(e.target.value);
                break;
            case "city":
                setCity(e.target.value);
                break;
            case "state":
                setState(e.target.value);
                break;
            default:

        }

    }

    ///this function need to be generic 
    function deleteLocation(e, location) {
        e.preventDefault();
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }


    async function deleteLocations(location) {

    }

    if (props.isloading) return <Loaders />;
    return (
        <div className="row container-fluid l-main-container">
            <div className="card fp-header">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-8 col-sm-4">
                            <span className="text-muted"><i className="fas fa-map-marker-alt text-muted" />  Location Management</span>
                        </div>
                        <div className="col-md-4 col-sm-2">
                            <button className="fp-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i> Create New</button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-center">
                        <div
                            className="ag-theme-balham"
                            style={{
                                height: '421px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={rowData}
                                modules={AllCommunityModules}
                                onRowSelected={onRowSelected}
                                onCellClicked={event => { onCellClicked(event) }}
                                enableSorting
                                enableFilter
                                rowAnimation
                                enableRangeSelection={true}
                                pagination={true}
                                isExternalFilterPresent={true}
                                enableColResize="true"
                            >
                            </AgGridReact>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={openModal}
                onHide={() => closeModal()}
                style={{ marginTop: '100px' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Location</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body style={{ height: '309px', overflowY: 'auto' }} >
                        <div className='form-group'>
                            <label htmlFor='locationName'>Name</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                value={locationToAdd}
                                pattern='^[a-zA-Z\s]*$'
                                name='locationName'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='description'>Description</label>
                            <textarea
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                name='description'
                                value={description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <div className="row">
                                <div className="col-md-2 col-sm-6 ">
                                    <label htmlFor='address'>Address</label>
                                </div>
                                <div className="col-md-10 col-sm-6 ">
                                    <input
                                        type='text'
                                        className='form-control'
                                        autoComplete='off'
                                        name='address'
                                        value={address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='landmark'>Landmark</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                pattern='^[a-zA-Z\s]*$'
                                name='landmark'
                                value={landmark}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='city'>City/Village</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                pattern='^[a-zA-Z\s]*$'
                                name='city'
                                value={city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='state'>State/Province</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                pattern='^[a-zA-Z\s]*$'
                                name='state'
                                value={state}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' variant='primary'>Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

        </div>
    )

}

const mapStateToProps = state => ({
    locationLists: state.location.locations,
    isloading: state.location.loading
});

const mapDispatchToProps = {
    getAllLocation: locationAction.fetchLocations,
    saveLocation: locationAction.saveLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationManagement) 