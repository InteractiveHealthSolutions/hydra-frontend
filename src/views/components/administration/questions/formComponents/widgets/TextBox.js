import React, { Component } from "react";

export class TextBox extends Component {

  state  = {
    dataToReturn: {}
  }
  onChangeFunc = (e) => {
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value
    }
    this.setState({dataToReturn: returnData})
    this.props.onItemSelectedProp(returnData) 
  }

  render() {
    const { title, isRequired, readOnly } = this.props;
    var opts = {}; if( readOnly==="true" ) { opts['readOnly'] = 'readOnly'; }
    return (
      <div className="form-group">
        <label htmlFor={title}>{title}</label>
        <input {...opts} id={title} name={title} type="text" className="form-control" onChange = {this.onChangeFunc} value={this.props.value}/>
      </div>
    );
  }
}

export default TextBox;
