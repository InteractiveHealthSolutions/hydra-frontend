import React, { Component } from "react";

export class MultiSelect extends Component {
  render() {
    const { title, isRequired, options } = this.props;
    return (
      <div className="form-group">
        <label className={isRequired?"col-form-label required":"col-form-label "} htmlFor={title}>{title}</label>
        <div>
          <select
            multiple="multiple"
            id={title}
            name={title}
            className="custom-select"
          >
            {options.map(option => (
              <option key={option.key} value={option.title}>{option.title}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default MultiSelect;
