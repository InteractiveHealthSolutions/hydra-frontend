import React, { Component } from "react";

export class SingleSelect extends Component {
  
  state = {
    id: this.props.controlId,
    value: ""
  }

  onChangeFunc = (e) => {
    this.doOnChange(e.target.value)
  }

  doOnChange = (e) => {
    const returnData = {
      controlId: this.props.controlId,
      value: e
    }
    this.state = returnData
    this.props.onItemSelectedProp(returnData) 
  }

  render() {
    const { title, isRequired, options,name } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={title} className={this.props.isRequired === "true" ? "required" : ""}>{title}</label>
        <div>
          <select id={title} name={name} className="custom-select" onChange={this.onChangeFunc} >
            {options.map(option => (
              <option key={option.uuid} value={option.uuid}>
                {option.display}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default SingleSelect;
