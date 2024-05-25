export const fetchInstructors = () => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:3000/v1/usergoogle/getintstructor/instructors');
    const data = await response.json();
    console.log('Fetched Instructors:', data); // Kiểm tra dữ liệu trả về từ API
    dispatch({ type: 'FETCH_INSTRUCTORS_SUCCESS', payload: data });
  } catch (error) {
    console.error('Failed to fetch instructors:', error);
  }
};

export const calculateSalary = (uid) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/v1/usergoogle/calculate-salary/${uid}`);
    const data = await response.json();
    console.log('Calculated Salary:', data); // Kiểm tra dữ liệu trả về từ API
    dispatch({ type: 'CALCULATE_SALARY_SUCCESS', payload: data });
  } catch (error) {
    console.error('Failed to calculate salary:', error);
  }
};

export const fetchMonthlyData = (uid) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:3000/v1/usergoogle/monthly-data/${uid}`);
    const data = await response.json();
    console.log('Fetched Monthly Data:', data); // Kiểm tra dữ liệu trả về từ API
    dispatch({ type: 'FETCH_MONTHLY_DATA_SUCCESS', payload: { uid, data } });
  } catch (error) {
    console.error('Failed to fetch monthly data:', error);
  }
};
