import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  // Đây là cách đúng để import 'thunk' từ 'redux-thunk'
import authReducer from './reducers/authReducer';
import { courseReducer, courseDetailReducer } from './reducers/courseReducer';
import lessonReduver from './reducers/lessonReduver'; // Đã sửa tên biến cho đúng với tên file
import { chapterReducer } from './reducers/chapterReducer';
import profileReducer from './reducers/profileReducer';
import cartReducer from './reducers/cartReducer';


// Combine reducers để tạo rootReducer
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    courseDetail: courseDetailReducer,
    lessonDetail: lessonReduver,
    chapterDetail: chapterReducer,
    cart: cartReducer,
});

// Tạo store với rootReducer và middleware
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)  // Thunk middleware cho phép viết action creators trả về function
);

export default store;
