import axios from 'axios';

export const submitRating = (ratingData) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:3000/ratings', ratingData);
        dispatch({ type: 'SUBMIT_RATING_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'SUBMIT_RATING_FAIL', payload: error.message });
    }
};

export const fetchRatingsByCourseId = (courseId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:3000/ratings/${courseId}`);
        dispatch({ type: 'FETCH_RATINGS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_RATINGS_FAIL', payload: error.message });
    }
};
