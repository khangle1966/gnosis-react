// src/redux/actions/noteActions.js
import axios from '../../api/axios';

export const fetchNotes = (userId) => async (dispatch) => {
  try {
    dispatch({ type: 'NOTES_FETCH_REQUEST' });
    const { data } = await axios.get(`/notes/user/${userId}`);
    dispatch({ type: 'NOTES_FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'NOTES_FETCH_FAIL',
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const addNote = (noteData) => async (dispatch) => {
  try {
    dispatch({ type: 'NOTE_ADD_REQUEST' });
    const { data } = await axios.post('/notes', noteData);
    dispatch({ type: 'NOTE_ADD_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'NOTE_ADD_FAIL',
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const deleteNote = (noteId) => async (dispatch) => {
  try {
    dispatch({ type: 'NOTE_DELETE_REQUEST' });
    await axios.delete(`/notes/${noteId}`);
    dispatch({ type: 'NOTE_DELETE_SUCCESS', payload: noteId });
  } catch (error) {
    dispatch({
      type: 'NOTE_DELETE_FAIL',
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};


export const editNote = (noteId, noteData) => async (dispatch) => {
  try {
    dispatch({ type: 'NOTE_EDIT_REQUEST' });
    const { data } = await axios.patch(`/notes/${noteId}`, noteData);
    dispatch({ type: 'NOTE_EDIT_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'NOTE_EDIT_FAIL',
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
