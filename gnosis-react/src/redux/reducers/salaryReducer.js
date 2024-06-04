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

const initialState = {
  totalSalary: null,
  instructorSalary: null,
  adminSalary: null,
  instructorsSalary: [],
  instructors: [], // Thêm instructors vào state
  payments: [],
  loading: false,
  error: null,
};

const salaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TOTAL_SALARY:
    case FETCH_INSTRUCTOR_SALARY_BY_ID:
    case FETCH_ADMIN_SALARY:


    case FETCH_INSTRUCTORS_SALARY:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PAYMENTS:
    case CREATE_PAYMENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TOTAL_SALARY_SUCCESS:
      return {
        ...state,
        totalSalary: action.payload,
        loading: false,
      };
    case FETCH_INSTRUCTOR_SALARY_BY_ID_SUCCESS:
      return {
        ...state,
        instructorSalary: action.payload,
        loading: false,
      };
    case FETCH_ADMIN_SALARY_SUCCESS:
      return {
        ...state,
        adminSalary: action.payload,
        loading: false,
      };
    case FETCH_INSTRUCTORS_SALARY_SUCCESS:
      return {
        ...state,
        instructorsSalary: action.payload,
        loading: false,
      };
    case FETCH_PAYMENTS_SUCCESS:
      return {
        ...state,
        payments: action.payload,
        loading: false,
      };

    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_PAYMENT_SUCCESS:
      return {
        ...state,
        payments: [...state.payments, action.payload],
      };
    case FETCH_TOTAL_SALARY_FAILURE:
    case FETCH_INSTRUCTOR_SALARY_BY_ID_FAILURE:
    case FETCH_ADMIN_SALARY_FAILURE:
    case FETCH_INSTRUCTORS_SALARY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_PAYMENTS_FAILURE:

    case CREATE_PAYMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default salaryReducer;
