import React from "react";
import Sortable from "react-sortablejs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./form.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Card from "@material-ui/core/Card";
import { WorkflowSideBackButton } from "../common/sidebutton/SideBackButton";
import { formAction } from "../../../state/ducks/form";
import { connect } from "react-redux";
import CardTemplate from "../../ui/cards/SimpleCard/CardTemplate";

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.sortable = null;
    this.state = {
      items: [
        {
          formId: 1,
          name: "Screening",
          uuid: "0ae4eb98-8a4e-4ada-bb25-a4264297423"
        }
      ],
      openModal: false,
      availableForms: [],
      formToAdd: 0,
      listItems: [],
      forms: [],
      componentFormMapList: [],
      activeComponentUuid: "",

    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.forms = [];
  }

  async componentWillMount() {
    this.setState({
      activeComponentUuid: localStorage.getItem("active-component-uuid")
    });
    await this.props.getComponentFormRelation();
    await this.props.getAllForm();
  }

  async componentWillReceiveProps(newProps) {

    if (newProps.getAllComponentFormRelation !== undefined) {
      await this.setState(
        {
          componentFormMapList: newProps.getAllComponentFormRelation
        },
        () => {
          if (this.state.componentFormMapList) {
            this.displayForms();
          }
        }
      );
    }
    if (newProps.formList !== undefined && newProps.formList.forms !== undefined) {
      await this.setState(
        {
          availableForms: newProps.formList.forms
        },
        () => {
          if (this.state.availableForms !== undefined) {
            this.populateDropDown();
          }
        }
      );
    }

  }

  deleteForms = form => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to do this ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteComponentFormRelation(form.uuid);
          }
        },
        {
          label: "No",
          onClick: () => { }
        }
      ]
    });
  };

  async deleteComponentFormRelation(uuid) {
    await this.props.deleteComponentFormRelation(uuid);
    await this.props.getComponentFormRelation();
    window.location.reload();
  }

  async displayForms() {
    const { componentFormMapList } = this.state
    //let nonVoidedList = await componentFormMapList.filter(x => x.retired !== true)
    this.setState({
      items: componentFormMapList,
      listItems: componentFormMapList.map(val => (
        <li className="block-list-form" key={val.id} data-id={val.id}>
          <Card style={{ margin: "4px" }}>
            <div className="row f-row">
              <div
                className="col-sm-1"
                style={{ cursor: "pointer" }}
                onClick={e => this.handleClick(e, val)}
              >
                <img
                  className="form-icon"
                  src={require("../../../assets/formwo.png")}
                />
              </div>
              <div
                className="col-sm-10"
                style={{ cursor: "pointer" }}
                onClick={e => this.handleClick(e, val)}
              >
                <h6 className="list-content-form"> {val.form.name}</h6>
              </div>
              <div className="col-sm-1">
                <span onClick={() => this.deleteForms(val)}>
                  {" "}
                  <i className="fas fa-times delete-icon-form"></i>
                </span>
              </div>
            </div>
          </Card>
        </li>
      ))
    });
  }


  async filterFormWithComponent() {
    return await this.state.componentFormMapList.filter(
      data => data.component.uuid === this.state.activeComponentUuid
    );
  }

  filterFieldWithUuid() {
    let array = {};
    this.state.availableForms.forEach(element => {
      if (element.uuid == this.state.formToAdd) {
        array = element;
      }
    });
    return array;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.saveComponentForm()
    this.closeModal();
  }

  async saveComponentForm() {
    const { activeComponentUuid, formToAdd } = this.state;
    const updateForm = {
      form: formToAdd,
      component: activeComponentUuid,
      phase: localStorage.getItem("active-phases-uuid"),
      workflow: localStorage.getItem("active-workflow-uuid")
    };
    await this.props.saveComponentFormRelation(updateForm);
    await this.props.getComponentFormRelation();
    window.location.reload();
  }

  handleChange(e) {
    this.setState({ formToAdd: e.target.value });
  }

  openModal() {
    this.setState({ openModal: true });
  }

  closeModal() {
    this.setState({ openModal: false });
  }
  handleCreateForm = () => {
    // window.location.href = "http://199.172.1.53:3000";
  };
  handleClick(e, val) {
    //  window.location.href = "http://199.172.1.53:3000";
  }

  itemIncludes(element) {
    var includes = false;
    for (var i = 0; i < this.state.listItems.length && includes === false; i++) {
      console.log("itemICl ", this.state.items[i].form.uuid === element.uuid)
      if (this.state.items[i].form.uuid === element.uuid) includes = true;
    }
    return includes;
  }

  reorder(order) {
    let tempArray = [];
    console.log("order data", JSON.stringify(order));
    for (var i = 0; i < order.length; i++) {
      for (var j = 0; j < this.state.listItems.length; j++) {
        console.log("order data list item", this.state.listItems[j].key);
        if (order[i] == this.state.listItems[j].key) {
          tempArray.push(this.state.listItems[j]);
        }
      }
    }
    this.setState({ listItems: tempArray });
  }

  async populateDropDown() {
    this.forms = [];
    let nonVoidedList = await this.state.availableForms.filter(x => x.retired !== true)
    nonVoidedList.forEach(element => {
      if (this.itemIncludes(element)) {
        this.forms.push(
          <option key={element.hydramoduleFormId} disabled>
            {element.name}
          </option>
        );
      } else {
        this.forms.push(
          <option key={element.hydramoduleFormId} value={element.uuid}>
            {element.name}
          </option>
        );
      }
    });
    return this.forms;
  }

  render() {
    return (
      <>
        <CardTemplate
          title={localStorage.getItem("active-component-name") + "- Form"}
          action={
            <button
              className="btn btn-primary btn-gobal heading"
              onClick={() => this.openModal()}
            >
              Add Form
            </button>
          }
        >
          <Sortable
            options={{
              animation: 100,
              easing: "cubic-bezier(1, 0, 0, 1)"
            }}
            ref={c => {
              if (c) {
                this.sortable = c.sortable;
              }
            }}
            onChange={order => {
              this.reorder(order);
            }}
            tag="ul"
          >
            {this.state.listItems}
          </Sortable>
        </CardTemplate>

        <Modal
          show={this.state.openModal}
          onHide={() => this.closeModal()}
          style={{ marginTop: "100px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Form</Modal.Title>
          </Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="formName">Select a Form</label>
                <select
                  className="form-control"
                  name="formName"
                  value={this.state.formToAdd}
                  onChange={this.handleChange}
                  required
                >
                  <option></option>
                  {this.forms}
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  componentFormList: state.formField.componentForms,
  formList: state.formField.forms,
  form: state.formField.form,
  getAllComponentFormRelation: state.formField.componentFormRelations
});

const mapsDispatchToProps = {
  getAllForm: formAction.fetchForms,
  searchForm: formAction.searchForm,
  saveForm: formAction.saveForm,
  saveComponentFormRelation: formAction.saveComponentFormRelation,
  getComponentFormRelation: formAction.getComponentFormRelation,
  deleteComponentFormRelation: formAction.deleteComponentFormRelation
};

export default connect(mapStateToProps, mapsDispatchToProps)(Form);
