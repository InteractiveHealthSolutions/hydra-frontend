import React, { Component } from "react";
import './appform.css'

export class AppForm extends Component {

  state = {
    openModal: false,
  }

  handleSubmited = (e) => {
    this.props.handleSubmited()
  }
  handleRetiredChecked = (param) => {
    this.props.handleRetiredChecked(param)
  }

  render() {
    return (
      <div className="card" style={{ width: "100%", height: '100%' }}>
        <div className="card-header">
          <div className="row">
            <div className="col-sm-4 col-md-8 ">
              <h4>{this.props.title}</h4>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form>{this.props.children}</form>
        </div>
        <div className="card-footer">
          {
            (this.props.edit) ?
              <div class="form-check">
                <input type="checkbox" class="form-check-input" onChange={this.handleRetiredChecked} />
                <label class="form-check-label">Retired</label>
              </div> : ""
          }
          <button onClick={this.handleSubmited}
            className="btn btn-primary af_btn">SAVE</button>
        </div>
      </div>

    );
  }
}

export default AppForm;
