import React from 'react';
import { Link } from 'react-router-dom';
import Sortable from 'react-sortablejs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { componentService } from '../../../services';
import './component.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Card from '@material-ui/core/Card';
import { componentAction } from '../../../state/ducks/stages'
import { connect } from 'react-redux';
import { WorkflowSideBackButton } from '../common/sidebutton/SideBackButton'
import Loaders from "../common/loader/Loader"
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.sortable = null;
        this.state = {
            items: [],
            openModal: false,
            availableComponents: [],    
            componentToAdd: 0,
            listItems: [],
            components: [],
            isCreateStage: false,
            btnTxt: 'Create',
            stageToAdd: '',
            newItemList: [],
            isCreate: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.components = [];

    }
     //init() oncreateview() 
    async UNSAFE_componentWillMount() {
        await this.props.getAllComponents()
        await this.props.getAllPhaseComponent()
    }

    async UNSAFE_componentWillReceiveProps(newProps) {

        if (newProps.phaseComponentList !== undefined) {
            await this.setState({
                newItemList: newProps.phaseComponentList,
                loading: false
            }, () => {
                if (this.state.newItemList) {
                    this.displayComponents();
                }
            })

        }
        if (newProps.componentList !== undefined) {
            await this.setState({
                availableComponents: newProps.componentList.components,
                loading: false
            }, () => {
                if (this.state.availableComponents) {
                    this.populateDropDown();
                }
            })
        }
    }

    async saveComponent() {
        let component = this.getComponentById()
        let newComponentMap = {
            "displayOrder": component.componentId,
            "hydramoduleComponent": component.uuid,
            "hydramodulePhase": localStorage.getItem("active-phases-uuid"),
            "hydramoduleWorkflow": localStorage.getItem("active-workflow-uuid")
        }

        await this.props.savePhaseComponent(newComponentMap);
        await this.props.getAllPhaseComponent();

    }


    async createStage() {
        const newStage = {
            name: this.state.stageToAdd
        }
        await this.props.saveComponent(newStage)
        await this.props.getAllComponents();
        this.state.stageToAdd = "";
        this.setState({
            isCreateStage: false
        })

    }


    deleteComponents = (component) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {

                        this.deletePhaseComponents(component.uuid);

                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    async deletePhaseComponents(uuid) {
        await this.props.deletePhaseComponent(uuid);
        await this.props.getAllPhaseComponent();
    }


    displayComponents() {
        const { newItemList } = this.state
        console.log("newItemList", newItemList);
        this.setState({
            items: newItemList,
            listItems: newItemList.map(val =>
                (
                    <li className="block-list-component"
                        key={val.hydramoduleComponent.componentId}
                        data-id={val.hydramoduleComponent.componentId}>
                        <Card style={{ margin: '4px' }}>
                            <div className="row c-row" >
                                <div className="col-sm-1 col-md-1 col-lg-1" style={{ cursor: 'pointer' }} onClick={((e) => this.handleClick(e, val))}>
                                    <img className="component-icon" src={require('../../../assets/components.png')} alt="" />
                                </div>
                                <div className="col-sm-10 col-md-10 col-lg-10" style={{ cursor: 'pointer' }} onClick={((e) => this.handleClick(e, val))} >
                                    <h6 className="list-content-component" > {val.hydramoduleComponent.name}</h6>
                                </div>
                                <div className="col-sm-1 col-md-1 col-lg-1" >
                                    <span onClick={() => this.deleteComponents(val)} > <i className="fas fa-times delete-icon-component"></i></span>
                                </div>
                            </div>
                        </Card>
                    </li>))
        });
        //     this.getAllComponentOptions()
        // });
    }

    getComponentById() {
        let newComponent = {};
        this.state.availableComponents.forEach(element => {
            if (element.componentId == this.state.componentToAdd) {
                newComponent = element;
            }
        });
        return newComponent;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.state.isCreateStage ? this.createStage() : this.saveComponent();
        this.closeModal();
    }

    handleChange(e) {

        this.state.isCreateStage ?
            this.setState({ stageToAdd: e.target.value })
            : this.setState({ componentToAdd: e.target.value });
    }

    openModal() {
        this.setState({
            isCreateStage: false,
            openModal: true
        });
    }
    openCreateModal() {
        this.setState({
            isCreateStage: true,
            openModal: true
        });
    }

    closeModal() {
        this.setState({ isCreateStage: false, openModal: false });
    }
    handleClick(e, val) {
        if (val) {
            this.props.setActiveComponent(val)
        }
    }

    handleCreateStage = (e) => {
        e.preventDefault();
        this.state.isCreateStage ?
            this.setState({ isCreateStage: false, btnTxt: 'Create' })
            : this.setState({ isCreateStage: true, btnTxt: 'Add' })

    }

    itemIncludes(element) {
        var includes = false;
        for (var i = 0; i < this.state.items.length && includes === false; i++) {
            if (this.state.items[i].componentUUID === element.uuid) includes = true;
        }

        return includes;

    }

    reorder(order) {
        let tempArray = [];
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < this.state.listItems.length; j++) {
                if (order[i] == this.state.listItems[j].key) {
                    tempArray.push(this.state.listItems[j]);
                }
            }
        }
        this.setState({ listItems: tempArray });
    }

    populateDropDown() {
        this.components = [];
        this.state.availableComponents.forEach(element => {
            if (this.itemIncludes(element)) {
                this.components.push(
                    <option key={element.componentId} disabled>{element.name}</option>
                );
            }
            else {
                this.components.push(
                    <option key={element.componentId} value={element.componentId}>{element.name}</option>
                );
            }
        });
        return this.components;
    }

    //this function needs to refactor
    modalSWitch() {
        switch (this.state.isCreateStage) {
            case false:
                return <div className="form-group" id="add">
                    <label htmlFor="componentName">Select a Stage</label>
                    <select className="form-control" name="componentName" value={this.state.componentToAdd} onChange={this.handleChange} required>
                        <option></option>
                        {this.components}
                    </select>
                </div>
            case true:
                return <div className="form-group" id="create">
                    <label htmlFor="componentName">Create a Stage</label>
                    <input type="text" className="form-control" value={this.state.stageToAdd} autoComplete="off" pattern="^[a-zA-Z\s]*$" name="stageName" onChange={this.handleChange} required />
                </div>
            default:
        }
    }

    render() {
        if (this.props.isloading) return <Loaders />;
        return (
            <>
                <CardTemplate
                    title={localStorage.getItem("active-phases-name") + "- Stages"}
                    action={
                        <>
                            <button className="btn btn-primary adjust-space" onClick={() => this.openModal()}>Add Stage</button>
                            <button className="btn btn-primary" onClick={() => this.openCreateModal()}>Create Stage</button>
                        </>
                    }
                >
                    <Sortable
                        options={{
                            animation: 100,
                            easing: "cubic-bezier(1, 0, 0, 1)"
                        }}
                        ref={(c) => {
                            if (c) {
                                this.sortable = c.sortable;
                            }
                        }}
                        onChange={(order) => {
                            this.reorder(order);
                        }}
                        tag="ul">
                        {this.state.listItems}
                    </Sortable>
                </CardTemplate>
                <Modal show={this.state.openModal} onHide={() => this.closeModal()} style={{ marginTop: '100px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Stage</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            {
                                this.modalSWitch()
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant="primary">
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        );
    }


}

const mapStateToProps = state => ({
    componentList: state.stages.components,
    phaseComponentList: state.stages.phaseComponents,
    isloading: state.stages.loading
})

const mapsDispatchToProps = { //action 
    getAllComponents: componentAction.fetchcomponents,
    saveComponent: componentAction.saveComponent,
    setActiveComponent: componentAction.setActiveComponent,
    savePhaseComponent: componentAction.savePhaseComponent,
    getAllPhaseComponent: componentAction.fetchPhaseComponent,
    deletePhaseComponent: componentAction.deletePhaseComponent
}
export default connect(mapStateToProps, mapsDispatchToProps)(Component);