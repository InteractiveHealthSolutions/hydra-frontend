import React, { Component } from "react";

export class RadioGroup extends Component {

  constructor(props, context) {
    super(props, context);
    console.log("Prop", props.value)
    // Set initial State
    this.state = {
      controlId: props.controlId,
      options: props.options,
    };
  }
  onChangeFunc = e => {
    var optionKey = this.state.options.filter(
      option => option.title == e.target.value
    );
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.value,
      key: optionKey[0].key
    };

    this.props.onItemSelectedProp(returnData);
  };

  render() {
    const { title, isRequired, options } = this.props;
    return (
      <div className="form-group">
        <label className={isRequired?"col-form-label required":"col-form-label "}>{title}</label>
        <div>
          {options.map(option => (
            // className="custom-control custom-radio custom-control-inline"
            <div key={option.key} className="custom-controls-stacked">
              <div className="custom-control custom-radio">
                <input
                  name={title}
                  id={option.key}
                  value={option.title}
                  type="radio"
                  className="custom-control-input"
                  onChange={this.onChangeFunc}
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

export default RadioGroup;
