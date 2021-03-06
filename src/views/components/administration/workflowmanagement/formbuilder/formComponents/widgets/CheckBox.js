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
    this.props.onItemCheckedProp(returnData);
  };

  render() {
    const { title, isRequired, name, disabled, value } = this.props;
    var disabledText = {}; if (disabled === "Yes") { disabledText['disabled'] = 'disabled'; }

    return (
      <form>
        <div className="form-group">
          {
            (value === "true") ?
              <input
                name={name}
                value={title}
                type="checkbox"
                onChange={this.onChangeFunc}
                checked="checked"
                {...disabledText}
              />
              :
              <input
                name={name}
                value={title}
                type="checkbox"
                onChange={this.onChangeFunc}
                {...disabledText}
              />
          }

          {/* 

          <input
            type="checkbox"
            onChange={this.onChangeFunc}
            name={name}
            value={title}
          /> */}
          <label style={{ marginLeft: "10px" }} htmlFor={title}>
            {title}
          </label>
        </div>
      </form>
    );
  }
}

export default CheckBox;
