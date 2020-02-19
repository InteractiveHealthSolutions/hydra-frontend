import React, { Component } from "react";

export class TextArea extends Component {

  state = {
    dataToReturn: {}
  }
  onChangeFunc = (e) => {
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value
    }
    this.setState({dataToReturn: returnData})
    this.props.onItemSelectedProp(this.state.dataToReturn) 
  }
  render() {
    const { title, isRequired } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={title}>{title}</label>
        <textarea
          id={title}
          name={title}
          cols="40"
          rows="3"
          value={this.props.value}
          className="form-control"
          onChange = {this.onChangeFunc}
        ></textarea>
      </div>
    );
  }
}

export default TextArea;
