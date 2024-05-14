import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  // Đây là cách đúng để import 'thunk' từ 'redux-thunk'
import authReducer from './reducers/authReducer';
import { courseReducer, courseDetailReducer } from './reducers/courseReducer';
import lessonReduver from './reducers/lessonReduver'; // Đã sửa tên biến cho đúng với tên file
import { chapterReducer } from './reducers/chapterReducer';
import profileReducer from './reducers/profileReducer';
import cartReducer from './reducers/cartReducer';
import { videoUploadReducer } from './reducers/uploadReducer';
import lessonReducer from './reducers/lessonCompleteReducer';
import { notesReducer, noteAddReducer } from './reducers/noteReducer';

// Combine reducers để tạo rootReducer
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    courseDetail: courseDetailReducer,
    lessonDetail: lessonReduver,
    chapterDetail: chapterReducer,
    cart: cartReducer,
    uploadVideo: videoUploadReducer,
    lessonComplete: lessonReducer,
    notesData: notesReducer,
    noteAdd: noteAddReducer,
});
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

// Tạo store với rootReducer và middleware
const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunk)  // Thunk middleware cho phép viết action creators trả về function
);
store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export default store;
