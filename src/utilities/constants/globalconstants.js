export const PORT =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_HOST
    : process.env.REACT_APP_API_PROD;

export const IMAGE_PORT =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_HOST : "";

export const BLANK_AVATAR = "/images/icon-avatar.svg";


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

//Data type 
export const NUMERIC = "Numeric";
export const DATE_TIME = "Datetime";
export const TEXT = "Text";
export const CODED = "Coded";
export const HEADING = "Heading";
export const ADDRESS = "Address";