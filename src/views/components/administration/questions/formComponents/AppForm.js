import React, { Component } from "react";

export class AppForm extends Component {
  render() {
    return (
      <div className="card" style={{ width: "100%" }}>
        <h4 className="card-header">{this.props.title}</h4>
        <div className="card-body">
          <form>{this.props.children}</form>
        </div>
      </div>
    );
  }
}

export default AppForm;
