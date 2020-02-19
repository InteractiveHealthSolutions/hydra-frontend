import React, { Component } from "react";
import { Checkbox } from "material-ui";

export class CheckBox extends Component {
  state = {
    dataToReturn: {}
  };
  onChangeFunc = e => {
    const returnData = {
      controlId: this.props.controlId,
      value: e.target.checked,
      name: e.target.name
    };
    this.setState({ dataToReturn: returnData });
    this.props.onItemSelectedProp(returnData);
  };

  render() {
    const { title, isRequired , checked } = this.props;
    return (
      <form>
        <div className="form-group">
          <input
            type="checkbox"
            onChange={this.onChangeFunc}
            name={title}
            value={title}
            checked={checked}
            
          />
          <label style={{ marginLeft: "10px" }} className={isRequired?"col-form-label required":"col-form-label "} htmlFor={title}>
            {title}
          </label>
        </div>
      </form>
    );
  }
}

export default CheckBox;
