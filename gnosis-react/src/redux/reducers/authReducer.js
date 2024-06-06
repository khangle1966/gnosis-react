const initialState = {
    isLoggedIn: false,
    isRegistering: false,
    loading: false,
    user: null,
    error: '',
    registerSuccessMessage: '',
    role: null,
    profileComplete: false,
    profileCompleteGoogle: false,
    loginMethod: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                loading: false,
                user: action.payload.user,
                role: action.payload.role,
                profileComplete: action.payload.profileComplete,
                loginMethod: 'standard',
                error: ''
            };
        case 'LOGIN_GOOGLE_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                loading: false,
                user: action.payload.user,
                role: action.payload.role,
                profileCompleteGoogle: action.payload.profileCompleteGoogle,
                loginMethod: 'google',
                error: ''
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...initialState
            };
        case 'REGISTER_REQUEST':
            return {
                ...state,
                isRegistering: true,
                loading: true,
                error: ''
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isRegistering: false,
                loading: false,
                user: action.payload,
                error: '',
                registerSuccessMessage: 'Tạo thành công tài khoản, bạn có thể đăng nhập ngay bây giờ.'
            };
        case 'RESET_REGISTER_SUCCESS_MESSAGE':
            return {
                ...state,
                registerSuccessMessage: ''
            };
        case 'REGISTER_FAILURE':
            return {
                ...state,
                isRegistering: false,
                loading: false,
                error: action.payload
            };
        case 'AUTH_UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
