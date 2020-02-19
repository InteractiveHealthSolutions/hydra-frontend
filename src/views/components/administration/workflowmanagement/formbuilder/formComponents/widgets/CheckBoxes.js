import React, { Component } from "react";

export class CheckBoxes extends Component {
  render() {
    const { title, isRequired, options } = this.props;
    return (
      <div className="form-group">
        <label>{title}</label>
        <div>
          {options.map(option => (
            <div key={option.key} className="custom-controls-stacked">
              <div className="custom-control custom-checkbox">
                <input
                  name={option.title}
                  id={option.key}
                  value={option.title}
                  type="checkbox"
                  className="custom-control-input"
                />
                <label htmlFor={option.key} className="custom-control-label">
                  {option.title}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CheckBoxes;
