import axios from 'axios';

export const loginRequest = () => {
    return { type: 'LOGIN_REQUEST' };
}

export const loginSuccess = (user) => {
    return { type: 'LOGIN_SUCCESS', payload: user };
}

export const loginFailure = (error) => {
    return { type: 'LOGIN_FAILURE', payload: error };
}


export const googleLogin = (tokenId) => {
    return async dispatch => {
        dispatch(loginRequest());
        try {
            const response = await axios.post('http://localhost:3000/auth/google', { tokenId });
            dispatch(loginSuccess(response.data));
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            dispatch(loginFailure(error.response ? error.response.data.message : 'Could not log in with Google'));
        }
    };
};
export const login = (email, password) => {
    return async dispatch => {
        dispatch(loginRequest());
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            dispatch(loginSuccess(response.data));
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            dispatch(loginFailure(error.response.data.message || 'Something went wrong'));
        }
    };
}
export const logout = () => {
    return dispatch => {
        localStorage.removeItem('token'); // Xóa token từ localStorage
        dispatch({ type: 'LOGOUT' }); // Dispatch action LOGOUT
    };
};