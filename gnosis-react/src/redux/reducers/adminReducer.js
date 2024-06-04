import {
    FETCH_MONTHLY_REVENUE_SUCCESS,
    FETCH_MONTHLY_REVENUE_FAILURE,
    FETCH_INSTRUCTORS_SUCCESS,
    CALCULATE_SALARY_SUCCESS,
    FETCH_MONTHLY_DATA_SUCCESS,
    FETCH_USERS,
    FETCH_ORDERS,
    FETCH_MONTHLY_USER_DATA,
    FETCH_MONTHLY_USERGOOGLE_DATA,
    FETCH_MONTHLY_COURSE_DATA,
    FETCH_MONTHLY_REVENUE_DATA,
    FETCH_PROFIT_SUCCESS,
    FETCH_PROFIT_FAILURE,
    FETCH_INSTRUCTOR_SALARIES_SUCCESS,
    FETCH_INSTRUCTOR_SALARIES_FAILURE,
    PAY_SALARIES_SUCCESS,
    PAY_SALARIES_FAILURE,
    FETCH_INSTRUCTOR_LEVEL_SUCCESS,

} from '../action/adminActions';

const initialState = {
    instructors: [],
    instructorLevels: {},
    salaries: {},
    monthlyData: {},
    users: 0,
    orders: [],
    monthlyUserData: [],
    monthlyUsergoogleData: [],
    monthlyCourseData: [],
    monthlyRevenueData: [],
    monthlyRevenue: [],
    profit: 0,
    instructorSalaries: [],
    error: null
};


const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_INSTRUCTORS_SUCCESS:
            console.log('Reducer Instructors:', action.payload);
            return { ...state, instructors: action.payload || [] };
        case FETCH_INSTRUCTOR_LEVEL_SUCCESS:
            return {
                ...state,
                instructorLevels: {
                    ...state.instructorLevels,
                    [action.payload.uid]: action.payload.level,
                },
            };
        case CALCULATE_SALARY_SUCCESS:
            return {
                ...state,
                salaries: {
                    ...state.salaries,
                    [action.payload.uid]: action.payload.salary,
                },
            };
        case FETCH_MONTHLY_DATA_SUCCESS:
            return {
                ...state,
                monthlyData: {
                    ...state.monthlyData,
                    [action.payload.uid]: action.payload.data,
                },
            };
        case FETCH_USERS:
            return { ...state, users: action.payload };
        case FETCH_ORDERS:
            return { ...state, orders: action.payload };
        case FETCH_MONTHLY_USER_DATA:
            return { ...state, monthlyUserData: action.payload };
        case FETCH_MONTHLY_USERGOOGLE_DATA:
            return { ...state, monthlyUsergoogleData: action.payload };
        case FETCH_MONTHLY_COURSE_DATA:
            return { ...state, monthlyCourseData: action.payload };
        case FETCH_MONTHLY_REVENUE_SUCCESS:
            return {
                ...state,
                monthlyRevenue: action.payload,
            };
        case FETCH_MONTHLY_REVENUE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_PROFIT_SUCCESS:
            return {
                ...state,
                profit: action.payload,
            };
        case FETCH_PROFIT_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_INSTRUCTOR_SALARIES_SUCCESS:
            return {
                ...state,
                instructorSalaries: action.payload,
            };
        case FETCH_INSTRUCTOR_SALARIES_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case PAY_SALARIES_SUCCESS:
            return {
                ...state,
                salaries: {},
            };
        case PAY_SALARIES_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default adminReducer;
