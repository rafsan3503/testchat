import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import appReducer from './reducer';

const rootReducer = combineReducers({appReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk))