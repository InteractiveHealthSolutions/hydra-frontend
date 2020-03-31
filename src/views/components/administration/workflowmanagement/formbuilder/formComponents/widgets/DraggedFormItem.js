import React, { Component } from "react";
import FormBuilderCard from "./FormBuilderCard";

export class DraggedFormItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataToReturn: {},
      expanded: false,
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
  handleDelete = (e) => {
   // console.log("delete", e)
    this.props.handleDelete(e)
  }

  render() {

    const { data, key } = this.props;
    console.log("dragged data", data)
    return (
      <li
        key={data.uuid}
        data-id={data.uuid}
        style={{ marginBottom: '10px' }}
      >
        <FormBuilderCard
          data={data}
          handleDelete={this.handleDelete}
        />
      </li>
    );
  }
}

export default DraggedFormItem;
