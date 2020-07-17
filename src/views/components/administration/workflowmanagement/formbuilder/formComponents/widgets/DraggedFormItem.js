import React, { Component } from "react";
import FormBuilderCard from "./FormBuilderCard";

export class DraggedFormItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataToReturn: {},
      expanded: false,
      workflow:[]
    }
  }

  onChangeFunc = (e) => {
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value
    }
    this.setState({ dataToReturn: returnData })
    this.props.onItemSelectedProp(this.state.dataToReturn)
  }
  handleExpandClick = (ev, str) => {
    this.setState({ expanded: !this.state.expanded })
    // console.log("ExpandClick")
  }
  handleDelete = (e,key) => {
    // console.log("delete", e)
    this.props.handleDelete(e,key)
  }
  componentWillReceiveProps(nextProps) {
     if(nextProps.workflow != undefined) {
       this.setState({
         workflow : nextProps.workflow
       })
     }
  }
  render() {

    const { data, key, editeMood ,workflow} = this.props;
    // console.log("dragged data", data.displayOrder)
   // alert(this.state.workflow)
    return (
      <li
        key={data.uuid}
        data-id={data.uuid}
        style={{ marginBottom: '10px' }}
      >
        <FormBuilderCard
          data={data}
          editeMood={editeMood}
          handleDelete={this.handleDelete}
          workflow={this.state.workflow}
        />
      </li>
    );
  }
}

export default DraggedFormItem;
