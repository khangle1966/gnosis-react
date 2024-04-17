import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import { courseReducer, courseDetailReducer } from './reducers/courseReducer';
import lessonReducer from './reducers/lessonReduver';
import { chapterReducer } from './reducers/chapterReducer';


const rootReducer = combineReducers({
    auth: authReducer,

    course: courseReducer,
    courseDetail: courseDetailReducer,
    lessonDetail: lessonReducer,
    chapterDetail: chapterReducer,


});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;


