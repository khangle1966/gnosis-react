import axios from "axios";
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_INSTRUCTORS = 'FETCH_INSTRUCTORS';
export const FETCH_MONTHLY_COURSE_DATA = 'FETCH_MONTHLY_COURSE_DATA';
export const FETCH_MONTHLY_REVENUE_DATA = 'FETCH_MONTHLY_REVENUE_DATA';

export const FETCH_MONTHLY_USER_DATA = 'FETCH_MONTHLY_USER_DATA';
export const FETCH_MONTHLY_USERGOOGLE_DATA = 'FETCH_MONTHLY_USERGOOGLE_DATA';

export const FETCH_MONTHLY_REVENUE_SUCCESS = 'FETCH_MONTHLY_REVENUE_SUCCESS';
export const FETCH_MONTHLY_REVENUE_FAILURE = 'FETCH_MONTHLY_REVENUE_FAILURE';
export const FETCH_INSTRUCTORS_SUCCESS = 'FETCH_INSTRUCTORS_SUCCESS';
export const CALCULATE_SALARY_SUCCESS = 'CALCULATE_SALARY_SUCCESS';
export const FETCH_MONTHLY_DATA_SUCCESS = 'FETCH_MONTHLY_DATA_SUCCESS';
export const FETCH_USERS = 'FETCH_USERS';

export const FETCH_PROFIT_SUCCESS = 'FETCH_PROFIT_SUCCESS';
export const FETCH_PROFIT_FAILURE = 'FETCH_PROFIT_FAILURE';
export const FETCH_INSTRUCTOR_SALARIES_SUCCESS = 'FETCH_INSTRUCTOR_SALARIES_SUCCESS';
export const FETCH_INSTRUCTOR_SALARIES_FAILURE = 'FETCH_INSTRUCTOR_SALARIES_FAILURE';
export const PAY_SALARIES_SUCCESS = 'PAY_SALARIES_SUCCESS';
export const PAY_SALARIES_FAILURE = 'PAY_SALARIES_FAILURE';
export const FETCH_INSTRUCTOR_LEVEL_SUCCESS = 'FETCH_INSTRUCTOR_LEVEL_SUCCESS';

export const fetchInstructors = () => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:3000/v1/usergoogle/getintstructor/instructors');
    const data = await response.json();
    console.log('Fetched Instructors:', data);
    dispatch({ type: FETCH_INSTRUCTORS_SUCCESS, payload: data });

    // Fetch instructor levels
    for (const instructor of data) {
      const levelResponse = await axios.get(`http://localhost:3000/v1/usergoogle/instructor-level/${instructor.uid}`);
      dispatch({ type: FETCH_INSTRUCTOR_LEVEL_SUCCESS, payload: { uid: instructor.uid, level: levelResponse.data } });
    }
  } catch (error) {
    console.error('Error fetching instructors:', error);
  }
};


export const calculateSalary = (uid) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/v1/usergoogle/calculate-salary/${uid}`);
    const data = await response.json();
    console.log('Calculated Salary:', data);
    dispatch({ type: CALCULATE_SALARY_SUCCESS, payload: data });
  } catch (error) {
    console.error('Failed to calculate salary:', error);
  }
};

export const fetchMonthlyData = (uid) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/v1/usergoogle/monthly-data/${uid}`);
    const data = await response.json();
    console.log('Fetched Monthly Data:', data);
    dispatch({ type: FETCH_MONTHLY_DATA_SUCCESS, payload: { uid, data } });
  } catch (error) {
    console.error('Failed to fetch monthly data:', error);
  }
};

export const fetchUsers = () => async dispatch => {
  try {
    const response1 = await axios.get('http://localhost:3000/v1/user');
    const response2 = await axios.get('http://localhost:3000/v1/usergoogle');
    const totalUsers = response1.data.length + response2.data.length;
    console.log('Fetched totalUsers:', totalUsers);

    dispatch({ type: FETCH_USERS, payload: totalUsers });
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

export const fetchOrders = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/vnpay/order');
    dispatch({ type: FETCH_ORDERS, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

export const fetchMonthlyUserData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/user/monthly/monthly-data');
    dispatch({ type: FETCH_MONTHLY_USER_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly user data:', error);
  }
};

export const fetchMonthlyUsergoogleData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/usergoogle/monthly/monthly-data');
    dispatch({ type: FETCH_MONTHLY_USERGOOGLE_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly usergoogle data:', error);
  }
};

export const fetchMonthlyCourseData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/order/monthly-data');
    dispatch({ type: FETCH_MONTHLY_COURSE_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly course data:', error);
  }
};

export const fetchMonthlyRevenueData = (year) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:3000/revenue/monthly?year=${year}`);
    dispatch({
      type: FETCH_MONTHLY_REVENUE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MONTHLY_REVENUE_FAILURE,
      payload: error,
    });
  }
};



