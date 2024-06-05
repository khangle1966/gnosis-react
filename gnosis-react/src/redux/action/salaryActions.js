import {
  FETCH_TOTAL_SALARY,
  FETCH_TOTAL_SALARY_SUCCESS,
  FETCH_TOTAL_SALARY_FAILURE,
  FETCH_INSTRUCTOR_SALARY_BY_ID,
  FETCH_INSTRUCTOR_SALARY_BY_ID_SUCCESS,
  FETCH_INSTRUCTOR_SALARY_BY_ID_FAILURE,
  FETCH_ADMIN_SALARY,
  FETCH_ADMIN_SALARY_SUCCESS,
  FETCH_ADMIN_SALARY_FAILURE,
  FETCH_INSTRUCTORS_SALARY,
  FETCH_INSTRUCTORS_SALARY_SUCCESS,
  FETCH_INSTRUCTORS_SALARY_FAILURE,
  CREATE_PAYMENT,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  FETCH_PAYMENTS,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
  UPDATE_PAYMENT_SUCCESS
} from '../types/salaryTypes';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchTotalSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_TOTAL_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/salary/total-instructor-salary`);
    dispatch({ type: FETCH_TOTAL_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOTAL_SALARY_FAILURE, payload: error });
  }
};

export const fetchInstructorSalaryById = (instructorId) => async (dispatch) => {
  dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID });
  try {
    const response = await axios.get(`${BASE_URL}/salary/instructor-salary/${instructorId}`);
    const data = response.data;
    dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID_SUCCESS, payload: data });
    return data; // Trả về dữ liệu payload
  } catch (error) {
    dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID_FAILURE, payload: error });
    throw error; // Ném lỗi ra ngoài
  }
};

export const fetchAdminSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_ADMIN_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/salary/total-admin-salary/admin`);
    dispatch({ type: FETCH_ADMIN_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ADMIN_SALARY_FAILURE, payload: error });
  }
};

export const fetchInstructorsSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_INSTRUCTORS_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/salary/total-instructor-salary/instructors`);
    dispatch({ type: FETCH_INSTRUCTORS_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_INSTRUCTORS_SALARY_FAILURE, payload: error });
  }
};

export const fetchPayments = (userId, year) => async (dispatch) => {
  dispatch({ type: FETCH_PAYMENTS });
  try {
    const response = await axios.get(`${BASE_URL}/payments/${userId}/${year}`);
    dispatch({ type: FETCH_PAYMENTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_PAYMENTS_FAILURE, payload: error });
  }
};
export const createPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT });
  try {
    const response = await axios.post(`${BASE_URL}/payments`, paymentData);
    dispatch({ type: CREATE_PAYMENT_SUCCESS, payload: response.data });
    dispatch(updatePaymentSuccess(response.data));
  } catch (error) {
    dispatch({ type: CREATE_PAYMENT_FAILURE, payload: error });
  }
};

export const updatePaymentSuccess = (payment) => ({
  type: UPDATE_PAYMENT_SUCCESS,
  payload: payment,
});