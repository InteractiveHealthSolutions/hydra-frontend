import React, { Component } from "react";
import { connect } from "react-redux";
import Autocomplete from "react-autocomplete";
import { questionAction } from "../../../../../../../state/ducks/questions";

class AutoSearchComplete extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("Prop auto", props.value);
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
    if (nextProps.conceptList !== undefined) {
      await this.setState({
        autocompleteData: this.formatList(nextProps.conceptList.results)
      });
    }
  }

  onAutocompleteClick(e) {
    this.setState();
  }

  formatList(list) {
    let array = [];
    list.forEach(element => {
      array.push(this.formatItem(element));
    });
    return array;
  }

  formatItem(element) {
    let conceptDescription = element.descriptions
      ? element.descriptions[0]
      : "";
    console.log("kjdfnfhihfoif ", element)
    conceptDescription = conceptDescription
      ? conceptDescription.description
      : undefined;

    var elementValue = element.display ? element.display : element;
    var elementKey = element.uuid ? element.uuid : "";
    let shortName = ""

    let names = element.names?element.names.filter(data => data.conceptNameType==="SHORT"): []
    console.log("names ",names)
    if(names.length>0) {
      shortName = names[0].display
    }

    return {
      key: elementKey,
      label: elementValue,
      value: elementValue,
      description: conceptDescription,
      dataType: element.datatype ? element.datatype.display : "",
      uuid: element.uuid,
      controlId: this.props.controlId,
      variableName: shortName,
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
    if (e.target.value.length > 1)
      this.retrieveDataAsynchronously(e.target.value);
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

  autoInput = props => {
    return (
      <input
        {...props}
        type="text"
        className="form-control"
        style={{ width: "100%", marginBottom: "10px" }}
        pattern={this.props.pattern ? this.props.pattern : ''}
      />
    );
  };
  render() {
    const { title, isRequired } = this.props;
    return (
      <div className="form-group">
        <label id="test" className={isRequired?"col-form-label required":"col-form-label "} style={{ display: "block" }} htmlFor={title}>
          {title}
        </label>
        <Autocomplete
          inputProps={{ style: { width: "100%" } }}
          renderInput={this.autoInput}
          // renderMenu={(items, value, style) => {
          //   return (
          //     <div style={{ ...style, ...this.menuStyle }} children={items} />
          //   );
          // }}
          wrapperStyle={{ width: "100%" }} //this.state.autocompleteStyle
          menuStyle={{
            borderRadius: "3px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "2px 0",
            fontSize: "90%",
            position: "fixed",
            overflow: "auto",
            maxHeight: "50%", // TODO: don't cheat, let it flow to the bottom
            zIndex: "998"
          }}
          getItemValue={this.getItemValue}
          items={this.state.autocompleteData}
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
  conceptList: state.questions.concepts
});

const mapDispatchToProps = {
  searchedConcepts: questionAction.searchConcept
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoSearchComplete);
