import React from 'react';
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {customDataTypeAction} from '../../../state/ducks/customdatatype';
import './AddLabTestAttribute.css'
class AddLabTestAttribute extends React.Component {
    constructor(props) {
        super(props);
        this.options = [];

        this.state = {
            openAddAttrModal : false,
            selectedDataType : '',
            showMultiSetOptions : false,
            multisetValues : [{name : '', sortOrder : ''}]
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDataType = this.handleChangeDataType.bind(this);
        this.handleChangeMultisetValues = this.handleChangeMultisetValues.bind(this);
        this.addMultiSetRow = this.addMultiSetRow.bind(this);

    }
    static propTypes = {
        customDataTypeList: PropTypes.array.isRequired
    };
    handleChangeMultisetValues(e) {
        if(["name" , "sortOrder"].includes(e.target.className)) {
          let multisetValues = [...this.state.multisetvalues];
          multisetValues[e.target.dataset.id][e.target.className] = e.target.value;
          this.setState({multisetValues});
        }
        else {
          this.setState({[e.target.name] : e.target.value})
        }
    }
    addMultiSetRow(e) {
      e.preventDefault();
      console.log('add'+e.target.value);
       this.setState((prevState) => ({
         multisetValues : [...prevState.multisetValues,{name:"",sortOrder:""}]
       }));
    }
    handleChangeDataType(selectedDataType) {
      console.log('value '+JSON.stringify(selectedDataType));
      if(selectedDataType.value == 'org.openmrs.customdatatype.datatype.ConceptDatatype')
      {
        this.setState({selectedDataType : selectedDataType.label , showMultiSetOptions : true})
      }
      else 
      {
        this.setState({selectedDataType : selectedDataType.label, showMultiSetOptions : false})
      }
      
    }
    async componentWillMount() {
        await this.props.getAllCustomDataType();
        await this.customdatatypeOptions();
      
    }
    customdatatypeOptions() {
        this.props.customDataTypeList.results.forEach(element => {
            this.options.push({
              "label" : element.display,
              "value" : element.datatypeClassname
            })
        });    
     }
    
    handleSubmit() {
        this.closeAddAttrModal();
    }
    openAddTestAttrModal() {
        this.setState({ openAddAttrModal: true });
    }
    
    closeAddTestAttrModal() {
        this.setState({showMultiSetOptions:false})
        this.props.close();
    }
    
    render() {
        console.log('add '+this.props.test);
        const {selectedDataType,multisetValues} = this.state;
        return(
         <Modal show={this.props.show} onHide={() => this.closeAddTestAttrModal()} backdrop="static" style={{ marginTop: '40px' }}>
         <Modal.Header closeButton>
             <Modal.Title>Add Attribute Type</Modal.Title>
         </Modal.Header>
         <form onSubmit={this.handleSubmit}>
             <Modal.Body>
             <div className="form-group row">
                        <label htmlFor="rconcept" class="col-sm-4 col-form-label required">Lab Test Type</label>
                        <div class="col-sm-8">
                          {
                            this.props.labTestAvailable  &&
                              <input type="text" className="form-control" value={this.props.test.testType} name="testType" required readOnly/>
                          }
                          {
                            !this.props.labTestAvailable  &&
                            <input type="text" className="form-control"  name="testType" required/>

                          } 
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="name" class="col-sm-4 col-form-label required">Name</label>
                        <div class="col-sm-8">
                          <input type="text" className="form-control" name="name" required />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="description" class="col-sm-4 col-form-label">Description</label>
                        <div class="col-sm-8">
                        <textarea class="form-control" rows="2" name="description"></textarea>
                        </div>
                      </div>
                      <div class="form-group row">
                        <div className="col-sm-4">
                        <label htmlFor="minocc" className="col-form-label required">Is Required</label>
                        </div>
                          <div className="col-sm-8">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="minocc" value="1"required />
                                      <label className="form-check-label" htmlFor="minocc" >
                                        Yes
                                      </label>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="form-check">
                                    <input className="form-check-input" type="radio" name="minocc" value="0" />
                                    <label className="form-check-label" htmlFor="minocc">
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                       </div>

                      
                      <div className="form-group row">
                        <label htmlFor="groupname" class="col-sm-4 col-form-label">Group Name</label>
                        <div class="col-sm-8">
                          <input type="text" className="form-control" name="groupname" required />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="datatype" class="col-sm-4 col-form-label requo">Data Type</label>
                        <div class="col-sm-8">
                          <Select
                            value={selectedDataType.label}
                            onChange={this.handleChangeDataType}
                            options={this.options}
                            className="select-dropdown"
                            name="datatype"

                          />
                      </div>
                      </div>
                      { this.state.showMultiSetOptions &&
                    
                      <div className = "row">
                          <div className="form-group row" style={{marginLeft : '2px'}}>
                      <label htmlFor="multisetname" class="col-sm-4 col-form-label">Multiset Name</label>
                      <div class="col-sm-8">
                        <input type="text" className="form-control" name="multisetname" style={{width:'305px',marginLeft : '4px'}} required />
                      </div>
                    </div>
                  
                        <div className = "col-sm-9">
                         Add MultiSet Values 
                        </div>
                        <div className = "col-sm-3">
                        <button className="btn btn-primary btn-round" onClick={this.addMultiSetRow}><i class="fas fa-plus-circle"></i></button>
                        </div>
                       <div className = "col-sm-6">
                        Multiset Name
                       </div>
                       <div className = "col-sm-6">
                        Sort Order
                       </div>
                      </div>
                      }
                      {
                        this.state.showMultiSetOptions &&
                            multisetValues.map((val,id) =>{
                            let multisetname = `name-${id}`;
                            let multisetorder = `order-${id}`;
                            return(
                              
                              <div className = "form-group row">
                                <div class="col-sm-6">
                                  <input type="text" className="form-control" name={multisetname} data-id={id} value={multisetValues[id].name}required />
                                </div>
                                <div class="col-sm-6">
                                  <input type="number" className="form-control" name={multisetorder} data-id={id} value={multisetValues[id].sortOrder}required />
                                </div>
                              </div>
                            
                            );
                          })
                      }
                                            
             </Modal.Body>
             <Modal.Footer>
                        
                        <button type="submit" class="btn btn-primary">
                            Save
                        </button>

                    </Modal.Footer>
                </form>
         </Modal>
        );
    }
}

const mapStateToPops = state => ({
    customDataTypeList : state.customdatatype.allCustomDataType
  })
  
  const mapsDispatchToProps = {
    getAllCustomDataType : customDataTypeAction.getAllCustomDataType
  }
  export default connect(mapStateToPops,mapsDispatchToProps)(AddLabTestAttribute);