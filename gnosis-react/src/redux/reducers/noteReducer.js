
export const notesReducer = (state = { notes: [], loading: false, error: null }, action) => {
    switch (action.type) {
        case 'NOTES_FETCH_REQUEST':
            return { loading: true, notes: [] };
        case 'NOTES_FETCH_SUCCESS':
            return { loading: false, notes: action.payload };
        case 'NOTES_FETCH_FAIL':
            return { loading: false, error: action.payload, notes: [] };
        case 'NOTE_ADD_SUCCESS': // Xử lý khi thêm ghi chú thành công
            return {
                ...state,
                notes: [...state.notes, action.payload]  // Thêm ghi chú mới vào mảng hiện tại
            };
        case 'NOTE_DELETE_REQUEST':
            return { ...state, loading: true };
        case 'NOTE_DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                notes: state.notes.filter(note => note._id !== action.payload)
            };
        case 'NOTE_DELETE_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'NOTE_EDIT_REQUEST':
            return { ...state, loading: true };
        case 'NOTE_EDIT_SUCCESS':
            return {
                ...state,
                loading: false,
                notes: state.notes.map(note => note._id === action.payload._id ? action.payload : note)
            };
        case 'NOTE_EDIT_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export const noteAddReducer = (state = {}, action) => {
    switch (action.type) {
        case 'NOTE_ADD_REQUEST':
            return { loading: true };
        case 'NOTE_ADD_SUCCESS':
            return { loading: false, success: true, note: action.payload };
        case 'NOTE_ADD_FAIL':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
