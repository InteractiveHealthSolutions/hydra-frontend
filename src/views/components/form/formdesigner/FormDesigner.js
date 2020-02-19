import React from 'react';
import PatientInformationForm from '../../PatientInformationForm'
import './formdesigner.css';

class FormDesigner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="formdesigner-div">
        <br />
        <PatientInformationForm />
      </div>);
  }
}

export default FormDesigner;