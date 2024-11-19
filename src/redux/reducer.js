import { SET_USER, SET_AGENCIES, SET_TERMINAL_HISTORY } from './action';

const initialState = {
    user: null,
    agencies: null,
    terminalHistory: null,
}

function appReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {...state, user: action.payload};
        case SET_AGENCIES:
            return {...state, agencies: action.payload};
        case SET_TERMINAL_HISTORY:
            return {...state, terminalHistory: action.payload};
        default:
            return state;
    }
}

export default appReducer;