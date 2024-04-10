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

export const registerRequest = () => {
    return { type: 'REGISTER_REQUEST' };
}

export const registerSuccess = (user) => {
    return { type: 'REGISTER_SUCCESS', payload: user };
}

export const registerFailure = (error) => {
    return { type: 'REGISTER_FAILURE', payload: error };
}


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

export const loginWithGoogleAction = (access_token) => async (dispatch) => {
    try {
        dispatch({ type: 'LOGIN_REQUEST' });
        const res = await axios.post('http://localhost:3000/auth/google-login', { access_token }, {

            headers: {
                'Content-Type': 'application/json'
            }
        });

        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        localStorage.setItem('access_token', res.data.access_token); // Lưu token vào localStorage
    } catch (error) {
        dispatch({
            type: 'LOGIN_FAILURE',
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
export const register = (username, email, password) => {
    return async dispatch => {
        dispatch(registerRequest());
        try {
            const response = await axios.post('http://localhost:3000/auth/register', { username, email, password });
            dispatch(registerSuccess(response.data));
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            dispatch(registerFailure(error.response.data.message || 'Đã xảy ra lỗi'));
        }
    };
}
export const logout = () => {
    return dispatch => {
        localStorage.removeItem('access_token'); // Xóa token từ localStorage
        dispatch({ type: 'LOGOUT' }); // Dispatch action LOGOUT
    };
};