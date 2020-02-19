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
    // await this.setState({ dataToReturn: returnData })
    this.props.onItemSelectedProp(returnData)
  }

  render() {
    const { title, type, isRequired, name, min, step, pattern,controlId, placeholdertext, hydramoduleFormId } = this.props;
    var opts = {}; if (hydramoduleFormId !== null && controlId === 'formName') { opts['readOnly'] = 'readOnly'; }
    return (
      <div className="form-group">
        <label htmlFor={title} className={this.props.isRequired === "true" ? "required" : ""} >{title}</label>
        <input id={name} name={name} type={type}
          className="form-control"
          {...opts}
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
