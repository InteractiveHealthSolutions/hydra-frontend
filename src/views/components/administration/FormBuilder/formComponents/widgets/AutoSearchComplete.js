import React, { Component } from "react";
import { connect } from "react-redux";
import Autocomplete from "react-autocomplete";
import { questionAction } from "../../../../../../state/ducks/questions";

class AutoSearchComplete extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("Prop", props.value);
    // Set initial State
    this.state = {
      // Current value of the select field
      value: props.value,
      returnData: props.fullData,
      // Data that will be rendered in the autocomplete
      // As it is asynchronous, it is initially empty
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

    // Bind `this` context to functions of the class
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(
      this
    );
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.conceptList !== undefined && nextProps.conceptList.results !== undefined) {
      await this.setState({
        autocompleteData: this.formatList(nextProps.conceptList.results)
      });
      if (this.props.parentType !== undefined) {
        this.props.returnConceptList(this.state.autocompleteData)
      }
    }
    if (nextProps.fieldList !== undefined && nextProps.fieldList.results !== undefined) {
      await this.setState({
        autocompleteData: this.formatFieldList(nextProps.fieldList.results)
      })
      if (this.props.parentType !== undefined) {
        this.props.returnConceptList(this.state.autocompleteData)
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
    let conceptDescription = element.descriptions ? element.descriptions[0] : "";

    conceptDescription = conceptDescription
      ? conceptDescription.description
      : undefined;
    return {
      label: element.display ? element.display : element,
      value: element.display ? element.display : element,
      description: conceptDescription,
      dataType: element.datatype ? element.datatype.display : "",
      uuid: element.uuid,
      controlId: this.props.controlId,
      answers: element.answers ? element.answers : []
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

    this.props.onItemSelectedProp(this.formatItem(e.target.value));

    /**
     * Handle the remote request with the current text !
     */
    if (e.target.value.length > 2) {
      if (this.props.searchFor === "Field") {
        this.retrieveFieldDataAsynchronously(e.target.value);
      }
      else if (this.props.searchFor === "Concept") {
        this.retrieveDataAsynchronously(e.target.value);
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

    const o = this.state.autocompleteData.filter(option => option.value == val);
    console.log(o[0]);
    if (o) {
      await this.setState({ returnData: o[0] });
      this.props.onItemSelectedProp(o[0]);
    }
  }

  /**
   * Define the markup of every rendered item of the autocomplete.
   *
   * @param {Object} item Single object from the data that can be shown inside the autocomplete
   * @param {Boolean} isHighlighted declares wheter the item has been highlighted or not.
   * @return {Markup} Component
   */
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

  /**
   * Define which property of the autocomplete source will be show to the user.
   *
   * @param {Object} item Single object from the data that can be shown inside the autocomplete
   * @return {String} val
   */
  getItemValue(item) {
    // You can obviously only return the Label or the component you need to show
    // In this case we are going to show the value and the label that shows in the input
    // something like "1 - Microsoft"
    // console.log(item);
    return item.value;
  }

  render() {
    const { title, isRequired } = this.props;
    return (
      <div>
        <label id="test" style={{ display: "block" }} htmlFor={title}>
          {title}
        </label>
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
      </div>
    );
  }
}

// setTimeout(() => {
//   let el = document.getElementById("test").nextSibling.firstChild;
//   var _this = this;
//   el.addEventListener("click", () => {
//     _this.onAutocompleteClick();
//   });
// }, 20000);

const mapStateToProps = state => ({
  conceptList: state.questions.concepts,
  fieldList: state.questions.fields
});

const mapDispatchToProps = {
  searchedConcepts: questionAction.searchConcept,
  searchedField: questionAction.searchField
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoSearchComplete);
