const initialState = {
    instructors: [],
    salaries: {},
    monthlyData: {},
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
        default:
            return state;
    }
};

export default adminReducer;
