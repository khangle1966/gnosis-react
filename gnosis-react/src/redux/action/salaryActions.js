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

} from '../types/salaryTypes';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/salary';

export const fetchTotalSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_TOTAL_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/total-instructor-salary`);
    dispatch({ type: FETCH_TOTAL_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_TOTAL_SALARY_FAILURE, payload: error });
  }
};

export const fetchInstructorSalaryById = (instructorId) => async (dispatch) => {
  dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID });
  try {
    const response = await axios.get(`${BASE_URL}/instructor-salary/${instructorId}`);
    dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_INSTRUCTOR_SALARY_BY_ID_FAILURE, payload: error });
  }
};
export const fetchAdminSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_ADMIN_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/total-admin-salary/admin`);
    dispatch({ type: FETCH_ADMIN_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ADMIN_SALARY_FAILURE, payload: error });
  }
};



export const fetchInstructorsSalary = () => async (dispatch) => {
  dispatch({ type: FETCH_INSTRUCTORS_SALARY });
  try {
    const response = await axios.get(`${BASE_URL}/total-instructor-salary/instructors`);
    dispatch({ type: FETCH_INSTRUCTORS_SALARY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_INSTRUCTORS_SALARY_FAILURE, payload: error });
  }
};
