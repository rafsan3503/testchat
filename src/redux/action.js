export const SET_USER = 'SET_USER';
export const SET_AGENCIES = 'SET_AGENCIES';
export const SET_TERMINAL_HISTORY = 'SET_TERMINAL_HISTORY';




export const setUser = user => dispatch => {
    dispatch({
        type: SET_USER,
        payload: user,
    });
};

export const setAgencies = agencies => dispatch => {
    dispatch({
        type: SET_AGENCIES,
        payload: agencies,
    });
};

export const setTerminalHistory = terminalHistory => dispatch => {
    dispatch({
        type: SET_TERMINAL_HISTORY,
        payload: terminalHistory,
    });
};


