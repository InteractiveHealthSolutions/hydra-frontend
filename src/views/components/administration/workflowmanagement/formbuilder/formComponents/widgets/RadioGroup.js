import React, { Component } from "react";

export class RadioGroup extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  handleChange = (e) => {
    //console.log("currentTarget", e.target.value)
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value,
      name: e.target.name
    }
    this.props.handleRadioChange(returnData);
  }

  render() {
    const { title, isRequired, options, key, name } = this.props;
   // console.log("radio", this.props.value)
    return (
      <div className="form-group">
        <label>{title}</label>
        <div>
          {options.map(option => (
            <div key={option.key} className="custom-controls-stacked">
              <div className="custom-control custom-radio">
                {
                  (this.props.value === option.title) ?
                    <input
                      name={name}
                      id={option.key}
                      value={option.title}
                      type="radio"
                      className="custom-control-input"
                      onChange={this.handleChange}
                      checked="checked"
                    />
                    :
                    <input
                      name={name}
                      id={option.key}
                      value={option.title}
                      type="radio"
                      className="custom-control-input"
                      onChange={this.handleChange}
                    />
                }
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

export default RadioGroup;
