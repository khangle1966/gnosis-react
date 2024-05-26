const initialState = {
    instructors: [],
    salaries: {},
    monthlyData: {},
    users: 0,
    orders: [],

    monthlyUserData: [],
    monthlyUsergoogleData: [],
    monthlyCourseData: [],
    monthlyRevenueData: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_INSTRUCTORS_SUCCESS':
            console.log('Reducer Instructors:', action.payload); // Kiểm tra dữ liệu trong reducer
            return { ...state, instructors: action.payload };
        case 'CALCULATE_SALARY_SUCCESS':
            return {
                ...state,
                salaries: {
                    ...state.salaries,
                    [action.payload.uid]: action.payload.salary,
                },
            };
        case 'FETCH_MONTHLY_DATA_SUCCESS':
            return {
                ...state,
                monthlyData: {
                    ...state.monthlyData,
                    [action.payload.uid]: action.payload.data,
                },
            };
        case 'FETCH_USERS':
            return { ...state, users: action.payload };
        case 'FETCH_ORDERS':
            return { ...state, orders: action.payload };
        case 'FETCH_MONTHLY_USER_DATA':
            return { ...state, monthlyUserData: action.payload };
        case 'FETCH_MONTHLY_USERGOOGLE_DATA':
            return { ...state, monthlyUsergoogleData: action.payload };
        case 'FETCH_MONTHLY_COURSE_DATA':
            return { ...state, monthlyCourseData: action.payload };
        case 'FETCH_MONTHLY_REVENUE_DATA':
            return { ...state, monthlyRevenueData: action.payload };
        default:
            return state;
    }
};

export default adminReducer;
