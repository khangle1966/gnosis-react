import axios from "axios";

// Các hằng số hành động (action constants)
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

// Hàm hành động để lấy danh sách các giảng viên
export const fetchInstructors = () => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:3000/v1/usergoogle/getintstructor/instructors');
    const data = await response.json();
    console.log('Fetched Instructors:', data);
    dispatch({ type: FETCH_INSTRUCTORS_SUCCESS, payload: data });

    // Lấy cấp độ của từng giảng viên
    for (const instructor of data) {
      const levelResponse = await axios.get(`http://localhost:3000/v1/usergoogle/instructor-level/${instructor.uid}`);
      dispatch({ type: FETCH_INSTRUCTOR_LEVEL_SUCCESS, payload: { uid: instructor.uid, level: levelResponse.data } });
    }
  } catch (error) {
    console.error('Error fetching instructors:', error);
  }
};

// Hàm hành động để tính lương cho giảng viên dựa trên uid
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

// Hàm hành động để lấy dữ liệu hàng tháng cho giảng viên dựa trên uid
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

// Hàm hành động để lấy tổng số người dùng từ hai API khác nhau
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

// Hàm hành động để lấy danh sách các đơn hàng từ API
export const fetchOrders = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/vnpay/order');
    dispatch({ type: FETCH_ORDERS, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

// Hàm hành động để lấy dữ liệu hàng tháng của người dùng từ API
export const fetchMonthlyUserData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/user/monthly/monthly-data');
    dispatch({ type: FETCH_MONTHLY_USER_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly user data:', error);
  }
};

// Hàm hành động để lấy dữ liệu hàng tháng của người dùng Google từ API
export const fetchMonthlyUsergoogleData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/usergoogle/monthly/monthly-data');
    dispatch({ type: FETCH_MONTHLY_USERGOOGLE_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly usergoogle data:', error);
  }
};

// Hàm hành động để lấy dữ liệu hàng tháng của khóa học từ API
export const fetchMonthlyCourseData = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:3000/v1/order/monthly-data');
    dispatch({ type: FETCH_MONTHLY_COURSE_DATA, payload: response.data });
  } catch (error) {
    console.error('Failed to fetch monthly course data:', error);
  }
};

// Hàm hành động để lấy dữ liệu doanh thu hàng tháng dựa trên năm từ API
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
