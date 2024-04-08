const initialState = {
    isLoggedIn: false,
    loading: false,
    user: null,
    error: ''
};

const loginReducer = (state = initialState, action) => {
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
                user: action.payload,
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
                    ...state,
                    isLoggedIn: false,
                    loading: false,
                    user: null, // Đặt lại thông tin người dùng
                    error: '' // Xóa bất kỳ thông báo lỗi nào
                };
        default:
            return state;
    }
}

export default loginReducer;
