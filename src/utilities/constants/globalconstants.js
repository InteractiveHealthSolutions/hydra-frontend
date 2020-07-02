export const PORT =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_HOST
    : process.env.REACT_APP_API_PROD;

export const IMAGE_PORT =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_HOST : "";

export const BLANK_AVATAR = "/images/icon-avatar.svg";

export const BASE_URL = process.env.REACT_APP_API_PROD

/// middleware Actions 
export const API = "API"


// Query methods

export const GET = "GET";
export const POST = "POST";
export const PUT = "PUT";
export const DELETE = "DELETE";

// Query statuses

export const PENDING = "_PENDING";
export const FULFILLED = "_FULFILLED";
export const REJECTED = "_REJECTED";

// Types

export const CLIENT = "Client";
export const SPECIALIST = "Specialist";

// Roles

export const S_ACTIVE = "active";
export const S_PASSIVE = "passive";
export const S_CORE = "core";
export const S_REDGUY = "red_guy";
export const CUSTOMER = "customer";

// Files

export const DELETE_FILE = "DELETE_FILE";

//end points
export const ENDPOINT_WORKFLOW = "hydra/workflow";
export const ENDPOINT_PHASE = "hydra/phase";
export const ENDPOINT_WORKFLOW_PHASES = '/hydra/workflowphases';
export const ENDPOINT_COMPONENT = '/hydra/component';

//Operator 
export const PLUS = "+";
export const OPEN_PARANTHESES = "(";
export const CLOSE_PARANTHESES = ")";
export const AND = "AND";
export const OR = "OR";
export const EQUAL = "=";
export const GREATER_THEN = "<";
export const LESS_THEN = ">";
export const LESS_THEN_EQUAL = ">=";
export const GREATER_THEN_EQUAL = "<=";
export const NOT_EQUAL = "!=";
export const NOW = "now";
export const NULL = "null";
export const NOTNULL = "not null";
//Data type 
export const NUMERIC = "Numeric";
export const DATE_TIME = "Datetime";
export const TEXT = "Text";
export const CODED = "Coded";



//action types
export const QUESTION = "Question";
export const CODEDVALUE = "CodedValue";
export const FUNCTION = "Function";
export const NULLABLE = "Nullable";
export const OPERATOR = "Operator";
export const OPENVALUE = "OpenValue";

//privilege 

export const ACCESS_ADMINISTRATION = "Access Administration";
export const MANAGE_EVENTS = "Manage Events";
export const MANAGE_EVENTS_METADATA = "Manage Events Metadata";
export const MANAGE_WORKFLOWS = "Manage Workflows";
export const MANAGE_WORKFLOWS_METADATA = "Manage Workflows Metadata";
export const VIEW_DASHBOARD = "View Dashboard";
export const VIEW_REPORTS = "View Reports";

// varaible
export const SERVICE_TITLE = "Services";
export const ASSETS_TITLE = "Assets";

///Widgets 

export const DATE_TIME_PICKER = "Date/ Time Picker"
export const TEXT_BOX = "Textbox"
export const SINGLE_SELECT_DROPDOWN = "Single Select Dropdown"
export const MULTIPLE_CHOICE = "Multiple Choice"
export const SINGLE_SELECT_RADIOBUTTON = "Single Select Radiobuttons"
export const HEADING = "Heading"
export const AGE = "Age"
export const ADDRESS = "Address"
export const CONTACT_TRACING = "Contact Tracing"
export const BARCODE_READER = "Barcode Reader"


//Regix

export const  CHECK_DECIMAL = /^\d+\.\d{0,2}$/;