import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
<<<<<<< HEAD
import loginReducer from './reducers/loginReducer';

const rootReducer = combineReducers({
    login: loginReducer
=======
import authReducer from './reducers/authReducer';
import { courseReducer, courseDetailReducer } from './reducers/courseReducer';
import lessonReducer from './reducers/lessonReduver';



const rootReducer = combineReducers({
    auth: authReducer,

    course: courseReducer,
    courseDetail: courseDetailReducer,
    lessonDetail: lessonReducer,


>>>>>>> 916cca0 (a)
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
);

export default store;
<<<<<<< HEAD
=======


>>>>>>> 916cca0 (a)
