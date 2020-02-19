import { createStore,compose, applyMiddleware,combineReducers } from 'redux';
import thunk from 'redux-thunk';
// import rootReducer from '../store/reducers';
import * as reducers from "./ducks";
import promiseMiddleware from "redux-promise-middleware";
import normalizrMiddleware from "./utils/normalizrMiddleware";
import api from "./utils/middlewares/api";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = (state, action) => {
  return combineReducers(reducers)(state, action);
};

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunk,api, promiseMiddleware(), normalizrMiddleware()))
);

