import React, { Component } from "react";
import './appform.css'
import QuestionListModal from "../questionlist/QuestionListModal";

export class AppForm extends Component {

  state = {
    openModal: false,
  }

  handleSubmited = (e) => {
    this.props.handleSubmited()
  }
  openModall = () => {
    this.setState({
      openModal: true
    })
  }
  closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  render() {
    return (<>
      <div className="card" style={{ width: "100%", height: '100%' }}>
        <div className="card-header">
          <div className="row">
            <div className="col-sm-4 col-md-8 ">
              <h4>{this.props.title}</h4>
            </div>
            {
              (this.props.title === 'Search Question') ?
                <div className="col-sm-2 col-md-4" >
                  <button className="service-btn btn btn-primary " onClick={this.openModall}><i class="fas fa-eye"></i> Question</button>
                </div> : ""
            }
          </div>
        </div>
        <div className="card-body">
          <form>{this.props.children}</form>
        </div>
        {(this.props.title === 'Form Builder') ?
          <div className="card-footer  text-center">
            <button type="submit" onClick={this.handleSubmited} className="btn btn-primary af_btn" >SAVE</button>
          </div> : <div className="card-footer  text-center"></div>
        }
      </div>
      <QuestionListModal
        openModal={this.state.openModal}
        closeModal={this.closeModal}
      />
    </>
    );
  }
}

export default AppForm;
