const initialState = {
    isLoggedIn: false,
    isRegistering: false, // Thêm trạng thái đăng ký
    loading: false,
    user: null,
    error: '',
    registerSuccessMessage: ''
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
