import React, { Component } from "react";

export class TextBox extends Component {

  state = {
    dataToReturn: {}
  }
  onChangeFunc = async (e) => {
    e.preventDefault()
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value,
      name: e.target.name
    }
    this.props.onItemSelectedProp(returnData)
  }

  render() {
    
    const { title, type, isRequired,disabled, name, min, step, pattern, controlId, placeholdertext, hydramoduleFormId } = this.props;
    console.log("patientContacts" ,disabled)
    var opts = {}; if (hydramoduleFormId !== null && controlId === 'formName') { opts['readOnly'] = 'readOnly'; }
    var  disabledText ={}; if(disabled === "Yes") { disabledText['readOnly'] = 'readOnly'; }
    return (
      <div className="form-group">
        {(title) ? <label htmlFor={title} className={this.props.isRequired === "true" ? "required" : ""} >{title}</label> : ""}
        <input id={name} name={name} type={type}
          className="form-control"
          {...opts}
          {...disabledText}
          min={min}
          step={step}
          placeholder={placeholdertext}
          pattern={pattern}
          value={this.props.value}
          onChange={this.onChangeFunc} />
      </div>
    );
  }
}

export default TextBox;
