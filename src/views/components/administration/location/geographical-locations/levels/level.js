import React from 'react';
import { connect } from "react-redux";

import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate';
import CreatableSelect from 'react-select/creatable';
import AutoSearchComplete from "../../../workflowmanagement/formbuilder/formComponents/widgets/AutoSearchComplete";
import Modal from 'react-bootstrap/Modal';
import { locationAction } from "../../../../../../state/ducks/location"
import { confirmAlert } from 'react-confirm-alert';
import { createNotification } from '../../../../../../utilities/helpers/helper';

const createOption = (label) => ({
    label,
    value: "newly created",
});

class Level extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            definedLevels: [],
            level: 1,
            isLoading: false,
            options: [],
            value: undefined,
            selectedValues: [],
            openViewModal: false,
            viewLocationType: []

        }
    }
    openModall = e => {
        e.preventDefault();
        this.formatForOptionAndAddInState("");
    };
    async componentWillMount() {
        await this.props.getAllLocationTypes();
        await this.optionBuilder();
        await this.formatForOptionAndAddInStateForEdit();

    }
    async componentWillReceiveProps(nextProps) {

        if (nextProps.locationTypes != undefined && nextProps.locationTypes.payload != undefined) {
            await this.optionBuilder();
            await this.setState({ viewLocationType: nextProps.locationTypes.payload })
       //     await this.formatForOptionAndAddInStateForEdit()
        }
    }
    optionBuilder() {
        if (this.props.locationTypes != undefined && this.props.locationTypes.payload != undefined) {
            this.setState({ options: [] })
            this.props.locationTypes.payload.locationTypes.forEach(element => {
                this.state.options.push({
                    "label": element.name,
                    "value": element.locationTypeId

                })
            });
        }
    }
    async formatForOptionAndAddInStateForEdit () {
        await this.setState({definedLevels : []})
        if (this.props.locationTypes != undefined && this.props.locationTypes.payload != undefined) {
            for(let i = 0 ; i <this.props.locationTypes.payload.locationTypes.length ; i++ ) {
                const { definedLevels ,level} = this.state;

                var uniqueKey = this.props.locationTypes.payload.locationTypes[i].locationTypeLevel;
               await this.setState({level : uniqueKey});
                var option = {
                    title: "Option",
                    key: uniqueKey,
                    controlId: "optionArray" + uniqueKey + Date.now()
                };
                // if (e) {
                //     if (e.uuid) {
                       option.key = uniqueKey;
                        option.value = this.props.locationTypes.payload.locationTypes[i].name;
                //    }
              //  }
        
                // setting the new option in state
                 await this.setState({
                     definedLevels: [...definedLevels, option],
                     [uniqueKey+'name'] : option.value,
                     [uniqueKey+'id'] : this.props.locationTypes.payload.locationTypes[i].locationTypeId
                 });
            //await this.state.definedLevels.push({option});
            }
          
           
        }


       
    };
    
    async formatForOptionAndAddInState() {
        const { definedLevels, level } = this.state;
        await this.setState({ level: level + 1 });
        var uniqueKey = this.state.level;
        var option = {
            title: "Option",
            key: uniqueKey,
            controlId: "optionArray" + uniqueKey + Date.now()
        };
        this.setState({
            definedLevels: [...definedLevels, option]
        });

        // setting the new option in state

    };
    deleteLocationType(e,key) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.deleteOption(e,key)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
        
    }
    async deleteOption(e, key) {
        var array = [...this.state.definedLevels]; // make a separate copy of the array
        array = array.filter(item => item.key !== array.length + 1);
        await this.setState({ definedLevels: array });

        await this.setState({ level: this.state.level - 1 })
        array = this.state.selectedValues;
        var existingObj = array.filter(data => data.level != this.state.level + 1);
        await this.setState({ selectedValues: existingObj });
        let locationType = this.props.locationTypes.payload.locationTypes[this.props.locationTypes.payload.locationTypes.length-1];
        let locationTypeToRetire = {
            locationTypeId : locationType.locationTypeId,
            retired : true,
            locationTypeLevel : locationType.locationTypeLevel,
            name : locationType.name
        }
        await this.props.saveLocationType(locationTypeToRetire);
    
        await window.location.reload();

    };
    handleCreate = (e, id) => {
        this.setState({ isLoading: true });
        // console.group('Option created');
        console.log('Wait a moment...');
        setTimeout(() => {
            const { options } = this.state;
            const newOption = createOption(e);
            console.log(newOption);
            // console.groupEnd();
            this.setState({
                isLoading: false,
                options: [...options, newOption],
                [id]: newOption,
            });
            let array = this.state.selectedValues;
            var existingObj = array.filter(data => data.level != id);
            this.state.selectedValues.push({
                "level": id,
                "value": newOption,
                "created": false

            })
           this.setState({['value'+id]:newOption})
        }, 1000);
    };
    handleChange = (e, id) => {
        //  console.group('Value Changed');

        //this.setState({ value: e });
        let array = this.state.selectedValues;
        var existingObj = array.filter(data => data.level != id);
        this.state.selectedValues.push({
            "level": id,
            "value": e,
            "created": false
        })

    };

    saveChanges(e) {
        confirmAlert({
            title: 'Save Changes',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.handleSubmit(e)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    async handleSubmit(e) {
        for (let i = 0; i < this.state.selectedValues.length; i++) {
            let locationType = {};
            if ((this.state.selectedValues[i].value.value == "newly created") || this.state.selectedValues[i].level >= this.props.locationTypes.payload.locationTypes.length) {
                locationType = {
                    name: this.state.selectedValues[i].value.label,
                    locationTypeLevel: this.state.selectedValues[i].level,
                    retired: false
                }
            }
            else {
                    var array = this.props.locationTypes.payload.locationTypes;
                    array = array.filter(item => item.locationTypeLevel == this.state.selectedValues[i].level);
                    if(JSON.stringify(array) == '[]') {
                        locationType = {
                            locationTypeId: this.state.selectedValues[i].value.value,
                            locationTypeLevel: this.state.selectedValues[i].level,
                            name: this.state.selectedValues[i].value.label,
                            retired: false
                        }
                    }
                    else {
                        locationType = {
                            locationTypeId: array[0].locationTypeId,
                            locationTypeLevel: array[0].locationTypeLevel,
                            name: this.state.selectedValues[i].value.label,
                            retired: false
                        }
                    }
                
              
            }
            await this.props.saveLocationType(locationType);
        }
        await this.setState({ selectedValues: [] });
        await createNotification("success","Geographical Level Updated")
        await window.location.reload();
    }
    render() {
        const { isLoading, options, value } = this.state;

        return <>
            <CardTemplate
                title="Geographical Hierarchy"
                action={
                    <>
                        <button type="button" onClick={() => this.saveChanges()} className="fp-btn btn btn-primary "><i class="fas fa-plus"></i> Save</button>

                    </>}
            >
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                    <form>
                        <div className="form-group row">
                            <label className="col-form-label col-sm-4 " htmlFor="identifier">Level 1</label>
                            <div className="col-sm-7">
                                <input type="text" value="Country"
                                    className='form-control'
                                    autoComplete='off'
                                    disabled
                                />
                            </div>
                        </div>
                        {this.state.definedLevels.map(definedOption => (
                            <div className="form-group row" key={definedOption.key}>

                                <label className="col-form-label col-sm-4 " htmlFor="identifier"> {"Level " + definedOption.key}</label>
                                <div className="col-sm-7">
                                    <CreatableSelect
                                        isClearable
                                        isDisabled={isLoading}
                                        isLoading={isLoading}
                                        onChange={(evt) => this.handleChange(evt, `${definedOption.key}`)}
                                        onCreateOption={(evt) => this.handleCreate(evt, `${definedOption.key}`)}
                                        options={options}
                                        id={definedOption.key}
                                        value={this.state['value'+definedOption.key]}
                                        defaultValue={[{ label: this.state[definedOption.key+'name'], value: this.state[definedOption.key+'id'] }]}

                                    />
                                </div>

                                {/* <div className="col-sm-1" style={{ textAlign: "center" }}>
                                    <span
                                        onClick={e => this.deleteOption(e, definedOption.key)}
                                    >
                                        <label className="fas fa-times"></label>
                                    </span>
                                </div> */}
                            </div>
                        ))}
                        <button
                            name="addLevel"
                            type="button"
                            className="btn btn-primary"
                            style={{
                                textAlign: "center",
                                //float: "right",
                                // marginTop: "5px",
                                marginLeft: "750px"
                            }}
                            onClick={this.openModall}
                        >
<i class="fa fa-plus" aria-hidden="true"></i>
              </button>
                        {
                            this.state.definedLevels.length >= 1 ?
                                <button
                                    name="removeLevel"
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{
                                        textAlign: "center",
                                        //float: "right",
                                        marginTop: "-65px",
                                        marginLeft: "700px",
                                    }}
                                    onClick={e => this.deleteLocationType(e, this.state.definedLevels.length)}
                                >
<i class="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                : ""

                        }



                    </form>

                </div>
                <div className="col-sm-2"></div>

            </CardTemplate>
        </>;
    }
}
const mapStateToProps = state => ({
    locationTypes: state.location.locationTypes
});

const mapDispatchToProps = {
    getAllLocationTypes: locationAction.getAllLocationTypes,
    saveLocationType: locationAction.postLocationType
}
export default connect(mapStateToProps, mapDispatchToProps)(Level);
