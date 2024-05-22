const initialState = {
    isLoggedIn: false,
    isRegistering: false,
    loading: false,
    user: null,
    error: '',
    registerSuccessMessage: '',
    role: null,  // Thêm trường này để lưu trữ vai trò của người dùng
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
                profileComplete: action.payload.profileComplete, // profileComplete được cập nhật dựa trên payload
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
                profileCompleteGoogle: action.payload.profileCompleteGoogle, // profileComplete được cập nhật dựa trên payload
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
                ...state,
                isLoggedIn: false,
                loading: false,
                user: null,
                error: ''
            };
        // Thêm các trường hợp xử lý cho đăng ký
        case 'REGISTER_REQUEST':
            return {
                ...state,
                isRegistering: true,
                loading: true,
                error: '' // Xóa lỗi trước khi bắt đầu yêu cầu mới
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isRegistering: false,
                loading: false,
                user: action.payload,
                error: '',
                registerSuccessMessage: 'Tạo thành công tài khoản, bạn có thể đăng nhập ngay bây giờ.' // Cập nhật thông báo ở đây
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

        default:
            return state;
    }
}

export default authReducer;
