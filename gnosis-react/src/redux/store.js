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
import { ratingReducer } from './reducers/ratingReducer';
import favoriteReducer from './reducers/favoriteReducer';
import adminReducer from './reducers/adminReducer';
import { userReducer } from './reducers/userReducer';
import { userGoogleReducer } from './reducers/userGoogleReducer';
import salaryReducer from './reducers/salaryReducer';
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
    ratings: ratingReducer,
    favorite: favoriteReducer,
    admin: adminReducer,
    user: userReducer,
    userGoogle: userGoogleReducer,
    salary: salaryReducer,


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
