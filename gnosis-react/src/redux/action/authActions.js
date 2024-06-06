import axios from 'axios';

export const loginRequest = () => {
    return { type: 'LOGIN_REQUEST' };
}

export const loginSuccess = (user, role) => {
    const profileComplete = user._doc && user._doc.profile && user._doc.profile !== 'null' && user._doc.profile.trim() !== '';
    return {
        type: 'LOGIN_SUCCESS',
        payload: { user, role, profileComplete: !!profileComplete }
    };
};

export const loginWithGoogleSuccess = (user, role) => {
    const profileCompleteGoogle = user && user.profile && user.profile !== 'null' && user.profile.trim() !== '';
    return {
        type: 'LOGIN_GOOGLE_SUCCESS',
        payload: { user, role, profileCompleteGoogle: !!profileCompleteGoogle }
    };
};

export const resetRegisterSuccessMessage = () => {
    return { type: 'RESET_REGISTER_SUCCESS_MESSAGE' };
};

export const setProfileComplete = (isComplete) => {
    return { type: 'PROFILE_COMPLETE', payload: isComplete };
};

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

            if (response.data && response.data.user && response.data.token) {
                const user = response.data.user;
                const profileComplete = user.profile && user.profile.trim() !== '';
                dispatch(loginSuccess(user, user.role, profileComplete));
                localStorage.setItem('token', JSON.stringify(response.data.token));
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.log('Login error:', error.response ? error.response.data : error.message);
            dispatch(loginFailure(error.response ? error.response.data.message : 'Something went wrong'));
        }
    };
};

export const loginWithGoogleAction = (access_token) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const res = await axios.post('http://localhost:3000/auth/google-login', { access_token }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const profileCompleteGoogle = res.data.user && res.data.user.profile && res.data.user.profile.trim() !== '';

        dispatch(loginWithGoogleSuccess(res.data.user, res.data.user.role, profileCompleteGoogle));

        localStorage.setItem('token', JSON.stringify(res.data.token)); // Lưu token vào localStorage
    } catch (error) {
        console.log('Google login error:', error);
    }
};

export const register = (email, password) => {
    return async dispatch => {
        dispatch(registerRequest());
        try {
            const response = await axios.post('http://localhost:3000/auth/register', { email, password });
            dispatch(registerSuccess(response.data));
            localStorage.setItem('token', JSON.stringify(response.data.token));
        } catch (error) {
            dispatch(registerFailure(error.response.data.message || 'Đã xảy ra lỗi'));
        }
    };
}

export const logout = () => {
    return dispatch => {
        localStorage.removeItem('token'); // Xóa token từ localStorage
        dispatch({ type: 'LOGOUT' }); // Dispatch action LOGOUT
    };
};
