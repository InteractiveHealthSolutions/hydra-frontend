import React, { Component } from "react";
import { connect } from "react-redux";
import Autocomplete from "react-autocomplete";
import { questionAction } from "../../../../state/ducks/questions";
import { userAction } from "../../../../state/ducks/user";
import { encounterAction } from "../../../../state/ducks/encounter";

class AutoSearchComplete extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("Prop", props.value);
    this.state = {
      value: props.value,
      returnData: props.fullData,
      autocompleteData: [],
      autocompleteStyle: {
        display: "block",
        width: "100%",
        height: "calc(1.5em + .75rem + 2px)",
        padding: ".375rem .75rem",
        fontSize: "1rem",
        fontWeight: "400",
        lineHeight: "1.5",
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        border: "1px solid #ced4da",
        borderRadius: ".25rem",
        margin: "0px 0px 10px 0px",
        transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out"
      }
    };

    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(
      this
    );
  }

  async componentWillReceiveProps(nextProps) {

    if (this.props.searchFor === 'encounterType') {
        if (nextProps.encounterTypeList !== undefined && nextProps.encounterTypeList.results !== undefined) {
          await this.setState({
            autocompleteData: this.formatEncouterTypeList(nextProps.encounterTypeList.results)
          });
        }
    } else if (this.props.searchFor === 'Field') {
        if (nextProps.fieldList !== undefined && nextProps.fieldList.results !== undefined && this.props.parentType !== 'workforce') {
          await this.setState({
            autocompleteData: this.formatFieldList(nextProps.fieldList.results)
          })

          if (this.props.parentType !== undefined) {
            this.props.returnConceptList(this.state.autocompleteData)
          }

        }
    }
    else if (this.props.searchFor === 'Workforce') {
        if (nextProps.userList !== undefined && nextProps.userList.results !== undefined) {
          await this.setState({
            autocompleteData: this.formatList(nextProps.userList.results)
          });
        }
    }

  }

  onAutocompleteClick(e) {
    this.setState({
      color: "#495057",
      backgroundColor: "#fff",
      borderColor: "#80bdff",
      outline: "0",
      boxShadow: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
    });
  }

  formatList(list) {
    let array = [];
    list.forEach(element => {
      array.push(this.formatItem(element));
    });
    return array;
  }

  formatFieldList(list) {
    let array = [];
    list.forEach(element => {
      array.push(this.formatFieldItem(element));
    });
    console.log("formatFieldList", array)
    return array;
  }

  formatEncouterTypeList(list) {
    let array = [];
    list.forEach(element => {
      array.push(this.formatEncounterTypeItem(element));
    });
    return array;
  }


  formatFieldItem(element) {
    console.log("formatFieldItem", element)
    return {
      label: element.field.display ? element.field.display : element.field,
      value: element.field.display ? element.field.display : element.field,
      description: element.field.description ? element.field.description : "",
      dataType: element.field.attributeName ? element.field.attributeName : "",
      uuid: element.field.uuid,
      controlId: this.props.controlId,
      answers: element.answers ? element.answers : []
    };
  }

  formatItem(element) {
    console.log("formatItem", element)
    return {
      label: element.person.display ? element.person.display : element,
      value: element.person.display ? element.person.display : element,
      personUuid: element.person ? element.person.uuid : "",
      uuid: element.uuid
    };
  }

  formatEncounterTypeItem(element) {
    return {
      label: element.display ? element.display : element,
      value: element.display ? element.display : element,
      uuid: element.uuid
    };
  }

  /**
   * Updates the state of the autocomplete data with the remote data obtained via AJAX.
   *
   * @param {String} searchText content of the input that will filter the autocomplete data.
   * @return {Nothing} The state is updated but no value is returned
   */
  async retrieveDataAsynchronously(searchText) {
    await this.props.searchedConcepts(searchText);
  }

  async retrieveFieldDataAsynchronously(searchText) {
    await this.props.searchedField(searchText);
  }

  async retrieveWorkforceDataAsynchronously(searchText) {
    await this.props.searchedUsers(searchText);
  }

  async retrieveEncounterTypeAsynchronously(searchText) {
    await this.props.searchEncounterType(searchText);
  }

  /**
   * Callback triggered when the user types in the autocomplete field
   *
   * @param {Event} e JavaScript Event
   * @return {Event} Event of JavaScript can be used as usual.
   */
  onChange(e) {
    this.setState({
      value: e.target.value
    });

    //this.props.onItemSelectedProp(this.formatItem(e.target.value));

    /**
     * Handle the remote request with the current text !
     */
    if (e.target.value.length > 2) {
      if (this.props.searchFor === "Field") {
        this.retrieveFieldDataAsynchronously(e.target.value);
      }
      else if (this.props.searchFor === "Workforce") {
        this.retrieveWorkforceDataAsynchronously(e.target.value);
      }
      else if (this.props.searchFor === "encounterType") {
        this.retrieveEncounterTypeAsynchronously(e.target.value);
      }

    }
    else this.setState({ autocompleteData: [] });

  }

  /**
   * Callback triggered when the autocomplete input changes.
   *
   * @param {Object} val Value returned by the getItemValue function.
   * @return {Nothing} No value is returned
   */
  async onSelect(val) {
    this.setState({
      value: val
    });

    if (this.props.searchFor === "Workforce" || this.props.searchFor === "encounterType" ) {
      const o = this.state.autocompleteData.filter(option => option.value == val);
      if (o) {
        await this.setState({ returnData: o[0] });
        this.props.onItemSelectedProp(o[0]);
      }
    }

  }

  renderItem(item, isHighlighted) {
    return (
      <div
        style={{
          margin: "5px",
          padding: "5px",
          background: isHighlighted ? "lightgray" : "white"
        }}
      >
        {item.label}
      </div>
    );
  }

  getItemValue(item) {
    return item.value;
  }

  render() {
    const { title, isRequired, showAutocomplete } = this.props;
    return (
      <div>
        <label id="test" style={{ display: "block" }} htmlFor={title} className={isRequired === "true" ? "required" : ""}>
          {title}
        </label>
        {
          (showAutocomplete) ?
            <Autocomplete
              inputProps={{ style: { width: "100%" } }}
              wrapperStyle={this.state.autocompleteStyle}
              getItemValue={this.getItemValue}
              items={this.state.autocompleteData}
              renderItem={this.renderItem}
              value={this.state.value}
              onChange={this.onChange}
              onSelect={this.onSelect}
            />
            :
            <Autocomplete
              inputProps={{ style: { width: "100%" } }}
              wrapperStyle={this.state.autocompleteStyle}
              getItemValue={this.getItemValue}
              items={this.state.autocompleteData}
              menuStyle={{
                borderRadius: "3px",
                display: "none",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "2px 0",
                fontSize: "90%",
                position: "fixed",
                overflow: "auto",
                maxHeight: "50%", // TODO: don't cheat, let it flow to the bottom
                zIndex: "998"
              }}
              renderItem={this.renderItem}
              value={this.state.value}
              onChange={this.onChange}
              onSelect={this.onSelect}
            />
        }
      </div >
    );
  }
}


const mapStateToProps = state => ({
  conceptList: state.questions.concepts,
  fieldList: state.questions.fields,
  userList: state.user.users,
  encounterTypeList: state.encounter.searchEncounterType
});

const mapDispatchToProps = {
  searchedConcepts: questionAction.searchConcept,
  searchedField: questionAction.searchField,
  searchedUsers: userAction.searchUser,
searchEncounterType: encounterAction.searchEncounterType,
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoSearchComplete);
