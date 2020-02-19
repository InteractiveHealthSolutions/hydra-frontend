import React, { Component } from "react";

export class SingleSelect extends Component {
  

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
    this.doOnChange(e);
  };

  doOnChange = e => {
    var optionKey= this.state.options.filter(option=>option.title == e.target.value)
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
        <label htmlFor={title}>{title}</label>
        <div>
          <select
            id={title}
            name={title}
            className="custom-select"
            onChange={this.onChangeFunc}
          >
            {options.map(option => (
              <option key={option.key} name={option.key} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default SingleSelect;
