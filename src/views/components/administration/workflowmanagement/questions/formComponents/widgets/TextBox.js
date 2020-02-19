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
    const { title, isRequired, readOnly ,pattern} = this.props;
    var opts = {}; if( readOnly==="true" ) { opts['readOnly'] = 'readOnly'; }
    return (
      <div className="form-group">
        <label htmlFor={title} className={isRequired?"col-form-label required":"col-form-label "}>{title}</label>
        <input {...opts} id={title} name={title} type="text" pattern={pattern ? pattern : ''} className="form-control" onChange = {this.onChangeFunc} value={this.props.value}/>
      </div>
    );
  }
}

export default TextBox;
